import { LongRangeHauler } from "Creeps/LongRangeHauler";

export class LongRangeBuilder extends LongRangeHauler {
    constructor(creep: Creep) {
        super(creep)
    }

    run() {
        this.switchState();

        if(this.creep.memory.working) {
            if(Game.flags.build.room == undefined) {
                this.creep.moveTo(Game.flags.build)
            } else if(this.dest_room != undefined) {
                if(this.target == undefined) {
                    var construction_sites = this.dest_room.find(FIND_CONSTRUCTION_SITES); 
                    this.target = construction_sites[0] // <ConstructionSite> this.creep.pos.findClosestByPath(construction_sites);
                }

                if(this.creep.build(<ConstructionSite> this.target) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(this.target)
                }
            }
        } else {
            if(this.source_room != undefined && this.creep.room.name == this.source_room.name) {
                // go back to get some more energy
                if(this.anchor == undefined && this.source_room != undefined) {

                    var containers = this.source_room.find<StructureContainer>(FIND_STRUCTURES, 
                        {filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > this.creep.carryCapacity})

                    var closestContainer = this.creep.pos.findClosestByPath(containers)

                    if(closestContainer != null) {
                        this.anchor = closestContainer;
                    }
                }

                if(this.anchor != undefined && this.creep.withdraw(<StructureContainer> this.anchor, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(this.anchor);
                }
            } else {
                var container = <StructureContainer> this.creep.pos.findClosestByPath(FIND_STRUCTURES, 
                    {filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > this.creep.carryCapacity});

                if(container != undefined) {
                    if(container != undefined && this.creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(container);
                    }
                } else {
                    var source = this.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)
                    if(source != null && this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(source);
                    }
                }


            }
        }
    }
}

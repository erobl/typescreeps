import { LongRangeHauler } from "Creeps/LongRangeHauler";

export class Claimer extends LongRangeHauler {
    constructor(creep: Creep) {
        super(creep)
    }

    run() {
        this.switchState();

        if(this.creep.memory.working) {
            if(Game.flags.claim.room == undefined) {
                this.creep.moveTo(Game.flags.claim)
            } else if(Game.flags.claim.room.controller != undefined && this.creep.claimController(Game.flags.claim.room.controller) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(Game.flags.claim.room.controller);
            }
        } else {
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
        }
    }
}

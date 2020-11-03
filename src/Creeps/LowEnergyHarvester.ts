import { CreepJob } from "Creeps/CreepJob";

export class LowEnergyHarvester extends CreepJob {
    constructor(creep: Creep) {
        super(creep);
    }

    run() {
        if(this.creep.memory.working && this.creep.carry.energy == 0) {
            this.creep.memory.working = false;
        } else if (!this.creep.memory.working && this.creep.carry.energy == this.creep.carryCapacity) {
            this.creep.memory.working = true;
        }

		if(this.creep.memory.working) {
            var structure = this.creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) =>  (s.structureType == 
                            (  STRUCTURE_SPAWN 
                            || STRUCTURE_EXTENSION 
                            || STRUCTURE_TOWER))
                            &&   s.energy < s.energyCapacity
            });

            if(structure != null) {
                if(this.creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(structure);
                }
            }
        } else { 
            var source = this.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)
            if(source != null && this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(source);
            }
        } 
    }
}

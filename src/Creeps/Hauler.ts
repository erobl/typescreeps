import { CreepJob } from "Creeps/CreepJob";

export abstract class Hauler extends CreepJob {
    target : Structure | ConstructionSite | undefined;
    constructor(creep: Creep) {
        super(creep);
        this.target = undefined;
    }

    findTarget() {
        this.target = <StructureContainer> this.creep.pos.findClosestByPath(FIND_STRUCTURES, 
            {filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > this.creep.carryCapacity});
    }

    switchState() {
        if(this.creep.memory.working && this.creep.carry.energy == 0) {
            this.creep.say("Gathering!")
            this.target = undefined;
            return this.creep.memory.working = false;
        } else if (!this.creep.memory.working && this.creep.carry.energy == this.creep.carryCapacity) {
            this.creep.say("Working!")
            this.target = undefined;
            return this.creep.memory.working = true;
        }
        return this.creep.memory.working;
    }

}
import { Hauler } from "Creeps/Hauler";


export class Upgrader extends Hauler {
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

    run() {
        this.switchState();
        this.findTarget();

        if(this.creep.memory.working) {
            if(this.creep.room.controller != undefined && this.creep.upgradeController(this.creep.room.controller) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(this.creep.room.controller);
            }
        } else {
            if(this.creep.withdraw(<StructureContainer> this.target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                if(this.target != undefined) {
                    this.creep.moveTo(this.target);
                }
            }
        }
    }
}
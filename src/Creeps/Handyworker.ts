import { Hauler } from "Creeps/Hauler";
import { Upgrader } from "Creeps/Upgrader"; 
export class Handyworker extends Hauler {
    findTarget() {
        if(this.target == undefined) {
            if(this.creep.memory.working) {
                if(this.creep.memory.job == "energyCarrier") {
                    this.target = <StructureSpawn | StructureExtension | StructureTower> this.creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (s) =>  (s.structureType == STRUCTURE_SPAWN     ||
                                    s.structureType == STRUCTURE_EXTENSION ||
                                    s.structureType == STRUCTURE_TOWER)    &&
                                    s.energy < s.energyCapacity
                    }); 
                } else if(this.creep.memory.job == "repairer") {
                    this.target = <Structure> this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
                    });
                } else if(this.creep.memory.job == "builder") {
                    this.target = <ConstructionSite> this.creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                }
            } else {
                this.target = <StructureContainer> this.creep.pos.findClosestByPath(FIND_STRUCTURES, 
                    {filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > this.creep.carryCapacity});
            }
        }
    }

    run() {
        this.switchState();
        this.findTarget();

        if(this.creep.memory.working) {
            if(this.target != undefined) {
                if(this.creep.memory.job == "energyCarrier") {
                    if(this.creep.transfer(<Structure> this.target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(this.target);
                    }
                } else if(this.creep.memory.job == "repairer") {
                    if(this.creep.repair(<Structure> this.target) == ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(this.target);
                    }
                } else if(this.creep.memory.job == "builder") {
                    if(this.creep.build(<ConstructionSite> this.target) == ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(this.target)
                    }
                }
            }
        } else {
            if(this.creep.withdraw(<StructureContainer> this.target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                if(this.target != undefined) {
                    this.creep.moveTo(this.target);
                }
            }
        }

        if(this.target == undefined) {
            var u = new Upgrader(this.creep);
            u.run();
        }
    }
}
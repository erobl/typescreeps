import { CreepJob } from "Creeps/CreepJob";
import { Handyworker } from "Creeps/Handyworker";
import { Upgrader } from "Creeps/Upgrader";

export class LowEnergyHarvester extends CreepJob {
    altjob: CreepJob;
    constructor(creep: Creep) {
        super(creep);
	if(this.creep.memory.backupjob == "builder") {
	    var h = new Handyworker(this.creep);
	    h.target = <ConstructionSite> this.creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
	    this.altjob = h;
	} else {
            this.altjob = new Upgrader(this.creep);
	}
    }

    run() {
        if(this.creep.memory.working && this.creep.carry.energy == 0) {
            this.creep.memory.working = false;
        } else if (!this.creep.memory.working && this.creep.carry.energy == this.creep.carryCapacity) {
          this.creep.memory.working = true;
          if(Math.random() > 0.5) {
	    this.creep.memory.backupjob = "builder";
            this.creep.say("Building!");
            var h = new Handyworker(this.creep);
            h.target = <ConstructionSite> this.creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            this.altjob = h;
          } else {
	    this.creep.memory.backupjob = "upgrader";
            this.creep.say("Upgrading!");
            this.altjob = new Upgrader(this.creep);
          }
        }

        if(this.creep.memory.working) {
          var structure = this.creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
              filter: (s) =>  (s.structureType == 
                        (  STRUCTURE_SPAWN 
                        || STRUCTURE_EXTENSION 
                        || STRUCTURE_TOWER))
                        &&   s.energy < s.energyCapacity
          });

          if(structure != null) {
              if(this.creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                  this.creep.moveTo(structure);
              } else {
		  var directions = [TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT]
		  var direction = directions[Math.floor(Math.random() * directions.length)];
                  this.creep.move(direction);
	      }
          } else {
              this.altjob.run();
          }
        } else { 
            var source = this.creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE)
            if(source != null && this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(source);
            }
        } 
    }
}

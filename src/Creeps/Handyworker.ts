import { Hauler } from "Creeps/Hauler";
import { Upgrader } from "Creeps/Upgrader"; 
export class Handyworker extends Hauler {
    building: boolean;
    constructor(creep: Creep) {
        super(creep)
        this.building = false;
    }
    findTarget() {
        this.building = false;
        if(this.target == undefined) {
            if(this.creep.memory.working) {
                if(this.creep.memory.job == "energyCarrier") {
                    this.target = <StructureSpawn | StructureExtension | StructureTower> this.creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: (s) =>  (s.structureType == STRUCTURE_SPAWN     ||
                                    s.structureType == STRUCTURE_EXTENSION ||
                                    s.structureType == STRUCTURE_TOWER)    &&
                                    s.energy < s.energyCapacity
                    }); 

                    if(this.target == undefined) {
                      var storages = this.creep.room.find<StructureStorage>(FIND_MY_STRUCTURES, {
                        filter: (s) => s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] < 100000
                      });

                      if (storages.length > 0) {
                          this.target = storages[0]
                      }
                    }
                } else if(this.creep.memory.job == "repairer") {
                    this.target = <Structure> this.creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
                    });
                } else if(this.creep.memory.job == "builder") {
                    this.target = <ConstructionSite> this.creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                }
            } else {
                this.target = <StructureContainer> this.creep.pos.findClosestByRange(FIND_STRUCTURES, 
                    {filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > this.creep.carryCapacity});
            }
        }
    }

    moveAdjacent(maxDistanceFromTarget: number) {
      if(this.target != undefined) {
          var directions = [[0,-1], [1,-1], [1,0], [1,1], [0,1], [-1,1], [-1,0], [-1,-1], [0,0]];
          var dirnames = [TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT];
          var dirindex = 0;
          for(var i = 0; i < 20; i++) {
              dirindex = Math.floor(Math.random() * directions.length);
              var direction = directions[dirindex];
              var newPos = this.creep.pos;
              newPos.x = newPos.x + direction[0]
              newPos.y = newPos.y + direction[1]
              if(newPos.inRangeTo(this.target, maxDistanceFromTarget)) {
                break;
              }
          }
          if(dirindex < dirnames.length - 1) {
              this.creep.move(dirnames[dirindex]);
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
                        this.creep.moveTo(this.target, {maxRooms: 1});
                    }
                } else if(this.creep.memory.job == "repairer") {
                    if(this.creep.repair(<Structure> this.target) == ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(this.target, {maxRooms: 1});
                    } else {
                        this.moveAdjacent(3);
                    }
                } else if(this.creep.memory.job == "builder" || this.creep.memory.role == "lowenergyharvester") {
                    if(this.creep.build(<ConstructionSite> this.target) == ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(this.target, {maxRooms: 1})
                    } else {
                        this.moveAdjacent(3)
                    }
                }
            }
        } else {
            if(this.target != undefined && this.creep.withdraw(<StructureContainer> this.target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
		// the creep shouldn't change rooms
                this.creep.moveTo(this.target, {maxRooms: 1});
            }
        }

        if(this.target == undefined) {
            var u = new Upgrader(this.creep);
            u.run();
        }
    }
}

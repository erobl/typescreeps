import { CreepJob } from "Creeps/CreepJob";

export class Harvester extends CreepJob {
    containerId: Id<StructureContainer> | undefined;
    sourceId: Id<Source>;
    constructor(creep: Creep) {
        super(creep);
        if(creep.name in this.creep.room.memory.creepAllocation) {
            this.containerId = this.creep.room.memory.creepAllocation[creep.name];
        } else {
            this.containerId = undefined
        }

        if(this.creep.room.memory.containerSource == undefined) {
            this.creep.room.memory.containerSource = {};
        } 

        this.sourceId = this.creep.room.memory.containerSource[this.containerId as string];
        if(this.sourceId == undefined && this.containerId != undefined) {
            var container = Game.getObjectById(this.containerId);
            if(container != null) {
                var source = container.pos.findClosestByRange(FIND_SOURCES);
                if(source != null) {
                    this.sourceId = source.id;
                    this.creep.room.memory.containerSource[this.containerId] = this.sourceId;
                } else {
                    console.log("No sources found in this room");
                }
            }
        }
    }

    run() {
        if(this.containerId == undefined) {
          // try to claim a new container
          var containers = this.creep.room.find<StructureContainer>(FIND_STRUCTURES, 
              { filter: { structureType: STRUCTURE_CONTAINER } });
          var nameAssigned = false;
          for(var container of containers) {
            var assigned = false;
            for(let creepId in this.creep.room.memory.creepAllocation) {
                if(container.id == this.creep.room.memory.creepAllocation[creepId]) {
                    assigned = true;
                }
            }

            if(!assigned) {
                this.creep.room.memory.creepAllocation[this.creep.name] = container.id;
                nameAssigned = true;
                break;
            }
          }
          this.containerId = this.creep.room.memory.creepAllocation[this.creep.name];
        }

        if(this.containerId != undefined) {
          var target = Game.getObjectById(this.containerId);
          var source = Game.getObjectById(this.sourceId);

          if(source != null && target != null && this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
              this.creep.moveTo(target);
          }
        }
    }
}

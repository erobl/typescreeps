import { CreepJob } from "Creeps/CreepJob";

export class Harvester extends CreepJob {
    containerId: Id<StructureContainer>;
    sourceId: Id<Source>;
    constructor(creep: Creep) {
        super(creep);
        this.containerId = this.creep.room.memory.creepAllocation[creep.name];

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
        var container = Game.getObjectById(this.containerId);
        var source = Game.getObjectById(this.sourceId);
        
        if(source != null && container != null && this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(container);
        }
    }
}

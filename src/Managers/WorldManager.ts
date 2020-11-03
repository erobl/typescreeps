import { ExportDefaultDeclaration } from "estree";
import { RoomManager } from "Managers/RoomManager";
import { CreepManager } from "Managers/CreepManager";

export class WorldManager {
    defcon: number;
    roomqueue: number[];
    roomManagers: RoomManager[];
    constructor() {
        this.manageMemory();
        this.defcon = Memory.defcon;
        this.roomqueue = Memory.roomqueue;
        this.roomManagers = [];
        for(var room in Game.rooms) {
            this.roomManagers.push(new RoomManager(Game.rooms[room]));
        }
    }

    run() {
        for (var rm of this.roomManagers) {
            rm.run();
        }

        var cm = new CreepManager();
        cm.run();
    }

    manageMemory() {
        for (const name in Memory.creeps) {
            if (!(name in Game.creeps)) {
                delete Memory.creeps[name];
                for(var room in Game.rooms) {
                    delete Game.rooms[room].memory.creepAllocation[name];
                }
            }
        }

        if(Memory.defcon == undefined) {
            Memory.defcon = -1
        }

        if(Memory.roomqueue == undefined) {
            Memory.roomqueue = [];
        }
    }
    
}

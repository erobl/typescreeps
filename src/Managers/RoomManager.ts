import { StructureManager } from "Managers/StructureManager";

export class RoomManager {
    room : Room
    sm : StructureManager
    constructor(room : Room) {
        this.room = room;
        this.sm = new StructureManager(room);
        if(this.room.memory.lowEnergyMode == undefined) {
            this.room.memory.lowEnergyMode = false;
        }
    }

    updateStats() {
        if(this.room.controller != null) {
            Memory.stats["progress"][this.room.name] = this.room.controller.progress;
            Memory.stats["progressPercentage"][this.room.name] = this.room.controller.progress / this.room.controller.progressTotal;
        }
    }

    defendRoom() {
        var hostiles = this.room.find(FIND_HOSTILE_CREEPS);
        if(hostiles.length > 0) {
            var username = hostiles[0].owner.username;
            Game.notify(`User ${username} spotted in room ${this.room.name}`);
            var towers = this.room.find<StructureTower>(
                FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
            towers.forEach(tower => tower.attack(hostiles[0]));
        }
    }

    autoBuilder() {
        // (0,0) is always blocked (as far as I can tell) so it's a great candidate to check if something can be built
        if(this.room.createConstructionSite(0,0,STRUCTURE_EXTENSION) == ERR_INVALID_TARGET) {
            var spawns = this.room.find(FIND_MY_STRUCTURES, { filter : {structureType : STRUCTURE_CONTAINER} });
            var range = 5;
            var result : ScreepsReturnCode = ERR_INVALID_TARGET;
            while(result == ERR_INVALID_TARGET) {
                var flee = PathFinder.search(spawns[0].pos, {pos: spawns[0].pos, range: range}, {flee:true})
                var pos = flee.path[flee.path.length]
                if(pos.x % 2 == pos.y % 2) {
                    result = pos.createConstructionSite(STRUCTURE_EXTENSION)
                } else {
                    result = pos.createConstructionSite(STRUCTURE_ROAD)
                }
                range = range + 1;
            }
        }
    }

    run() {
        this.sm.run();
        this.updateStats();
        this.defendRoom();
    }
}

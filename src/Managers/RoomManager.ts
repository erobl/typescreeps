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

    run() {
        this.sm.run();
        this.updateStats();
        this.defendRoom();
    }
}

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

    run() {
        this.sm.run();
    }
}
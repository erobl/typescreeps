import { SpawnManager } from "Managers/SpawnManager";

export class StructureManager {
    sm : SpawnManager[];
    constructor(room: Room) {
        this.sm = [];
        var spawns = room.find(FIND_MY_SPAWNS)
        var containers = room.find(FIND_MY_STRUCTURES, { filter : {structureType : STRUCTURE_CONTAINER} });
        for(var spawn of spawns) {
            this.sm.push(new SpawnManager(spawn, containers))
        }
        if(this.sm.length > 1) {
            console.log("This is made with the assumption that there's 1 spawn in a room. It might break if there's more spawns.")
        }
    }
    run() {
        for(var spawnmanager of this.sm) {
            spawnmanager.run();
        }
    }
}
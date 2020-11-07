import { Hauler } from "Creeps/Hauler";

export abstract class LongRangeHauler extends Hauler {
    dest_room: Room | undefined;
    anchor: Structure | undefined;
    constructor(creep: Creep) {
        super(creep);
        if(creep.memory.dest_room != undefined) {
            this.dest_room = Game.rooms[creep.memory.dest_room];
        } else {
            this.dest_room = undefined
        }
        this.target = undefined;
    }
}

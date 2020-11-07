export abstract class CreepJob {
    creep : Creep;
    source_room: Room | undefined;
    constructor(creep: Creep) {
        if(creep.memory.source_room != undefined) {
            this.source_room = Game.rooms[creep.memory.source_room];
        } else {
            this.source_room = undefined
        }
        this.creep = creep;
    }

    abstract run(): void;
}

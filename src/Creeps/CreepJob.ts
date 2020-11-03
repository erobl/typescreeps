export abstract class CreepJob {
    creep : Creep;
    constructor(creep: Creep) {
        this.creep = creep;
    }

    abstract run(): void;
}
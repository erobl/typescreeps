import { CreepJob } from "Creeps/CreepJob";
import { Harvester } from "Creeps/Harvester";
import { Hauler } from "Creeps/Hauler";
import { Handyworker } from "Creeps/Handyworker";
import { Upgrader } from "Creeps/Upgrader";
import { LowEnergyHarvester } from "Creeps/LowEnergyHarvester";
export class CreepManager {
    creeps : CreepJob[];
    handyworkers : Handyworker[];
    constructor() {
        this.creeps = [];
        this.handyworkers = [];
        for(var c in Game.creeps) {
            var creep = Game.creeps[c];
            if(creep.memory.role == "harvester") {
                var harvester = new Harvester(creep);
                this.creeps.push(harvester);
            } else if(creep.memory.role == "handyworker") {
                var hauler = new Handyworker(creep);
                this.handyworkers.push(hauler);
                this.creeps.push(hauler);
            } else if(creep.memory.role == "upgrader") {
                var upgrader = new Upgrader(creep);
                this.creeps.push(upgrader);
            } else if(creep.memory.role == "lowenergyharvester") {
                var leharvester = new LowEnergyHarvester(creep);
                this.creeps.push(leharvester);
            }

        }
    }

    run() {
        for(var creep of this.creeps) {
            creep.run();
        }

        var counter : { [id: string] : number } = {
            "energyCarrier": 0,
            "repairer": 0,
            "builder": 0
        };

        var unassigned = [];
        for(var handyworker of this.handyworkers) {
            if(handyworker.creep.memory.job != undefined) {
                counter[handyworker.creep.memory.job]++;
            } else {
                unassigned.push(handyworker);
            }
        }

        for(var u in unassigned) {
            var job = this.assignJob(unassigned[u], counter);
            counter[job]++;
        }
    }

    assignJob(creep : Handyworker, counter : {[id: string]: number}) {
        for(var key in counter) {
            if(counter[key] == 0) {
                creep.creep.memory.job = key;
                return key;
            }
        }
        
        creep.creep.memory.job = "energyCarrier";
        return "energyCarrier";
    }
}

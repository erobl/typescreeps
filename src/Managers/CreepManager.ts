import { CreepJob } from "Creeps/CreepJob";
import { Harvester } from "Creeps/Harvester";
import { Hauler } from "Creeps/Hauler";
import { Handyworker } from "Creeps/Handyworker";
import { Upgrader } from "Creeps/Upgrader";
import { LowEnergyHarvester } from "Creeps/LowEnergyHarvester";
import { Claimer } from "Creeps/Claimer";
import { LongRangeBuilder } from "Creeps/LongRangeBuilder";
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
            } else if(creep.memory.role == "claimer") {
                var claimer = new Claimer(creep)
                this.creeps.push(claimer)
            } else if(creep.memory.role == "longrangebuilder") {
                var lrb = new LongRangeBuilder(creep);
                this.creeps.push(lrb);
            }

        }
    }

    run() {
        for(var creep of this.creeps) {
            creep.run();
        }

        var counter : { [room: string]: { [id: string] : number } } = {};

        for (var room in Game.rooms) {
            counter[room] = 
            {
                "energyCarrier": 0,
                "repairer": 0,
                "builder": 0
            };
        }

        var unassigned = [];
        for(var handyworker of this.handyworkers) {
            if(handyworker.creep.memory.job != undefined) {
                counter[handyworker.creep.memory.source_room][handyworker.creep.memory.job]++;
            } else {
                unassigned.push(handyworker);
            }
        }

        for(var u in unassigned) {
            var creeproom = unassigned[u].creep.memory.source_room;
            var job = this.assignJob(unassigned[u], counter[creeproom]);
            counter[creeproom][job]++;
        }
    }

    assignJob(creep : Handyworker, counter : {[id: string]: number}) {
        var least_common = "energyCarrier";
        var number = 10000;
        for(var key in counter) {
            if(counter[key] < number) {
                least_common = key
                number = counter[key]
            }
        }
        
        creep.creep.memory.job = least_common;
        return least_common;
    }
}

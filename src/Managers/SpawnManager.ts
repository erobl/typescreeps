export class SpawnManager {
    spawn : StructureSpawn;
    containers: Structure[];
    constructor(spawn : StructureSpawn, containers : Structure[]) {
        this.spawn = spawn;
        this.containers = containers;
        if(this.spawn.memory.spawnQueue == undefined) {
            this.spawn.memory.spawnQueue = [];
        }

        if(this.spawn.memory.minimumNumber == undefined) {
            this.spawn.memory.minimumNumber = {
                "lowenergyharvester": 4,
                "harvester" : 0,
                "handyworker": 0,
                "upgrader": 0,
                "claimer": 0,
                "longrangebuilder": 0
            }; 
        }

        if(this.spawn.memory.budget == undefined) {
            this.spawn.memory.budget = 600;
        }

        if (this.spawn.room.memory.creepAllocation == undefined) {
            this.spawn.room.memory.creepAllocation = {};
        }
    }

    run() {
        this.updateQueue()


        if(this.spawn.memory.spawnQueue.length > 0) {
            var role = this.peekQueue();
            var name = role + Game.time.toString();
            var energy = this.getRoleBudget(role, this.spawn.memory.budget)
            var body = this.getBody(role, energy)
            var memory = this.getMemory(role)
            var result = this.spawn.spawnCreep(body, name, {memory: memory});

            if (result == OK) {
                this.popQueue();

                this.postCreepCreation(role, name);
            }

        }

        this.updateStats()
    }

    updateStats() {
        Memory.stats.creepRoles[this.spawn.name] = this.spawn.memory.numberOf;
        Memory.stats.minCreepRoles[this.spawn.name] = this.spawn.memory.minimumNumber;
    }

    getRoleBudget(role: string, defaultEnergy: number) {
        if(role == "claimer") {
            return 1000
        }
        if(role == "longrangebuilder") {
            return 1000
        }

        return defaultEnergy
    }

    getBody(role : string, energy : number) : BodyPartConstant[] {
        if(role == "harvester") {
            // for a harvester we make a body composed of MOVE and up to 5 WALK modules
            var body : BodyPartConstant[] = [MOVE]
            var maxworkparts = Math.floor((energy - BODYPART_COST[MOVE])/BODYPART_COST[WORK])
            for(var i = 0; i < 5 && i < maxworkparts; i++) {
                body.push(WORK)
            }
            return body;
        } else if(role == "handyworker" || role == "upgrader" || role == "longrangebuilder") {
            // as many work, move, carry parts as you can with the energy
            var currentEnergy = energy;
            var body : BodyPartConstant[] = [];

            while(currentEnergy >= 50) {
                if(currentEnergy >= 50) {
                    body.push(MOVE);
                    currentEnergy -= 50;
                }
                if(currentEnergy >= 50) {
                    body.push(CARRY);
                    currentEnergy -= 50;
                }
                if(currentEnergy >= 100) {
                    body.push(WORK);
                    currentEnergy -= 100;
                }
            }
            return body;
        } else if(role == "claimer") {
            var currentEnergy = energy;
            var body : BodyPartConstant[] = [CLAIM];
            
            currentEnergy -= BODYPART_COST[CLAIM];

            while(currentEnergy >= 50) {
                if(currentEnergy >= 50) {
                    body.push(MOVE);
                    currentEnergy -= 50;
                }
            }

            return body
        } 
        // else we return a generic body worth 300
        return [WORK, CARRY, MOVE, MOVE]
    }

    getMemory(role : string) : CreepMemory {
        if(role == "harvester") { 
            return { role: role, source_room: this.spawn.room.name }
        } else if (role == "handyworker" || role == "upgrader") {
            return { role: role, working: false, job: undefined, source_room: this.spawn.room.name }
        } else if (role == "lowenergyharvester") {
            return { role: role, working: false, source_room: this.spawn.room.name }
        } else if (role == "claimer") {
            var dest_room = undefined;
            if(Game.flags.claim.room != undefined) {
                dest_room = Game.flags.claim.pos.roomName;
            }
            return { role: role, working: false, source_room: this.spawn.room.name, dest_room: dest_room }
        } else if (role == "longrangebuilder") {
            var dest_room = undefined;
            if(Game.flags.build != undefined && Game.flags.build.room != undefined) {
                dest_room = Game.flags.build.pos.roomName;
            }
            return { role: role, working: false, source_room: this.spawn.room.name, dest_room: dest_room }
        }

        else return {role: role, source_room: this.spawn.room.name}
    }

    postCreepCreation(role: string, name: string) {
        if(role == "harvester") { 
            var containers = this.spawn.room.find<StructureContainer>(FIND_STRUCTURES, 
                { filter: { structureType: STRUCTURE_CONTAINER } });
            
            var nameAssigned = false;
            for(var container of containers) {
                var assigned = false;
                for(let creepId in this.spawn.room.memory.creepAllocation) {
                    if(container.id == this.spawn.room.memory.creepAllocation[creepId]) {
                        assigned = true;
                    }
                }

                if(!assigned) {
                    this.spawn.room.memory.creepAllocation[name] = container.id;
                    nameAssigned = true;
                    break;
                }
            }
            
            if(!nameAssigned) {
                console.log("Something went wrong! Couldn't assign " + name + " in room " +this.spawn.room.name);
                if(containers.length == 0) {
                    console.log("No containers found in room " + this.spawn.room.name +", starting low energy mode...")
                    this.spawn.room.memory.lowEnergyMode = true;
                }
            }
        }
    }

    updateQueue() {
        var needsUpdate = false;
        this.spawn.memory.numberOf = {};
        for(var role in this.spawn.memory.minimumNumber) {
            var current = _.sum(Game.creeps, (c) => (c.memory.role == role && c.memory.source_room == this.spawn.room.name) ? 1 : 0) + 
                      _.sum(this.spawn.memory.spawnQueue, (r) => r == role ? 1 : 0);
            this.spawn.memory.numberOf[role] = current;
            for(var i = 0; i < this.spawn.memory.minimumNumber[role] - current; i++) {
                needsUpdate = true;
                this.enqueueCreep(role)
            }
        }

        
        if(needsUpdate) {
            this.sortQueue()
        }
    }

    enqueueCreep(role : string) {
        return this.spawn.memory.spawnQueue.push(role);
    }

    sortQueue() {
        var creepPriority = new Map<string, number>();
        creepPriority.set("lowenergyharvester", 0);
        creepPriority.set("harvester", 1);
        creepPriority.set("handyworker", 2);
        creepPriority.set("upgrader", 3);
        creepPriority.set("claimer", 4);

        return this.spawn.memory.spawnQueue.sort(function(a,b) {
            var aval = creepPriority.get(a);
            var bval = creepPriority.get(b);
            if(aval == undefined) {
                aval = 1000;
            }
            if(bval == undefined) {
                bval = 1000;
            }
            return aval - bval;
        })
    }  

    peekQueue() {
        return this.spawn.memory.spawnQueue[0];
    }

    popQueue() {
        return this.spawn.memory.spawnQueue.shift();
    }
}

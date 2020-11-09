import { ErrorMapper } from "utils/ErrorMapper";
import { WorldManager } from "Managers/WorldManager";

// profiler imports
import { CreepManager } from "Managers/CreepManager";
import { RoomManager } from "Managers/RoomManager";
import { SpawnManager } from "Managers/SpawnManager";
import { StructureManager } from "Managers/StructureManager";
import { Harvester } from "Creeps/Harvester";
import { Hauler } from "Creeps/Hauler";
import { Handyworker } from "Creeps/Handyworker";
import { Upgrader } from "Creeps/Upgrader";
import { LowEnergyHarvester } from "Creeps/LowEnergyHarvester";
import { Claimer } from "Creeps/Claimer";
import { LongRangeBuilder } from "Creeps/LongRangeBuilder";
import * as profiler from "screeps-profiler";

// Start profiler
profiler.enable();
profiler.registerClass(WorldManager, 'WorldManager');
profiler.registerClass(CreepManager, 'CreepManager');
profiler.registerClass(RoomManager, 'RoomManager');
profiler.registerClass(SpawnManager, 'SpawnManager');
profiler.registerClass(StructureManager, 'StructureManager');
profiler.registerClass(Harvester, 'Harvester');
profiler.registerClass(Hauler, 'Hauler');
profiler.registerClass(Handyworker, 'Handyworker');
profiler.registerClass(Upgrader, 'Upgrader');
profiler.registerClass(LowEnergyHarvester, 'LowEnergyHarvester');
profiler.registerClass(Claimer, 'Claimer');
profiler.registerClass(LongRangeBuilder, 'LongRangeBuilder');

var wm = new WorldManager();

export const loop = ErrorMapper.wrapLoop(() => {
  profiler.wrap(function() {
    wm.run();
  });
});

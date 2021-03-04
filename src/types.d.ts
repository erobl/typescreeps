// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
  source_room: string;
  role: string;
  job?: string;
  backupjob?: string;
  working?: boolean;
  dest_room?: string;
}

interface RoomMemory {
  lowEnergyMode: boolean;
  creepAllocation: { [id: string] : Id<StructureContainer> };
  containerSource: { [id: string] : Id<Source>};
  counter: number;
  strategy: string;
  oldStrategy: string;
}

interface SpawnMemory {
  spawnQueue: string[];
  minimumNumber: { [id: string] : number };
  numberOf: { [id: string]: number };
  budget: number;
}

interface Memory {
  uuid: number;
  log: any;
  defcon: number;
  roomqueue: number[];
  stats: { [id: string]: any };
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
    Profiler: any;
  }
}

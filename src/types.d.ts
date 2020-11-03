// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
  role: string;
  job?: string;
  working?: boolean;
}

interface RoomMemory {
  lowEnergyMode: boolean;
  creepAllocation: { [id: string] : Id<StructureContainer> };
  containerSource: { [id: string] : Id<Source>};
  counter: number;
}

interface SpawnMemory {
  spawnQueue: string[];
  minimumNumber: { [id: string] : number };
  numberOf: { [id: string]: number };
}

interface Memory {
  uuid: number;
  log: any;
  defcon: number;
  roomqueue: number[];
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}

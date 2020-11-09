import { LongRangeHauler } from "Creeps/LongRangeHauler";

export class Claimer extends LongRangeHauler {
    constructor(creep: Creep) {
        super(creep)
    }

    run() {
	    if(Game.flags.claim.room == undefined) {
		this.creep.moveTo(Game.flags.claim)
	    } else if(Game.flags.claim.room.controller != undefined && this.creep.claimController(Game.flags.claim.room.controller) == ERR_NOT_IN_RANGE) {
		this.creep.moveTo(Game.flags.claim.room.controller);
	    }
    }
}

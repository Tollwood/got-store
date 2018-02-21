import { House } from './player/house';
import Unit from './units/units';
import Area from './area/area';
export default class CombatResult {
    private _attackingArea;
    private _attackerStrength;
    private _defendingArea;
    private _defenderStrength;
    constructor(attackingArea: Area, defendingArea: Area, attackerStrength: number, defenderStrength: number);
    readonly attackingArea: Area;
    readonly defendingArea: Area;
    readonly looser: House;
    readonly lostUnits: Array<Unit>;
    readonly winner: House;
    defenderStrength: number;
    attackerStrength: number;
}

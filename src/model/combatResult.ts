import {House} from './player/house';
import {Unit} from './units/units';
import {Area} from './area/area';

class CombatResult {

  private _attackingArea: Area;
  private _attackerStrength: number;

  private _defendingArea: Area;
  private _defenderStrength: number;

  constructor(attackingArea: Area, defendingArea: Area, attackerStrength: number, defenderStrength: number) {
    this._attackingArea = attackingArea;
    this._defendingArea = defendingArea;
    this._attackerStrength = attackerStrength;
    this._defenderStrength = defenderStrength;
  }

  get attackingArea(): Area {
    return this._attackingArea;
  }

  get defendingArea(): Area {
    return this._defendingArea;
  }

  get looser(): House {
    const didAttackerWin = this._attackerStrength > this._defenderStrength;
    return didAttackerWin ? this._defendingArea.controllingHouse : this._attackingArea.controllingHouse;
  }

  get lostUnits(): Array<Unit> {
    return this._attackingArea.controllingHouse === this.winner ? this.defendingArea.units : this.attackingArea.units;
  }

  get winner(): House {
    const didAttackerWin = this._attackerStrength > this._defenderStrength;
    return didAttackerWin ? this._attackingArea.controllingHouse : this._defendingArea.controllingHouse;
  }

  get defenderStrength(): number {
    return this._defenderStrength;
  }

  set defenderStrength(value: number) {
    this._defenderStrength = value;
  }

  get attackerStrength(): number {
    return this._attackerStrength;
  }

  set attackerStrength(value: number) {
    this._attackerStrength = value;
  }

}

export {CombatResult}
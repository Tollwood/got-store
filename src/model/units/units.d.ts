import { House } from '../player/house';
import { UnitType } from './unitType';
export default class Unit {
    private type;
    private house;
    constructor(type: UnitType, house: House);
    getType(): UnitType;
    getHouse(): House;
    isLandunit(): boolean;
}

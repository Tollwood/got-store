import {Area} from '../src/model/area/area';
import {House} from '../src/model/player/house';
import {UnitType} from '../src/model/units/unitType';
import {OrderToken} from '../src/model/orderToken/orderToken';
import Unit from '../src/model/units/units';
import {AreaKey} from '../src/model/area/areaKey';
import {OrderTokenType} from '../src/model/orderToken/orderTokenType';

export default class AreaBuilder {

    private _key: AreaKey;
    private _units: Array<UnitType> = [];
    private _controllingHouse: House = null;
    private _orderTokenType: OrderTokenType = null;

    constructor(key: AreaKey) {
        this._key = key;
    }

    public withOrderToken(orderTokenType: OrderTokenType): AreaBuilder {
        this._orderTokenType = orderTokenType;
        return this;
    }

    public  withUnits(units: Array<UnitType>): AreaBuilder {
        this._units = units;
        return this;
    }

    public  withHouse(house: House): AreaBuilder {
        this._controllingHouse = house;
        return this;
    }

    public build(): Area {
        const orderToken = this._controllingHouse !== null && this._orderTokenType !== null ? new OrderToken(this._controllingHouse, this._orderTokenType) : null;
        const units: Unit[] = [];
        this._units.forEach((type) => {
            units.push(new Unit(type, this._controllingHouse));
        });

        return new Area(this._key, this._controllingHouse, units, orderToken);

    }
}

import Unit from '../units/units';
import { OrderToken } from '../orderToken/orderToken';
import { House } from '../player/house';
import { AreaKey } from './areaKey';
export default class Area {
    private _key;
    private _controllingHouse;
    private _units;
    private _orderToken;
    constructor(key: AreaKey, controllingHouse?: House, units?: Unit[], orderToken?: OrderToken);
    readonly key: AreaKey;
    units: Array<Unit>;
    orderToken: OrderToken;
    controllingHouse: House;
    copy(): Area;
}

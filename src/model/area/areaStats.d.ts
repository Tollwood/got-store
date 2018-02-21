import { AreaKey } from './areaKey';
export default class AreaStats {
    private _key;
    private _consolidatePower;
    private harbor;
    private _castle;
    private _stronghold;
    private _supply;
    constructor(key: AreaKey, consolidatePower: number, harbor: boolean, castle: boolean, stronghold: boolean, isLandArea: boolean, supply: number, borders?: AreaKey[]);
    private _isLandArea;
    private _borders;
    readonly key: AreaKey;
    borders: AreaKey[];
    readonly isLandArea: boolean;
    readonly consolidatePower: number;
    readonly stronghold: boolean;
    readonly castle: boolean;
    readonly supply: number;
    hasCastleOrStronghold(): boolean;
    copy(): AreaStats;
}

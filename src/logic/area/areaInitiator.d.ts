import Area from '../../model/area/area';
import { House } from '../../model/player/house';
import { AreaKey } from '../../model/area/areaKey';
import AreaStats from '../../model/area/areaStats';
export declare class AreaInitiator {
    static getInitalState(playingHouses: Array<House>): Map<AreaKey, Area>;
    static getAreaStats(): Map<AreaKey, AreaStats>;
    private static parseAreas(json);
    private static createArea(json);
    private static addBorderAreas(areaStats);
}

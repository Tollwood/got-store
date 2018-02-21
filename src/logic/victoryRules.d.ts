import { House } from '../model/player/house';
import { AreaKey } from '../model/area/areaKey';
import { GameStoreState } from '../gameStoreState';
export default class VictoryRules {
    static getVictoryPositionFor(state: GameStoreState, house: House): number;
    static getWinningHouse(state: GameStoreState): House;
    static verifyWinningHouseAfterMove(state: GameStoreState, house: House, targetAreaKey?: AreaKey): House;
}

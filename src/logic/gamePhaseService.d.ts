import { GamePhase } from '../model/gamePhase';
import { House } from '../model/player/house';
import { AreaKey } from '../model/area/areaKey';
import Area from '../model/area/area';
import { GameStoreState } from '../gameStoreState';
export default class GamePhaseService {
    static getNextPhase(state: GameStoreState, updatedAreas: Area[]): GamePhase;
    static getNextHouse(state: GameStoreState, nextGamePhase: GamePhase, lastSourceAreaKey: AreaKey): any;
    static cleanupBoard(state: GameStoreState): GameStoreState;
    static updateGamePhaseAfterRecruiting(state: GameStoreState, areaKey?: AreaKey): {
        currentHouse: House;
        gamePhase: GamePhase;
    };
    static getNextGamePhase(currentGamePhase: GamePhase): GamePhase;
    private static isStillIn(areas, gamePhase, house?);
    private static allMarchOrdersRevealed(areas, house?);
    private static nextHouse(ironThroneSuccession, house);
    private static allRaidOrdersRevealed(areas, house?);
    private static isAreaWithUnitsAndToken(area);
    private static isAreaWithoutUnits(area);
    private static getNextHouseToRecruit(state, areaKey);
    private static isAllowedToRecruit(state, house, areaKey?);
    private static isPlanningPhaseComplete(areas);
    private static getNextGamePhaseWithPendingActions(areas, gamePhase);
    private static getNextHouseWithPendingActions(ironThroneSuccession, areas, gamePhase, lastSourceAreaKey, house);
}

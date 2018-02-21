import Area from '../../model/area/area';
import { AreaKey } from '../../model/area/areaKey';
import Player from '../../model/player/player';
import { House } from '../../model/player/house';
import { GameStoreState } from '../../gameStoreState';
import PlayerSetup from '../../model/player/playerSetup';
export default class PlayerStateModificationService {
    static raidPowerToken(state: GameStoreState, source: AreaKey, target: AreaKey): Player[];
    static establishControl(players: Player[], establishControl: boolean, house: House): Player[];
    static consolidateAllPower(state: GameStoreState): Player[];
    static executeAllConsolidatePowerOrders(players: Player[], areas: Area[]): Player[];
    static initPlayers(playerSetup: Array<PlayerSetup>): Player[];
}

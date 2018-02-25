import {House} from '../../model/player/house';
import {OrderTokenType} from '../../model/orderToken/orderTokenType';
import {GamePhase} from '../../model/gamePhase';
import {State} from '../../state';
import {PlayerSetup } from '../../model/player/playerSetup';
import {AreaInitiator} from '../area/areaInitiator';
import {PlayerStateModificationService } from './playerStateModificationService';
import {SupplyStateModificationService } from './supplyStateModificationService';

class GameStateModificationService {
    public static INITIALLY_ALLOWED_ORDER_TOKEN_TYPES: OrderTokenType[] = [OrderTokenType.march_minusOne, OrderTokenType.march_zero, OrderTokenType.march_special, OrderTokenType.raid_0, OrderTokenType.raid_1, OrderTokenType.raid_special, OrderTokenType.consolidatePower_0, OrderTokenType.consolidatePower_1, OrderTokenType.consolidatePower_special, OrderTokenType.defend_0, OrderTokenType.defend_1, OrderTokenType.defend_special, OrderTokenType.support_0, OrderTokenType.support_1, OrderTokenType.support_special];

    public static init(playerSetup: PlayerSetup[], isDebugEnabled: boolean): State {
        const initialIronThroneSuccession = [House.baratheon, House.lannister, House.stark, House.martell, House.tyrell, House.greyjoy];
        const initialKingscourt = [House.lannister, House.stark, House.martell, House.baratheon, House.tyrell, House.greyjoy];
        const initialFiefdom = [House.greyjoy, House.tyrell, House.martell, House.stark, House.baratheon, House.greyjoy];
        const gamePhase = GamePhase.PLANNING;
        let players = PlayerStateModificationService.initPlayers(playerSetup);
        const areas = AreaInitiator.getInitalState(players.map(player => player.house));
        return {
            areas: areas,
            gameRound: 1,
            gamePhase: gamePhase,
            winningHouse: null,
            fiefdom: initialFiefdom,
            kingscourt: initialKingscourt,
            ironThroneSuccession: initialIronThroneSuccession,
            wildlingsCount: 0,
            players,
            localPlayersHouse: House.stark,
            currentHouse: initialIronThroneSuccession[0],
            currentlyAllowedTokenTypes: this.INITIALLY_ALLOWED_ORDER_TOKEN_TYPES,
            currentlyAllowedSupply: SupplyStateModificationService.updateSupply({players, areas}),
            areasAllowedToRecruit: [],
            isDebugEnabled: isDebugEnabled
        };
    }
}

export {GameStateModificationService}
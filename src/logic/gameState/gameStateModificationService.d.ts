import { OrderTokenType } from '../../model/orderToken/orderTokenType';
import { GameStoreState } from '../../gameStoreState';
import PlayerSetup from '../../model/player/playerSetup';
export default class GameStateModificationService {
    static INITIALLY_ALLOWED_ORDER_TOKEN_TYPES: OrderTokenType[];
    static init(playerSetup: PlayerSetup[]): GameStoreState;
}

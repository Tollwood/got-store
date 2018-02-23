import {AreaKey} from './model/area/areaKey';
import Area from './model/area/area';
import {GamePhase} from './model/gamePhase';
import {House} from './model/player/house';
import Player from './model/player/player';
import {OrderTokenType} from './model/orderToken/orderTokenType';
import WesterosCard from './model/cards/westerosCard';

export class GameStoreState {
    isDegugEnabled?: boolean;
    areas?: Map<AreaKey, Area>;

    gameRound?: number;
    gamePhase?: GamePhase;
    winningHouse?: House;

    fiefdom?: House[];
    kingscourt?: House[];
    ironThroneSuccession?: House[];
    currentlyAllowedTokenTypes?: Array<OrderTokenType>;

    players?: Array<Player>;
    localPlayersHouse?: House;
    currentHouse?: House;
    currentlyAllowedSupply?: Map<House, number>;

    areasAllowedToRecruit?: AreaKey[];

    wildlingsCount?: number;
}

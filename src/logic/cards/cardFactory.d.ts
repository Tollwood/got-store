import WesterosCard from '../../model/cards/westerosCard';
import { GamePhase } from '../../model/gamePhase';
export default class CardFactory {
    static shuffle(cards: Array<any>): void;
    static getWesterosCards(): Map<GamePhase, WesterosCard[]>;
    private static parseWesterosCards(json);
}

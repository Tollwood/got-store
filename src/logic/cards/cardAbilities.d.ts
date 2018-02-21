import { GameStoreState } from './../../gameStoreState';
export declare class CardAbilities {
    static shuffleCards(state: GameStoreState): GameStoreState;
    static supply(state: GameStoreState): GameStoreState;
    static recruit(state: GameStoreState): GameStoreState;
    static nothing(state: GameStoreState): GameStoreState;
    static invluence(state: GameStoreState): GameStoreState;
    static power(state: GameStoreState): GameStoreState;
    static noDefenseOrders(state: GameStoreState): GameStoreState;
    static noSpecialMarchOrder(state: GameStoreState): GameStoreState;
    static noRaidOrders(state: GameStoreState): GameStoreState;
    static noConsolidatePowerOrders(state: GameStoreState): GameStoreState;
    static noSupportOrders(state: GameStoreState): GameStoreState;
    static wildlingAttack(state: GameStoreState): GameStoreState;
}

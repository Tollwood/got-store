import {createStore, Store} from 'redux';
import {ActionTypes, TypeKeys} from './actions';
import VictoryRules from './logic/victoryRules';
import GamePhaseService from './logic/gamePhaseService';
import RecruitingStateModificationService from './logic/gameState/recruitingStateModificationService';
import AreaModificationService from './logic/gameState/areaStateModificationService';
import PlayerStateModificationService from './logic/gameState/playerStateModificationService';
import WildlingStateModificationService from './logic/gameState/wildlingStateModificationService';
import GameStateModificationService from './logic/gameState/gameStateModificationService';
import {GameStoreState} from './gameStoreState';
import WesterosCardRules from './logic/cards/westerosCardRules';
import {CardAbilities} from './logic/cards/cardAbilities';

const gameStateReducer = (state: GameStoreState = {}, action: ActionTypes): GameStoreState => {
    let newState;
    switch (action.type) {
        case TypeKeys.NEW_GAME:
            newState = {
                ...GameStateModificationService.init(action.playerSetup)
            };
            break;
        case TypeKeys.LOAD_GAME:
            newState = {...action.state};
            break;
        case TypeKeys.RECRUIT_UNITS:
            const areasAllowedToRecruit = RecruitingStateModificationService.updateAreasAllowedToRecruit(
                state.areasAllowedToRecruit, action.areaKey);
            const currentWesterosCard = areasAllowedToRecruit.length > 0 ? state.currentWesterosCard : null;
            newState = {
                ...state,
                areas: AreaModificationService.recruitUnits(Array.from(state.areas.values()), action.areaKey, action.units),
                areasAllowedToRecruit,
                currentWesterosCard,
                ...GamePhaseService.updateGamePhaseAfterRecruiting(state, action.areaKey)
            };
            break;

        case TypeKeys.PLACE_ORDER:
            const areasAfterPlacingOrder = AreaModificationService.addOrderToken(Array.from(state.areas.values()),
                action.orderToken,
                action.areaKey);
            let nextGamePhase = GamePhaseService.getNextPhase(state, Array.from(areasAfterPlacingOrder.values()));
            newState = {
                ...state,
                areas: areasAfterPlacingOrder,
                gamePhase: nextGamePhase,
                currentHouse: GamePhaseService.getNextHouse(state, nextGamePhase, action.areaKey),
            };
            break;

        case TypeKeys.SKIP_ORDER:
            const areasAfterSkippingOrder = AreaModificationService.removeOrderToken(Array.from(state.areas.values()),
                action.areaKey);
            nextGamePhase = GamePhaseService.getNextPhase(state, Array.from(areasAfterSkippingOrder.values()));
            newState = {
                ...state,
                areas: areasAfterSkippingOrder,
                gamePhase: nextGamePhase,
                currentHouse: GamePhaseService.getNextHouse(state, nextGamePhase, action.areaKey),
            };
            break;
        case TypeKeys.EXECUTE_RAID_ORDER:
            const areasAfterExecutingRaidOrder = AreaModificationService.removeOrderTokens(Array.from(state.areas.values()),
                [action.sourceAreaKey,
                    action.targetAreaKey]);
            const playersAfterRaidOrder = PlayerStateModificationService.raidPowerToken(state,
                action.sourceAreaKey,
                action.targetAreaKey);
            nextGamePhase = GamePhaseService.getNextPhase(state, Array.from(areasAfterExecutingRaidOrder.values()));
            newState = {
                ...state,
                areas: areasAfterExecutingRaidOrder,
                players: playersAfterRaidOrder,
                gamePhase: nextGamePhase,
                currentHouse: GamePhaseService.getNextHouse(state, nextGamePhase, action.sourceAreaKey)
            };
            break;
        case TypeKeys.PLAY_WESTEROS_CARD:
            newState = {
                ...state,
                currentWesterosCard: WesterosCardRules.getNextCard(state.westerosCards, state.gamePhase),
                westerosCards: WesterosCardRules.shiftCardOnCurrentStack(state)
            };
            break;

        case TypeKeys.EXECUTE_WESTEROS_CARD:
            newState = {
                 ...CardAbilities[action.card.selectedFunction.functionName](state),
                wildlingsCount: WildlingStateModificationService.updateWildlingCount(state.wildlingsCount, action.card.wildling)
            };
            break;
        case TypeKeys.MOVE_UNITS:
            const winningHouse = VictoryRules.verifyWinningHouseAfterMove(state,
                state.areas.get(action.source).controllingHouse, action.target);
            const areasAfterMove = AreaModificationService.moveUnits(Array.from(state.areas.values()),
                action.source, action.target, action.units, action.completeOrder, action.establishControl);
            const playersAfterMove = PlayerStateModificationService.establishControl(state.players, action.establishControl, state.areas.get(action.source).controllingHouse);
            nextGamePhase = GamePhaseService.getNextPhase(state, Array.from(areasAfterMove.values()));
            newState = {
                ...state,
                areas: areasAfterMove,
                players: playersAfterMove,
                gamePhase: nextGamePhase,
                currentHouse: GamePhaseService.getNextHouse(state, nextGamePhase, action.source),
                winningHouse,
            };
            break;
        case TypeKeys.RESOLVE_FIGHT:
            // TODO verify winning conditions
            const combatResult = action.combatResult;
            const loosingArea = combatResult.looser === combatResult.attackingArea.controllingHouse ? combatResult.attackingArea : combatResult.defendingArea;
            const winningArea = combatResult.winner === combatResult.attackingArea.controllingHouse ? combatResult.attackingArea : combatResult.defendingArea;
            newState = {
                ...state,
                areas: AreaModificationService.updateAfterFight(state, Array.from(state.areas.values()), combatResult.attackingArea.key, winningArea.key, loosingArea.key, winningArea.units),
            };
            break;
        default:
            newState = state;
            break;
    }
    const nextState = GamePhaseService.cleanupBoard(newState);
    // console.log({action, oldState: nextState, nextState, newState: newState});
    return nextState;
};

class GameStoreFactory {
    static create(): Store<GameStoreState> {
        return createStore(gameStateReducer);
    }
}

export {GameStoreFactory};

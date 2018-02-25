import {TypeKeys} from '../actions/actions';
import {ActionTypes} from '../actions/actionTypes';
import {VictoryRules} from '../logic/victoryRules';
import { GamePhaseService} from '../logic/gamePhaseService';
import {RecruitingStateModificationService} from '../logic/gameState/recruitingStateModificationService';
import {AreaStateModificationService} from '../logic/gameState/areaStateModificationService';
import {PlayerStateModificationService} from '../logic/gameState/playerStateModificationService';
import {GameStateModificationService } from '../logic/gameState/gameStateModificationService';
import {State} from '../state';
import {CombatCalculator} from '../logic/combatCalculator';

const gameStateReducer = (state: State = {}, action: ActionTypes): State => {
    let newState;
    switch (action.type) {
        case TypeKeys.NEW_GAME:
            newState = {
                ...GameStateModificationService.init(action.playerSetup, state.isDebugEnabled )
            };
            break;
        case TypeKeys.LOAD_GAME:
            newState = {
                ...action.state,
                isDebugEnabled: state.isDebugEnabled};
            break;
        case TypeKeys.RECRUIT_UNITS:
            const areasAllowedToRecruit = RecruitingStateModificationService.updateAreasAllowedToRecruit(
                state.areasAllowedToRecruit, action.areaKey);
            newState = {
                ...state,
                areas: AreaStateModificationService.recruitUnits(Array.from(state.areas.values()), action.areaKey, action.units),
                areasAllowedToRecruit,
                ...GamePhaseService.updateGamePhaseAfterRecruiting(state, action.areaKey)
            };
            break;

        case TypeKeys.PLACE_ORDER:
            const areasAfterPlacingOrder = AreaStateModificationService.addOrderToken(Array.from(state.areas.values()),
                action.orderToken,
                action.areaKey);
            let nextGamePhase = GamePhaseService.getNextPhase(state, Array.from(areasAfterPlacingOrder.values()));
            newState = {
                ...state,
                areas: areasAfterPlacingOrder,
                gamePhase: nextGamePhase,
                currentHouse: GamePhaseService.getNextHouse(state, nextGamePhase),
            };
            break;

        case TypeKeys.SKIP_ORDER:
            const areasAfterSkippingOrder = AreaStateModificationService.removeOrderToken(Array.from(state.areas.values()),
                action.areaKey);
            nextGamePhase = GamePhaseService.getNextPhase(state, Array.from(areasAfterSkippingOrder.values()));
            newState = {
                ...state,
                areas: areasAfterSkippingOrder,
                gamePhase: nextGamePhase,
                currentHouse: GamePhaseService.getNextHouse(state, nextGamePhase),
            };
            break;
        case TypeKeys.EXECUTE_RAID_ORDER:
            const areasAfterExecutingRaidOrder = AreaStateModificationService.removeOrderTokens(Array.from(state.areas.values()),
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
                currentHouse: GamePhaseService.getNextHouse(state, nextGamePhase)
            };
            break;
        case TypeKeys.MOVE_UNITS:
            const winningHouse = VictoryRules.verifyWinningHouseAfterMove(state,
                state.areas.get(action.source).controllingHouse, action.target);
            const areasAfterMove = AreaStateModificationService.moveUnits(Array.from(state.areas.values()),
                action.source, action.target, action.units, action.completeOrder, action.establishControl);
            const playersAfterMove = PlayerStateModificationService.establishControl(state.players, action.establishControl, state.areas.get(action.source).controllingHouse);
            nextGamePhase = GamePhaseService.getNextPhase(state, Array.from(areasAfterMove.values()));
            newState = {
                ...state,
                areas: areasAfterMove,
                players: playersAfterMove,
                gamePhase: nextGamePhase,
                currentHouse: GamePhaseService.getNextHouse(state, nextGamePhase),
                winningHouse,
            };
            break;
        case TypeKeys.RESOLVE_FIGHT:
            const combatResult = CombatCalculator.calculateCombat(state.areas.get(action.sourceAreaKey), state.areas.get(action.targetAreaKey));
            const loosingArea = combatResult.looser === combatResult.attackingArea.controllingHouse ? combatResult.attackingArea : combatResult.defendingArea;
            const winningArea = combatResult.winner === combatResult.attackingArea.controllingHouse ? combatResult.attackingArea : combatResult.defendingArea;
            const areasAfterFight = AreaStateModificationService.updateAfterFight(state, Array.from(state.areas.values()), combatResult.attackingArea.key, winningArea.key, loosingArea.key, winningArea.units)
            nextGamePhase = GamePhaseService.getNextPhase(state, Array.from(areasAfterFight.values()));
            newState = {
                ...state,
                areas: areasAfterFight,
                gamePhase : nextGamePhase,
                currentHouse: GamePhaseService.getNextHouse(state, nextGamePhase),
            };
            break;
        default:
            newState = state;
            break;
    }
    const nextState = GamePhaseService.cleanupBoard(newState);
    if(state.isDebugEnabled){
        console.log({action, oldState: nextState, nextState, newState: newState});
    }
    return nextState;
};

export {gameStateReducer};

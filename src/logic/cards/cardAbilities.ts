import {OrderTokenType} from './../../model/orderToken/orderTokenType';
import { PlayerStateModificationService } from '../gameState/playerStateModificationService';
import { SupplyStateModificationService } from '../gameState/supplyStateModificationService';
import { RecruitingStateModificationService } from '../gameState/recruitingStateModificationService';
import { GamePhaseService } from '../gamePhaseService';
import { CardFactory } from '../cards/cardFactory';
import {State} from '../../state';

class CardAbilities {

   public static shuffleCards(state: State): State {
    //    let cards = state.westerosCards.get(state.currentWesterosCard.gamePhase).slice();
   //     CardFactory.shuffle(cards);

        const newState = {
            ...state,
            currentWesterosCard: null,
        };
  //      newState.westerosCards.set(state.currentWesterosCard.gamePhase, cards);
        return newState;
    }

    public static supply(state: State): State {
        return {
            ...state,
            currentlyAllowedSupply: SupplyStateModificationService.updateSupply(state),
  //          currentWesterosCard: null,
            gamePhase: GamePhaseService.getNextGamePhase(state.gamePhase),
        };
    }

    public static recruit(state: State): State {
        const stateWithUnitsAllowedToRecruit = {
            ...state,
            areasAllowedToRecruit: RecruitingStateModificationService.calculateAreasAllowedToRecruit(state),
        };
        return {
            ...stateWithUnitsAllowedToRecruit,
            ...GamePhaseService.updateGamePhaseAfterRecruiting(stateWithUnitsAllowedToRecruit),
        };
    }

    public static nothing(state: State): State {
        return {
            ...state,
    //        currentWesterosCard: null,
            gamePhase: GamePhaseService.getNextGamePhase(state.gamePhase),
        };
    }

    public static invluence(state: State): State {
        return {
            ...state,
     //       currentWesterosCard: null,
            gamePhase: GamePhaseService.getNextGamePhase(state.gamePhase),
        };
    }

    public static power(state: State): State {
        return {
            ...state,
            players: PlayerStateModificationService.consolidateAllPower(state),
     //       currentWesterosCard: null,
            gamePhase: GamePhaseService.getNextGamePhase(state.gamePhase),
        };
    }

    public static noDefenseOrders(state: State): State {
        const restrictedTokenTypes = [OrderTokenType.defend_0, OrderTokenType.defend_1, OrderTokenType.defend_special];
        const currentlyAllowedTokenTypes = state.currentlyAllowedTokenTypes
            .filter((orderToken) => restrictedTokenTypes.indexOf(orderToken) === -1);
        return {
            ...state,
            currentlyAllowedTokenTypes,
      //      currentWesterosCard: null,
            gamePhase: GamePhaseService.getNextGamePhase(state.gamePhase),
        };
    }

    public static noSpecialMarchOrder(state: State): State {
        const restrictedTokenTypes = [OrderTokenType.march_special];
        const currentlyAllowedTokenTypes = state.currentlyAllowedTokenTypes
            .filter((orderToken) => restrictedTokenTypes.indexOf(orderToken) === -1);
        return {
            ...state,
            currentlyAllowedTokenTypes,
     //       currentWesterosCard: null,
            gamePhase: GamePhaseService.getNextGamePhase(state.gamePhase),
        };
    }

    public static noRaidOrders(state: State): State {
        const restrictedTokenTypes = [OrderTokenType.raid_0, OrderTokenType.raid_1, OrderTokenType.raid_special];
        const currentlyAllowedTokenTypes = state.currentlyAllowedTokenTypes
            .filter((orderToken) => restrictedTokenTypes.indexOf(orderToken) === -1);
        return {
            ...state,
            currentlyAllowedTokenTypes,
      //      currentWesterosCard: null,
            gamePhase: GamePhaseService.getNextGamePhase(state.gamePhase),
        };
    }

    public static noConsolidatePowerOrders(state: State): State {
        const restrictedTokenTypes = [OrderTokenType.consolidatePower_0, OrderTokenType.consolidatePower_1, OrderTokenType.consolidatePower_special];
        const currentlyAllowedTokenTypes = state.currentlyAllowedTokenTypes
            .filter((orderToken) => restrictedTokenTypes.indexOf(orderToken) === -1);
        return {
            ...state,
            currentlyAllowedTokenTypes,
       //     currentWesterosCard: null,
            gamePhase: GamePhaseService.getNextGamePhase(state.gamePhase),
        };
    }

    public static noSupportOrders(state: State): State {
        const restrictedTokenTypes = [OrderTokenType.support_0, OrderTokenType.support_1, OrderTokenType.support_special];
        const currentlyAllowedTokenTypes = state.currentlyAllowedTokenTypes
            .filter((orderToken) => restrictedTokenTypes.indexOf(orderToken) === -1);
        return {
            ...state,
            currentlyAllowedTokenTypes,
         //   currentWesterosCard: null,
            gamePhase: GamePhaseService.getNextGamePhase(state.gamePhase),
        };
    }

    public static wildlingAttack(state: State): State {
        return {
            ...state,
          //  currentWesterosCard: null,
            gamePhase: GamePhaseService.getNextGamePhase(state.gamePhase),
        };
    }
}

export {CardAbilities}
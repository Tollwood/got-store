import {PlayerSetup} from './model/player/playerSetup';
import {AiCalculator} from './ai/aiCalculator';
import {ActionFactory} from './actionFactory';
import {createStore} from 'redux';
import {gameStateReducer} from './reducer/reducer';
import {GameLogic} from './gameLogic';

class GameLogicFactory {
    static create(playerSetup: PlayerSetup[], isDebugEnabled?: boolean): GameLogic {
        const game = new GameLogic(createStore(gameStateReducer, {isDebugEnabled}));
        playerSetup.forEach((playerSetup) => {
            if (playerSetup.ai) {
                game.subscribe(() => {
                    AiCalculator.recruit(game, playerSetup.house);
                    AiCalculator.placeAllOrderTokens(game, playerSetup.house);
                    AiCalculator.executeOrder(game, playerSetup.house);
                });
            }
        });
        game.execute(ActionFactory.newGame(playerSetup));
        return game;
    }
}

export {GameLogicFactory}
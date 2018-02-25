import {House} from '../model/player/house';
import {Area} from '../model/area/area';
import {AreaKey} from '../model/area/areaKey';
import {State} from '../state';
import {AreaStatsService} from './area/areaStatsService';

class VictoryRules {

    public static getVictoryPositionFor(state: State, house: House) {
        return Array.from(state.areas.values()).filter((area: Area) => {
            return area.controllingHouse === house && AreaStatsService.getInstance().areaStats.get(area.key).hasCastleOrStronghold();
        }).length;
    }

    public static getWinningHouse(state: State): House {
        let winningHouse: House = null;
        const nextGameRound = state.gameRound + 1;
        if (nextGameRound > 10) {
            const sortedPlayersByVictoryPoints = state.players.sort((a, b) => {
                return VictoryRules.getVictoryPositionFor(state, b.house) - VictoryRules.getVictoryPositionFor(state, a.house);
            });
            winningHouse = sortedPlayersByVictoryPoints[0].house;
        }
        return winningHouse;
    }

    public static verifyWinningHouseAfterMove(state: State, house: House, targetAreaKey?: AreaKey): House {
        let winningHouse: House = null;
        const victoryPosition = this.getVictoryPositionFor(state, house);
        const targetAreaHasStronghold = AreaStatsService.getInstance().areaStats.get(targetAreaKey).hasCastleOrStronghold();
        if (victoryPosition === 6 && targetAreaHasStronghold) {
            winningHouse = house;
        }
        return winningHouse;
    }
}

export {VictoryRules}
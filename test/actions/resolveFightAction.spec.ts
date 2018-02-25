import {AreaKey} from '../../src/model/area/areaKey';
import {CombatResult} from '../../src/model/combatResult';

import {House} from '../../src/model/player/house';
import {UnitType} from '../../src/model/units/unitType';
import {Player} from '../../src/model/player/player';
import {GameLogicFactory} from '../../src/gameLogicFactory';
import {ActionFactory} from '../../src/actionFactory';
import {Area} from '../../src/model/area/area';
import {AreaBuilder} from '../areaBuilder';
import {OrderTokenType} from '../../src/model/orderToken/orderTokenType';
import {GamePhase} from '../../src/model/gamePhase';

describe('resolveFight', () => {
    const ironThroneSuccession = [House.lannister, House.stark];
    let store;
    beforeEach(() => {
        store = GameLogicFactory.create([]);
    });
    it('should eliminate defenders army and establish control over attacking area if attacker wins', () => {
        // given
        const attackingArea = new AreaBuilder(AreaKey.Winterfell)
            .withHouse(House.stark)
            .withOrderToken(OrderTokenType.march_special)
            .withUnits([UnitType.Horse])
            .build();
        const defendingArea = new AreaBuilder(AreaKey.WhiteHarbor)
            .withHouse(House.lannister)
            .withOrderToken(OrderTokenType.defend_0)
            .withUnits([UnitType.Footman])
            .build();
        const playerStark = new Player(House.stark, 5);
        const players = [playerStark, new Player(House.lannister, 5)];
        const areas = new Map<AreaKey, Area>();
        areas.set(attackingArea.key, attackingArea);
        areas.set(defendingArea.key, defendingArea);

        const gameStoreState = {
            areas: areas,
            players,
            ironThroneSuccession,
            currentHouse: House.stark,
            gamePhase: GamePhase.ACTION_MARCH
        };
        store.execute(ActionFactory.loadGame(gameStoreState));
        // when
        store.execute(ActionFactory.resolveFight(attackingArea.key, defendingArea.key));

        const currenState = store.getState();
        const newDefendingArea: Area = currenState.areas.get(defendingArea.key);
        const newAttackingArea: Area = currenState.areas.get(attackingArea.key);
        // then
        expect(newDefendingArea.controllingHouse).toBe(House.stark);
        expect(newDefendingArea.orderToken).toBeNull();
        expect(newDefendingArea.units.length).toBe(1);
        expect(newDefendingArea.units[0].getType()).toBe(UnitType.Horse);
        expect(newDefendingArea.units[0].getHouse()).toBe(House.stark);
        expect(newAttackingArea.controllingHouse).toBe(House.stark);
        expect(newAttackingArea.orderToken).toBeNull();
        expect(newAttackingArea.units.length).toBe(0);
        expect(newAttackingArea.controllingHouse).toBe(House.stark);
        expect(currenState.currentHouse).toBeNull();
        expect(currenState.gamePhase).toBe(GamePhase.PLANNING);

    });

    it('should let the defende win if opponents have the same strength', () => {
        // given
        const attackingArea = new AreaBuilder(AreaKey.Winterfell)
            .withHouse(House.stark)
            .withOrderToken(OrderTokenType.march_zero)
            .withUnits([UnitType.Horse])
            .build();
        const defendingArea = new AreaBuilder(AreaKey.WhiteHarbor)
            .withHouse(House.lannister)
            .withOrderToken(OrderTokenType.defend_0)
            .withUnits([UnitType.Footman])
            .build();
        const playerStark = new Player(House.stark, 5);
        const players = [playerStark, new Player(House.lannister, 5)];
        const areas = new Map<AreaKey, Area>();
        areas.set(attackingArea.key, attackingArea);
        areas.set(defendingArea.key, defendingArea);

        const gameStoreState = {
            areas: areas,
            players,
            ironThroneSuccession,
            currentHouse: House.stark
        };
        store.execute(ActionFactory.loadGame(gameStoreState));
        // when
        store.execute(ActionFactory.resolveFight(attackingArea.key, defendingArea.key));

        const newState = store.getState();
        // then
        const updatedAttackingArea = newState.areas.get(attackingArea.key);
        const updatedDefendingArea = newState.areas.get(defendingArea.key);
        expect(updatedAttackingArea.units.length).toBe(0);
        expect(updatedAttackingArea.orderToken).toBeNull();
        expect(updatedAttackingArea.controllingHouse).toBeNull();
        expect(updatedDefendingArea.units.length).toBe(1);
        expect(newState.currentHouse).not.toBe(House.stark);
    });
    it('it should elimite attackers army, remove its control over attacking area and remove order Token if defender wins', () => {
        // given
        const attackingArea = new AreaBuilder(AreaKey.Winterfell)
            .withHouse(House.stark)
            .withUnits([UnitType.Footman])
            .withOrderToken(OrderTokenType.march_zero)
            .build();
        const defendingArea = new AreaBuilder(AreaKey.WhiteHarbor)
            .withHouse(House.lannister)
            .withUnits([UnitType.Horse])
            .withOrderToken(OrderTokenType.defend_0)
            .build();
        const areas: Map<AreaKey, Area> = new Map<AreaKey, Area>();
        areas.set(attackingArea.key, attackingArea);
        areas.set(defendingArea.key, defendingArea);

        const state = {areas, ironThroneSuccession, players: []};

        store.execute(ActionFactory.loadGame(state));

        // when
        store.execute(ActionFactory.resolveFight(attackingArea.key, defendingArea.key));
        const newState = store.getState();
        // then
        const updatedAttackingArea = newState.areas.get(attackingArea.key);
        const updatedDefendingArea = newState.areas.get(defendingArea.key);
        expect(updatedAttackingArea.units.length).toBe(0);
        expect(updatedAttackingArea.orderToken).toBeNull();
        expect(updatedAttackingArea.controllingHouse).toBeNull();
        expect(updatedDefendingArea.units.length).toBe(1);
        expect(newState.currentHouse).not.toBe(House.stark);

    });
});

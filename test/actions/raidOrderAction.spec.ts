import {AreaBuilder} from '../areaBuilder';
import {AreaKey} from '../../src/model/area/areaKey';
import {Player} from '../../src/model/player/player';
import {House} from '../../src/model/player/house';
import {GameLogicFactory} from '../../src/gameLogicFactory';
import {ActionFactory} from '../../src/actionFactory';
import {Area} from '../../src/model/area/area';

import {OrderTokenType} from '../../src/model/orderToken/orderTokenType';
import {GamePhase} from '../../src/model/gamePhase';


describe('executeRaidOrder', () => {

    let playerStark: Player;
    let playerLannister: Player;
    let store;
    beforeEach(() => {
        store = GameLogicFactory.create([]);
        playerStark = new Player(House.stark, 0);
        playerLannister = new Player(House.lannister, 0);
    });


    const sourceArea = new AreaBuilder(AreaKey.Winterfell)
        .withHouse(House.lannister)
        .withOrderToken(OrderTokenType.raid_0)
        .build();

    const areaWithMarchToken = new AreaBuilder(AreaKey.Pyke)
        .withHouse(House.baratheon)
        .withOrderToken(OrderTokenType.march_zero)
        .build();

    it('should remove orderToken in target and source area', () => {


        const targetArea = new AreaBuilder(AreaKey.WhiteHarbor)
            .withHouse(House.stark)
            .withOrderToken(OrderTokenType.raid_0)
            .build();
        const areas = new Map<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, sourceArea);
        areas.set(AreaKey.WhiteHarbor, targetArea);
        let gameStoreState = {
            players: [playerStark, playerLannister],
            areas: areas,
            gamePhase: GamePhase.ACTION_RAID,
            ironThroneSuccession: [House.stark]
        };
        store.execute(ActionFactory.loadGame(gameStoreState));

        store.execute(ActionFactory.executeRaidOrder(sourceArea.key, targetArea.key));
        const newState = store.getState();
        expect(newState).not.toBe(gameStoreState);
        expect(newState.areas.get(sourceArea.key)).not.toBe(sourceArea);
        expect(newState.areas.get(sourceArea.key).orderToken).toBeNull();
        expect(newState.areas.get(targetArea.key)).not.toBe(targetArea);
        expect(newState.areas.get(targetArea.key).orderToken).toBeNull();
    });

    it('should increase consolidate power if targetAre contains consolidate Power Token and not reduce target player.powerToken < 0', () => {

        const targetArea = new AreaBuilder(AreaKey.WhiteHarbor)
            .withHouse(House.stark)
            .withOrderToken(OrderTokenType.consolidatePower_special)
            .build();
        const areas = new Map<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, sourceArea);
        areas.set(AreaKey.WhiteHarbor, targetArea);
        let gameStoreState = {
            players: [playerStark, playerLannister],
            areas: areas,
            gamePhase: GamePhase.ACTION_RAID,
            ironThroneSuccession: [House.stark]
        };
        store.execute(ActionFactory.loadGame(gameStoreState));
        store.execute(ActionFactory.executeRaidOrder(sourceArea.key, targetArea.key));
        const newState = store.getState();
        expect(newState).not.toBe(gameStoreState);

        expect(playerLannister.powerToken).toEqual(1);
        expect(playerStark.powerToken).toEqual(0);
    });

    it('should reduce powerToken by one for player owning target area', () => {

        playerStark.powerToken = 5;
        const targetArea = new AreaBuilder(AreaKey.WhiteHarbor)
            .withHouse(House.stark)
            .withOrderToken(OrderTokenType.consolidatePower_special)
            .build();
        const areas = new Map<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, sourceArea);
        areas.set(AreaKey.WhiteHarbor, targetArea);
        let gameStoreState = {
            players: [playerStark, playerLannister],
            areas: areas,
            gamePhase: GamePhase.ACTION_RAID,
            ironThroneSuccession: [House.lannister, House.baratheon],
            currentHouse: House.lannister
        };
        store.execute(ActionFactory.loadGame(gameStoreState));

        store.execute(ActionFactory.executeRaidOrder(sourceArea.key, targetArea.key));
        expect(playerLannister.powerToken).toEqual(1);
        expect(playerStark.powerToken).toEqual(4);
        expect(store.getState().gamePhase).toBe(GamePhase.PLANNING);
        expect(store.getState().currentHouse).toBeNull();
    });

});


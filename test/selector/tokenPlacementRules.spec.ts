import {House} from '../../src/model/player/house';
import StateSelectorService from '../../src/selector/stateSelectorService';
import AreaBuilder from '../areaBuilder';
import Player from '../../src/model/player/player';
import {UnitType} from '../../src/model/units/unitType';
import {AreaKey} from '../../src/model/area/areaKey';
import {OrderTokenType} from '../../src/model/orderToken/orderTokenType';
import GameStoreFactory from '../../src/gameStoreFactory';
import {ActionFactory} from '../../src/ActionFactory';
import Area from '../../src/model/area/area';

describe('TokenPlacementRules', () => {

    let playerStark: Player;
    let playerLannister: Player;
    let store;
    beforeEach(() => {
        store = GameStoreFactory.create([]);
        playerStark = new Player(House.stark, 0);
        playerLannister = new Player(House.lannister, 0);
    });

    it('should be allowed to place a token on winterfell', () => {
        const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.lannister).withUnits([UnitType.Footman]).build();
        const areas = new Map<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, winterfell);
        let gameStoreState = {players: [playerStark, playerLannister], areas: areas};
        store.dispatch(ActionFactory.loadGame(gameStoreState));
        const actual = StateSelectorService.isAllowedToPlaceOrderToken(store.getState(), House.lannister, AreaKey.Winterfell);
        expect(actual).toBe(true);
    });

    it('should not be allowed to place a token on an field that is not occupied by the house', () => {
        const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.lannister).withUnits([UnitType.Footman]).build();
        const areas = new Map<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, winterfell);
        let gameStoreState = {players: [playerStark, playerLannister], areas: areas};
        store.dispatch(ActionFactory.loadGame(gameStoreState));
        const actual = StateSelectorService.isAllowedToPlaceOrderToken(store.getState(), House.stark, AreaKey.Winterfell);
        expect(actual).toBe(false);
    });

    it('should not be allowed to place a token on an area with not units', () => {
        const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.lannister).build();
        const areas = new Map<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, winterfell);
        let gameStoreState = {players: [playerStark, playerLannister], areas: areas};
        store.dispatch(ActionFactory.loadGame(gameStoreState));
        const actual = StateSelectorService.isAllowedToPlaceOrderToken(store.getState(), House.lannister, AreaKey.Winterfell);
        expect(actual).toBe(false);

    });

    it('should not be allowed to place a token on an area with an orderToken already placed', () => {
        const winterfell = new AreaBuilder(AreaKey.Winterfell)
            .withHouse(House.lannister)
            .withUnits([UnitType.Footman])
            .withOrderToken(OrderTokenType.consolidatePower_1).build();
        const areas = new Map<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, winterfell);
        let gameStoreState = {players: [playerStark, playerLannister], areas: areas};
        store.dispatch(ActionFactory.loadGame(gameStoreState));
        const actual = StateSelectorService.isAllowedToPlaceOrderToken(store.getState(), House.lannister, AreaKey.Winterfell);
        expect(actual).toBe(false);
    });

    describe('isAllowedToRaid', () => {
        it('should not be allowed if areas are not conntected', () => {
            const winterfell = new AreaBuilder(AreaKey.Winterfell).withOrderToken(OrderTokenType.consolidatePower_0).withHouse(House.stark).build();
            const whiteHarbour = new AreaBuilder(AreaKey.WhiteHarbor).withOrderToken(OrderTokenType.consolidatePower_0).withHouse(House.stark).build();
            const areas = new Map<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, winterfell);
            areas.set(AreaKey.WhiteHarbor, whiteHarbour);
            let gameStoreState = {players: [playerStark, playerLannister], areas: areas};
            store.dispatch(ActionFactory.loadGame(gameStoreState));
            const actual = StateSelectorService.isAllowedToRaid(winterfell, whiteHarbour);
            expect(actual).toBeFalsy();
        });


        it('should not be allowed if target area is not controlled by a house', () => {

            const whiteHarbour = new AreaBuilder(AreaKey.WhiteHarbor)
                .withOrderToken(OrderTokenType.consolidatePower_0)
                .build();

            const winterfell = new AreaBuilder(AreaKey.Winterfell)
                .withOrderToken(OrderTokenType.consolidatePower_0)
                .withHouse(House.stark)
                .build();

            const areas = new Map<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, winterfell);
            areas.set(AreaKey.WhiteHarbor, whiteHarbour);

            let gameStoreState = {players: [playerStark, playerLannister], areas: areas};
            store.dispatch(ActionFactory.loadGame(gameStoreState));
            const actual = StateSelectorService.isAllowedToRaid(winterfell, whiteHarbour);
            expect(actual).toBeFalsy();
        });

        it('should not be allowed if both areas belong to the same house', () => {
            const whiteHarbour = new AreaBuilder(AreaKey.WhiteHarbor)
                .withOrderToken(OrderTokenType.consolidatePower_0)
                .withHouse(House.stark)
                .build();

            const winterfell = new AreaBuilder(AreaKey.Winterfell)
                .withOrderToken(OrderTokenType.consolidatePower_0)
                .withHouse(House.stark)
                .build();

            const areas = new Map<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, winterfell);
            areas.set(AreaKey.WhiteHarbor, whiteHarbour);

            let gameStoreState = {players: [playerStark, playerLannister], areas: areas};
            store.dispatch(ActionFactory.loadGame(gameStoreState));


            const actual = StateSelectorService.isAllowedToRaid(winterfell, whiteHarbour);
            expect(actual).toBeFalsy();
        });

        it('should not be allowed if land area is raiding a sea area', () => {
            const whiteHarbour = new AreaBuilder(AreaKey.WhiteHarbor)
                .withOrderToken(OrderTokenType.consolidatePower_0)
                .withHouse(House.stark)
                .build();

            const theShiveringSea = new AreaBuilder(AreaKey.TheShiveringSea)
                .withOrderToken(OrderTokenType.consolidatePower_0)
                .withHouse(House.lannister)
                .build();

            const areas = new Map<AreaKey, Area>();
            areas.set(AreaKey.TheShiveringSea, theShiveringSea);
            areas.set(AreaKey.WhiteHarbor, whiteHarbour);

            const actual = StateSelectorService.isAllowedToRaid(whiteHarbour, theShiveringSea);
            expect(actual).toBeFalsy();
        });

        it('should be allowed if sea area is raiding a land area owned by another house', () => {
            const whiteHarbour = new AreaBuilder(AreaKey.WhiteHarbor)
                .withOrderToken(OrderTokenType.consolidatePower_0)
                .withHouse(House.stark)
                .build();

            const winterfell = new AreaBuilder(AreaKey.Winterfell)
                .withOrderToken(OrderTokenType.raid_0)
                .withHouse(House.lannister)
                .build();
            const areas = new Map<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, winterfell);
            areas.set(AreaKey.WhiteHarbor, whiteHarbour);

            let gameStoreState = {players: [playerStark, playerLannister], areas: areas};
            store.dispatch(ActionFactory.loadGame(gameStoreState));


            const actual = StateSelectorService.isAllowedToRaid(winterfell, whiteHarbour);
            expect(actual).toBeTruthy();
        });

        it('should be allowed if land area is raiding a land area owned by another house', () => {
            const whiteHarbour = new AreaBuilder(AreaKey.WhiteHarbor)
                .withOrderToken(OrderTokenType.consolidatePower_0)
                .withHouse(House.stark)
                .build();

            const winterfell = new AreaBuilder(AreaKey.Winterfell)
                .withOrderToken(OrderTokenType.raid_0)
                .withHouse(House.lannister)
                .build();

            const areas = new Map<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, winterfell);
            areas.set(AreaKey.WhiteHarbor, whiteHarbour);

            let gameStoreState = {players: [playerStark, playerLannister], areas: areas};
            store.dispatch(ActionFactory.loadGame(gameStoreState));

            const actual = StateSelectorService.isAllowedToRaid(winterfell, whiteHarbour);
            expect(actual).toBeTruthy();
        });
    });

    describe('getPlacableOrderTokenTypes', () => {
        it('it should return all currentlyAllowedTokenTypes if not order was placed yet', () => {
            // given
            const state = {
                currentlyAllowedTokenTypes: [OrderTokenType.consolidatePower_0, OrderTokenType.consolidatePower_1],
                areas: new Map<AreaKey, Area>()
            };
            store.dispatch(ActionFactory.loadGame(state));

            // when
            const actual = StateSelectorService.getPlacableOrderTokenTypes(state, House.stark);
            // then
            expect(actual).toEqual(store.getState().currentlyAllowedTokenTypes);
        });

        it('it should return all currentlyAllowedTokenTypes minus the once already placed', () => {
            // given
            const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withOrderToken(OrderTokenType.consolidatePower_1).build();
            const areas = new Map<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, winterfell);
            const state = {
                currentlyAllowedTokenTypes: [OrderTokenType.defend_0, OrderTokenType.consolidatePower_1],
                areas: areas
            };
            store.dispatch(ActionFactory.loadGame(state));

            // when
            const actual = StateSelectorService.getPlacableOrderTokenTypes(state, House.stark);
            // then
            expect(actual).toEqual([OrderTokenType.defend_0]);
        });

    });

    describe('isConnectedArea', () => {

        it('should return the true for adjacent areas', () => {

            // given
            let karhold = new AreaBuilder(AreaKey.Karhold).build();
            let winterfell = new AreaBuilder(AreaKey.Winterfell)
                .build();
            const areas = new Map<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, winterfell);
            areas.set(AreaKey.Karhold, karhold);
            let gameStoreState = {areas: areas};
            store.dispatch(ActionFactory.loadGame(gameStoreState));

            // when
            let actual = StateSelectorService.isConnectedArea(winterfell, karhold);

            // then
            expect(actual).toBeTruthy();

        });

        it('should return the false for non adjacent areas', () => {

            // given
            let pyke = new AreaBuilder(AreaKey.Pyke).build();
            let winterfell = new AreaBuilder(AreaKey.Winterfell)
                .build();
            const areas = new Map<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, winterfell);
            areas.set(AreaKey.Pyke, pyke);
            // when
            let actual = StateSelectorService.isConnectedArea(pyke, winterfell);

            // then
            expect(actual).toBeFalsy();

        });

    });

});

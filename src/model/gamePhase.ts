enum GamePhase {
    // WESTEROS1 = 'WESTEROS1',
    // WESTEROS2 = 'WESTEROS2',
    // WESTEROS3 = 'WESTEROS3',
    PLANNING = 'PLANNING',
    ACTION_RAID = 'ACTION_RAID',
    ACTION_MARCH = 'ACTION_MARCH',
    ACTION_CLEANUP = 'ACTION_CLEANUP'
}

const ACTION_PHASES = [GamePhase.ACTION_RAID,
    GamePhase.ACTION_MARCH,
    GamePhase.ACTION_CLEANUP];


/*const WESTEROS_PHASES = [GamePhase.WESTEROS1,
    GamePhase.WESTEROS2,
    GamePhase.WESTEROS3];
*/
const ALL_PHASES = [
    //GamePhase.WESTEROS1,
    //GamePhase.WESTEROS2,
    //GamePhase.WESTEROS3,
    GamePhase.PLANNING,
    GamePhase.ACTION_RAID,
    GamePhase.ACTION_MARCH,
    GamePhase.ACTION_CLEANUP];

export {ALL_PHASES, GamePhase};

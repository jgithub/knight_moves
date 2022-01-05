/**
 * A few constants...
 */

/*
 * Every knight movement looks like an 'L'.   There's a long side and a short side
 */
// TODO: Naming
export const KNIGHT_JUMP_LONG = 2
export const KNIGHT_JUMP_SHORT = 1

/*
 * This is how far a knight travels when it moves
 */
export const KNIGHT_JUMP_DISTANCE = Math.sqrt(Math.pow(KNIGHT_JUMP_LONG, 2) + Math.pow(KNIGHT_JUMP_SHORT, 2))

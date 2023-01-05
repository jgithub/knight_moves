"use strict";
/**
 * A few constants...
 */
exports.__esModule = true;
exports.KNIGHT_JUMP_DISTANCE = exports.KNIGHT_JUMP_SHORT = exports.KNIGHT_JUMP_LONG = void 0;
/*
 * Every knight movement looks like an 'L'.   There's a long side and a short side
 */
// TODO: Naming
exports.KNIGHT_JUMP_LONG = 2;
exports.KNIGHT_JUMP_SHORT = 1;
/*
 * This is how far a knight travels when it moves
 */
exports.KNIGHT_JUMP_DISTANCE = Math.sqrt(Math.pow(exports.KNIGHT_JUMP_LONG, 2) + Math.pow(exports.KNIGHT_JUMP_SHORT, 2));

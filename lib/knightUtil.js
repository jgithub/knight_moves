"use strict";
exports.__esModule = true;
exports.applyKnightMovementFrom = void 0;
var ChessBoardSquare_1 = require("./ChessBoardSquare");
var KnightMoveDirection_1 = require("./KnightMoveDirection");
var constant_1 = require("./constant");
var KmLogger_1 = require("./log/KmLogger");
var LOG = KmLogger_1.KmLogger.getLogger('knightUtil.ts');
/**
 * Given a current square and a "Knight Jump direction",
 * what is the next square on which the Knight will end up
 *
 * This square may be "off the board"
 *
 * @param currentSquare
 * @param direction
 */
var applyKnightMovementFrom = function (currentSquare, direction) {
    var newSquare = (function () {
        LOG.debug("moveCloneInDirection(): Jumping '".concat(direction, "' from currentSquare = ").concat(currentSquare));
        switch (direction) {
            case KnightMoveDirection_1.KnightMoveDirection.northNorthEast: {
                return new ChessBoardSquare_1.ChessBoardSquare(currentSquare.getChessBoard(), currentSquare.getX() + constant_1.KNIGHT_JUMP_SHORT, currentSquare.getY() + constant_1.KNIGHT_JUMP_LONG);
            }
            case KnightMoveDirection_1.KnightMoveDirection.eastNorthEast: {
                return new ChessBoardSquare_1.ChessBoardSquare(currentSquare.getChessBoard(), currentSquare.getX() + constant_1.KNIGHT_JUMP_LONG, currentSquare.getY() + constant_1.KNIGHT_JUMP_SHORT);
            }
            case KnightMoveDirection_1.KnightMoveDirection.eastSouthEast: {
                return new ChessBoardSquare_1.ChessBoardSquare(currentSquare.getChessBoard(), currentSquare.getX() + constant_1.KNIGHT_JUMP_LONG, currentSquare.getY() - constant_1.KNIGHT_JUMP_SHORT);
            }
            case KnightMoveDirection_1.KnightMoveDirection.southSouthEast: {
                return new ChessBoardSquare_1.ChessBoardSquare(currentSquare.getChessBoard(), currentSquare.getX() + constant_1.KNIGHT_JUMP_SHORT, currentSquare.getY() - constant_1.KNIGHT_JUMP_LONG);
            }
            case KnightMoveDirection_1.KnightMoveDirection.southSouthWest: {
                return new ChessBoardSquare_1.ChessBoardSquare(currentSquare.getChessBoard(), currentSquare.getX() - constant_1.KNIGHT_JUMP_SHORT, currentSquare.getY() - constant_1.KNIGHT_JUMP_LONG);
            }
            case KnightMoveDirection_1.KnightMoveDirection.westSouthWest: {
                return new ChessBoardSquare_1.ChessBoardSquare(currentSquare.getChessBoard(), currentSquare.getX() - constant_1.KNIGHT_JUMP_LONG, currentSquare.getY() - constant_1.KNIGHT_JUMP_SHORT);
            }
            case KnightMoveDirection_1.KnightMoveDirection.westNorthWest: {
                return new ChessBoardSquare_1.ChessBoardSquare(currentSquare.getChessBoard(), currentSquare.getX() - constant_1.KNIGHT_JUMP_LONG, currentSquare.getY() + constant_1.KNIGHT_JUMP_SHORT);
            }
            case KnightMoveDirection_1.KnightMoveDirection.northNorthWest: {
                return new ChessBoardSquare_1.ChessBoardSquare(currentSquare.getChessBoard(), currentSquare.getX() - constant_1.KNIGHT_JUMP_SHORT, currentSquare.getY() + constant_1.KNIGHT_JUMP_LONG);
            }
        }
    })();
    LOG.debug("moveCloneInDirection(): Returning ".concat(newSquare));
    return newSquare;
};
exports.applyKnightMovementFrom = applyKnightMovementFrom;

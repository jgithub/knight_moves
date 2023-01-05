"use strict";
exports.__esModule = true;
exports.ChessBoardSquare = void 0;
var KmLogger_1 = require("./log/KmLogger");
/**
 * This represents a single square on a chess board
 * 1,1 is the lower left-hand corner of the board
 */
var ChessBoardSquare = /** @class */ (function () {
    function ChessBoardSquare(chessBoard, x, y) {
        this.LOG = ChessBoardSquare.LOG;
        this.m_chessBoardRef = chessBoard;
        this.m_x = x;
        this.m_y = y;
    }
    ChessBoardSquare.prototype.toString = function () {
        return "(".concat(this.m_x, ", ").concat(this.m_y, ")");
    };
    /**
     * Return the square's X-position
     */
    ChessBoardSquare.prototype.getX = function () {
        return this.m_x;
    };
    /**
     * Return the square's Y-position
     */
    ChessBoardSquare.prototype.getY = function () {
        return this.m_y;
    };
    /**
     * Return the associated Chess Board reference
     */
    ChessBoardSquare.prototype.getChessBoard = function () {
        return this.m_chessBoardRef;
    };
    /**
     * Is this square, with it's current specified X, Y location, a valid square on
     * the associated chess board?
     */
    ChessBoardSquare.prototype.isOnBoard = function () {
        if (this.getX() > this.getChessBoard().getNumCols()) {
            this.LOG.debug("isOnBoard(): Returning FALSE  this = ".concat(this));
            return false;
        }
        if (this.getY() > this.getChessBoard().getNumRows()) {
            this.LOG.debug("isOnBoard(): Returning FALSE  this = ".concat(this));
            return false;
        }
        if (this.getX() < 1) {
            this.LOG.debug('isOnBoard(): X-pos cannot be less than 1');
            return false;
        }
        if (this.getY() < 1) {
            this.LOG.debug('isOnBoard(): Y-pos cannot be less than 1');
            return false;
        }
        this.LOG.trace("isOnBoard(): Returning TRUE.  this = ".concat(this));
        return true;
    };
    /**
     * Calculate the distance between this square and another
     */
    ChessBoardSquare.prototype.distanceBetween = function (anotherSquare) {
        var xDiff = anotherSquare.getX() - this.m_x;
        var yDiff = anotherSquare.getY() - this.m_y;
        var c = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
        this.LOG.trace("distanceBetween(): Returning ".concat(c, ",   based on xDiff = ").concat(xDiff, ", yDiff = ").concat(yDiff, ", c = ").concat(c));
        return c;
    };
    /**
     * Calculate the horizontal distance between this square and another
     */
    ChessBoardSquare.prototype.deltaX = function (anotherSquare) {
        return anotherSquare.getX() - this.m_x;
    };
    /**
     * Calculate the horizontal distance between this square and another
     */
    ChessBoardSquare.prototype.deltaY = function (anotherSquare) {
        return anotherSquare.getY() - this.m_y;
    };
    /**
     * Is this square in the same location as another?
     */
    ChessBoardSquare.prototype.isSameAs = function (anotherSquare) {
        var retval = this.distanceBetween(anotherSquare) === 0;
        this.LOG.trace("isSameAs(): Returning ".concat(retval));
        return retval;
    };
    ChessBoardSquare.LOG = KmLogger_1.KmLogger.getLogger('ChessBoardSquare');
    return ChessBoardSquare;
}());
exports.ChessBoardSquare = ChessBoardSquare;

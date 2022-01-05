"use strict";
exports.__esModule = true;
exports.ChessBoard = void 0;
var KmLogger_1 = require("./log/KmLogger");
/**
 * Represents a ChessBoard object... specifically the dimensions of a board
 */
var ChessBoard = /** @class */ (function () {
    function ChessBoard(numCols, numRows) {
        this.LOG = ChessBoard.LOG;
        this.m_numCols = numCols;
        this.m_numRows = numRows;
        this.LOG.debug("constructor(): Creating chess board ".concat(numCols, "x").concat(numRows, "..."));
    }
    // corresponds to X
    ChessBoard.prototype.getNumCols = function () {
        return this.m_numCols;
    };
    // corresponds to Y
    ChessBoard.prototype.getNumRows = function () {
        return this.m_numRows;
    };
    ChessBoard.LOG = KmLogger_1.KmLogger.getLogger('ChessBoard');
    return ChessBoard;
}());
exports.ChessBoard = ChessBoard;

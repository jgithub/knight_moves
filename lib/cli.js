"use strict";
/**
 * This file provides the the "knight_moves CLI" functionality
 */
exports.__esModule = true;
var ChessBoardSquare_1 = require("./ChessBoardSquare");
var ChessBoard_1 = require("./ChessBoard");
var KmLogger_1 = require("./log/KmLogger");
var KnightMoveOptimizer_1 = require("./KnightMoveOptimizer");
var chessBoard;
var knightStartingSquare;
var knightDestinationSquare;
var LOG = KmLogger_1.KmLogger.getLogger('cli.ts');
/*
       d8888
      d88888
     d88P888
    d88P 888   888d888 .d88b.    888  888
   d88P  888   888P"  d88P"88b   888  888
  d88P   888   888    888  888   Y88  88P
 d8888888888   888    Y88b 888    Y8bd8P
d88P     888   888     "Y88888     Y88P
                           888
                      Y8b d88P
                       "Y88P"
*/
{
    var myArgs = process.argv.slice(2);
    LOG.debug("cli.ts: myArgs = ".concat(JSON.stringify(myArgs)));
    var keyValuePairs = new Map();
    for (var ii = 0; ii < myArgs.length; ii++) {
        var key = myArgs[ii];
        ii++;
        var value = myArgs[ii];
        LOG.debug("Handling key/value = '".concat(key, "'/'").concat(value, "'"));
        keyValuePairs.set(key, value);
    }
    /* Handle Argv */
    var argKeys = Array.from(keyValuePairs.keys());
    for (var ii = 0; ii < argKeys.length; ii++) {
        var key = argKeys[ii];
        var value = keyValuePairs.get(key);
        LOG.debug("Handling key/value = '".concat(key, "'/'").concat(value, "'"));
        if (key === '--board_size') {
            var _a = (value).split(','), x = _a[0], y = _a[1];
            LOG.debug("Handling board_size = '".concat(value, "'"));
            chessBoard = new ChessBoard_1.ChessBoard(Number(x), Number(y));
        }
        else if (key === '--source') {
            if (chessBoard == null) {
                throw new Error('Please specify the --board_size before --source and --dest');
            }
            var _b = (value).split(','), x = _b[0], y = _b[1];
            knightStartingSquare = new ChessBoardSquare_1.ChessBoardSquare(chessBoard, Number(x), Number(y));
        }
        else if (key === '--dest') {
            if (chessBoard == null) {
                throw new Error('Please specify the --board_size before --source and --dest');
            }
            var _c = (value).split(','), x = _c[0], y = _c[1];
            knightDestinationSquare = new ChessBoardSquare_1.ChessBoardSquare(chessBoard, Number(x), Number(y));
        }
    }
}
var knightMoveOptimizer = new KnightMoveOptimizer_1.KnightMoveOptimizer();
var knightInTransit = knightMoveOptimizer.optimize(knightStartingSquare, knightDestinationSquare);
if (knightInTransit != null && knightInTransit.getNumSquaresInPath() > 0) {
    console.log(">> ".concat(knightInTransit.toString()));
    console.log(">> ".concat(knightInTransit.getNumSquaresInPath()));
}
else {
    console.log('-1');
}
// % npx ts-node knight_moves.ts --board_size 11,11 --dest 11,11 --source 1,1
// % npx ts-node knight_moves.ts --board_size 11,11 --dest 10,10 --source 1,1
// % ./knight_moves --board_size 3,3 --dest 3,3 --source 1,1
// % ./knight_moves --board_size 27,27 --dest 27,27 --source 1,1
// >> (1, 1) -> (2, 3) -> (3, 5) -> (4, 7) -> (5, 9) -> (6, 11) -> (7, 13) -> (8, 15) -> (9, 17) -> (10, 19) -> (11, 21) -> (13, 22) -> (15, 23) -> (17, 24) -> (19, 25) -> (21, 26) -> (23, 27) -> (25, 26) -> (27, 27)
// >> 19
// jeano@MacBook-Pro app %

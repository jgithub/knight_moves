"use strict";
exports.__esModule = true;
var knight_moves_1 = require("./knight_moves");
var chessBoard;
var knightStartingSquare;
var knightDestinationSquare;
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
    (0, knight_moves_1.debug)("myArgs = ".concat(JSON.stringify(myArgs)));
    var keyValuePairs = new Map();
    for (var ii = 0; ii < myArgs.length; ii++) {
        var key = myArgs[ii];
        ii++;
        var value = myArgs[ii];
        (0, knight_moves_1.debug)("Handling key/value = '".concat(key, "'/'").concat(value, "'"));
        keyValuePairs.set(key, value);
    }
    /* Handle Argv */
    var argKeys = Array.from(keyValuePairs.keys());
    for (var ii = 0; ii < argKeys.length; ii++) {
        var key = argKeys[ii];
        var value = keyValuePairs.get(key);
        (0, knight_moves_1.debug)("Handling key/value = '".concat(key, "'/'").concat(value, "'"));
        if (key === '--board_size') {
            var _a = (value).split(','), x = _a[0], y = _a[1];
            (0, knight_moves_1.debug)("Handling board_size = '".concat(value, "'"));
            chessBoard = new knight_moves_1.ChessBoard(Number(x), Number(y));
        }
        else if (key === '--source') {
            var _b = (value).split(','), x = _b[0], y = _b[1];
            knightStartingSquare = new knight_moves_1.ChessBoardSquare(Number(x), Number(y));
        }
        else if (key === '--dest') {
            var _c = (value).split(','), x = _c[0], y = _c[1];
            knightDestinationSquare = new knight_moves_1.ChessBoardSquare(Number(x), Number(y));
        }
    }
}
var knightMoveRunner = new knight_moves_1.KnightMoveRunner();
var knightInTransitMovementHistory = knightMoveRunner.run(chessBoard, knightStartingSquare, knightDestinationSquare);
if (knightInTransitMovementHistory != null && knightInTransitMovementHistory.getSize() > 0) {
    console.log(">> ".concat(knightInTransitMovementHistory.toString()));
    console.log(">> ".concat(knightInTransitMovementHistory.getNumDifferentSquares()));
}
else {
    console.log('-1');
}
// % npx ts-node knight_moves.ts --board_size 11,11 --dest 11,11 --source 1,1
// % npx ts-node knight_moves.ts --board_size 11,11 --dest 10,10 --source 1,1
// % ./knight_moves --board_size 3,3 --dest 3,3 --source 1,1
// % ./knight_moves --board_size 27,27 --dest 27,27 --source 1,1
// >> (1, 1) -> (3, 2) -> (5, 3) -> (7, 4) -> (9, 5) -> (11, 6) -> (13, 7) -> (15, 8) -> (17, 9) -> (19, 10) -> (21, 11) -> (22, 13) -> (23, 15) -> (24, 17) -> (25, 19) -> (26, 21) -> (27, 23) -> (26, 25) -> (27, 27)
// >> 19
// jeano@MacBook-Pro app %

// jeano@MacBook-Pro app % cat knight_moves.ts
/**
 * Requires node, typescript, and ts-node
 *
 *
 * Sometimes a knight is adjacent to it's destination, but has to move further
 * away before it can hit the target.
 *
 * - Goals
 * - Simple Brute force
 * - Aim for Correctness with some performance-related implementation debt
 * - Common Sense (to me anyways) filtering-out of "bad moves"
 * - Most everything is immutable\
 * - OO
 * - Program to an interface
 *
 * TODOs:
 * - Create some test sets
 * - Automated testing
 * - Benchmarking
 * - Make this a npm package
 * - A few global vars need cleanup
 */
/*
 * Every knight movement looks like an 'L'.   There's a long side and a short side
 */
var LONG_SIDE = 2;
var SHORT_SIDE = 1;
/*
 * This is how far a knight travels when it moves
 */
var KNIGHT_JUMP_DISTANCE = Math.sqrt(5);
/*

888                                 d8b
888                                 Y8P
888
888       .d88b.   .d88b.   .d88b.  888 88888b.   .d88b.
888      d88""88b d88P"88b d88P"88b 888 888 "88b d88P"88b
888      888  888 888  888 888  888 888 888  888 888  888
888      Y88..88P Y88b 888 Y88b 888 888 888  888 Y88b 888
88888888  "Y88P"   "Y88888  "Y88888 888 888  888  "Y88888
                       888      888                   888
                  Y8b d88P Y8b d88P              Y8b d88P
                   "Y88P"   "Y88P"                "Y88P"

*/
function trace(msg) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    // if ( args.length > 0 ) {
    //   console.log(msg, args)
    // } else {
    //   console.log(msg)
    // }
}
function debug(msg) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    // if ( args.length > 0 ) {
    //   console.log(msg, args)
    // } else {
    //   console.log(msg)
    // }
}
function info(msg) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    // if ( args.length > 0 ) {
    //   console.info(msg, args)
    // } else {
    //   console.info(msg)
    // }
}
function warn(msg) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    // if ( args.length > 0 ) {
    //   console.warn(msg, args)
    // } else {
    //   console.warn(msg)
    // }
}
/*
 * These are all the possible directions a Knight can move
 */
var KnightMoveDirection;
(function (KnightMoveDirection) {
    KnightMoveDirection["northNorthEast"] = "northNorthEast";
    KnightMoveDirection["eastNorthEast"] = "eastNorthEast";
    KnightMoveDirection["eastSouthEast"] = "eastSouthEast";
    KnightMoveDirection["southSouthEast"] = "southSouthEast";
    KnightMoveDirection["southSouthWest"] = "southSouthWest";
    KnightMoveDirection["westSouthWest"] = "westSouthWest";
    KnightMoveDirection["westNorthWest"] = "westNorthWest";
    KnightMoveDirection["northNorthWest"] = "northNorthWest";
})(KnightMoveDirection || (KnightMoveDirection = {}));
/*
 * An iteratable list of all possible directions
 */
var iterateAllDirections = Object.freeze([
    KnightMoveDirection.northNorthEast,
    KnightMoveDirection.eastNorthEast,
    KnightMoveDirection.eastSouthEast,
    KnightMoveDirection.southSouthEast,
    KnightMoveDirection.southSouthWest,
    KnightMoveDirection.westSouthWest,
    KnightMoveDirection.westNorthWest,
    KnightMoveDirection.northNorthWest
    // TODO: Prob cleaner way to do this
]);
/**
 * This represents a single square on a chess board
 * 1,1 is the lower left-hand corner of the board
 */
var ChessBoardSquare = /** @class */ (function () {
    function ChessBoardSquare(x, y) {
        this.m_x = x;
        this.m_y = y;
    }
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
     * Calculate the distance to another position
     */
    ChessBoardSquare.prototype.distanceBetween = function (anotherSquare) {
        var xDiff = anotherSquare.getX() - this.m_x;
        var yDiff = anotherSquare.getY() - this.m_y;
        var c = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
        debug("distanceBetween(): Returning ".concat(c, ",   based on xDiff = ").concat(xDiff, ", yDiff = ").concat(yDiff, ", c = ").concat(c));
        return c;
    };
    ChessBoardSquare.prototype.isSameAs = function (anotherSquare) {
        var retval = this.distanceBetween(anotherSquare) === 0;
        debug("isSameAs(): Returning ".concat(retval));
        return retval;
    };
    return ChessBoardSquare;
}());
var ChessBoard = /** @class */ (function () {
    function ChessBoard(numCols, numRows) {
        this.m_numCols = numCols;
        this.m_numRows = numRows;
        debug("constructor(): Creating chess board ".concat(numCols, "x").concat(numRows, "..."));
    }
    // corresponds to X
    ChessBoard.prototype.getNumCols = function () {
        return this.m_numCols;
    };
    // corresponds to Y
    ChessBoard.prototype.getNumRows = function () {
        return this.m_numRows;
    };
    return ChessBoard;
}());
var KnightInTransit = /** @class */ (function () {
    function KnightInTransit(chessBoard, currentSquare, destinationSquare) {
        this.m_currentSquare = currentSquare;
        this.m_destinationSquare = destinationSquare;
        this.m_chessBoardRef = chessBoard;
    }
    KnightInTransit.createWithStartingSquareAndDestinationInMind = function (board, startingSquare, destinationSquare) {
        return new KnightInTransit(board, startingSquare, destinationSquare);
    };
    KnightInTransit.prototype.distanceFromDestination = function () {
        return this.m_destinationSquare.distanceBetween(this.m_currentSquare);
    };
    KnightInTransit.prototype.deltaXFromDestination = function () {
        return Math.abs(this.m_destinationSquare.getX() - this.m_currentSquare.getX());
    };
    KnightInTransit.prototype.deltaYFromDestination = function () {
        return Math.abs(this.m_destinationSquare.getY() - this.m_currentSquare.getY());
    };
    // public amIWithinOneJumpAsTheCrowFlies(): boolean {
    //   return this.m_destinationSquare.distanceBetween(this.m_currentSquare) < KNIGHT_JUMP_DISTANCE
    // }
    // public amIAdjacentFromDestination(): boolean {
    //   return this.m_destinationSquare.distanceBetween(this.m_currentSquare) < Math.sqrt(2)
    // }
    KnightInTransit.prototype.isCurrentSquareEvenOnTheBoard = function () {
        if (this.m_currentSquare.getX() > this.m_chessBoardRef.getNumCols()) {
            debug("isCurrentSquareEvenOnTheBoard(): Returning FALSE  this.m_currentSquare = ".concat(JSON.stringify(this.m_currentSquare)));
            return false;
        }
        if (this.m_currentSquare.getY() > this.m_chessBoardRef.getNumRows()) {
            debug("isCurrentSquareEvenOnTheBoard(): Returning FALSE  this.m_currentSquare = ".concat(JSON.stringify(this.m_currentSquare)));
            return false;
        }
        if (this.m_currentSquare.getX() < 1) {
            debug('isCurrentSquareEvenOnTheBoard(): X-pos cannot be less than 1');
            return false;
        }
        if (this.m_currentSquare.getY() < 1) {
            debug('isCurrentSquareEvenOnTheBoard(): Y-pos cannot be less than 1');
            return false;
        }
        debug("isCurrentSquareEvenOnTheBoard(): Returning TRUE.  this.m_currentSquare = ".concat(JSON.stringify(this.m_currentSquare)));
        return true;
    };
    /**
     * Determine if the Knight has reached it's destination
     */
    KnightInTransit.prototype.amIAtMyDestination = function () {
        var retval = this.m_currentSquare.isSameAs(this.m_destinationSquare);
        debug("amIAtMyDestination(): Returning ".concat(retval));
        return retval;
    };
    /**
     * Instantiate and return a cloned KnightInTransit, having been moved in the specified direction
     */
    KnightInTransit.prototype.cloneAndMoveInDirection = function (direction) {
        var _this = this;
        var newSquare = (function () {
            debug("cloneAndMoveInDirection(): Jumping '".concat(direction, "' from currentSquare = ").concat(JSON.stringify(_this.m_currentSquare)));
            switch (direction) {
                case KnightMoveDirection.northNorthEast: {
                    return new ChessBoardSquare(_this.m_currentSquare.getX() + SHORT_SIDE, _this.m_currentSquare.getY() + LONG_SIDE);
                }
                case KnightMoveDirection.eastNorthEast: {
                    return new ChessBoardSquare(_this.m_currentSquare.getX() + LONG_SIDE, _this.m_currentSquare.getY() + SHORT_SIDE);
                }
                case KnightMoveDirection.eastSouthEast: {
                    return new ChessBoardSquare(_this.m_currentSquare.getX() + LONG_SIDE, _this.m_currentSquare.getY() - SHORT_SIDE);
                }
                case KnightMoveDirection.southSouthEast: {
                    return new ChessBoardSquare(_this.m_currentSquare.getX() + SHORT_SIDE, _this.m_currentSquare.getY() - LONG_SIDE);
                }
                case KnightMoveDirection.southSouthWest: {
                    return new ChessBoardSquare(_this.m_currentSquare.getX() - SHORT_SIDE, _this.m_currentSquare.getY() - LONG_SIDE);
                }
                case KnightMoveDirection.westSouthWest: {
                    return new ChessBoardSquare(_this.m_currentSquare.getX() - LONG_SIDE, _this.m_currentSquare.getY() - SHORT_SIDE);
                }
                case KnightMoveDirection.westNorthWest: {
                    return new ChessBoardSquare(_this.m_currentSquare.getX() - LONG_SIDE, _this.m_currentSquare.getY() + SHORT_SIDE);
                }
                case KnightMoveDirection.northNorthWest: {
                    return new ChessBoardSquare(_this.m_currentSquare.getX() - SHORT_SIDE, _this.m_currentSquare.getY() + LONG_SIDE);
                }
            }
        })();
        debug("cloneAndMoveInDirection(): newSquare = ".concat(JSON.stringify(newSquare)));
        return new KnightInTransit(this.m_chessBoardRef, newSquare, this.m_destinationSquare);
    };
    KnightInTransit.prototype.getCurrentSquare = function () {
        return this.m_currentSquare;
    };
    return KnightInTransit;
}());
var KnightInTransitMovementHistory = /** @class */ (function () {
    function KnightInTransitMovementHistory(existingHistory) {
        if (existingHistory != null) {
            this.m_history = existingHistory.slice();
        }
        else {
            this.m_history = [];
        }
    }
    KnightInTransitMovementHistory.prototype.getSize = function () {
        return this.m_history.length;
    };
    KnightInTransitMovementHistory.prototype.getHistory = function () {
        return this.m_history;
    };
    KnightInTransitMovementHistory.prototype.haveIBeenHereBefore = function (knightInTransit) {
        for (var ii = 0; ii < this.m_history.length; ii++) {
            var knightPostionUnderTest = this.m_history[ii].getCurrentSquare();
            if (knightPostionUnderTest.isSameAs(knightInTransit.getCurrentSquare())) {
                return true;
            }
        }
        return false;
    };
    KnightInTransitMovementHistory.prototype.isThisSquareSignificantlyWorseThanThePrevious = function (knightInTransit) {
        var deltaFromPreviousLocation = knightInTransit.distanceFromDestination() - this.m_history[0].distanceFromDestination();
        debug("isThisSquareSignificantlyWorseThanThePrevious(): deltaFromPreviousLocation = ".concat(deltaFromPreviousLocation));
        /** If we are pretty far away, and we are getting further away still... */
        if ((knightInTransit.distanceFromDestination() > KNIGHT_JUMP_DISTANCE) && deltaFromPreviousLocation > 0) {
            debug('isThisSquareSignificantlyWorseThanThePrevious(): Returning TRUE');
            return true;
        }
        debug('isThisSquareSignificantlyWorseThanThePrevious(): Returning FALSE');
        return false;
    };
    KnightInTransitMovementHistory.prototype.isDistantAndNotGettingCloserInBothDirectionsSimultaneously = function (knightInTransit) {
        var deltaFromLastLocationX = knightInTransit.deltaXFromDestination() - this.m_history[0].deltaXFromDestination();
        var deltaFromLastLocationY = knightInTransit.deltaYFromDestination() - this.m_history[0].deltaYFromDestination();
        debug("isDistantAndNotGettingCloserInBothDirectionsSimultaneously(): deltaFromLastLocationX = ".concat(deltaFromLastLocationX, ",  deltaFromLastLocationY = ").concat(deltaFromLastLocationY));
        /** If we are pretty far away, and we are getting further away still... */
        if ((knightInTransit.distanceFromDestination() > KNIGHT_JUMP_DISTANCE) && (deltaFromLastLocationX > 0 || deltaFromLastLocationY > 0)) {
            debug('isDistantAndNotGettingCloserInBothDirectionsSimultaneously(): Returning TRUE');
            return true;
        }
        debug('isDistantAndNotGettingCloserInBothDirectionsSimultaneously(): Returning FALSE');
        return false;
    };
    KnightInTransitMovementHistory.prototype.isThisSquareWorseInBothDirectionsSimultaneously = function (knightInTransit) {
        var deltaFromLastLocationX = knightInTransit.deltaXFromDestination() - this.m_history[0].deltaXFromDestination();
        var deltaFromLastLocationY = knightInTransit.deltaYFromDestination() - this.m_history[0].deltaYFromDestination();
        debug("isThisSquareWorseInBothDirectionsSimultaneously(): deltaFromLastLocationX = ".concat(deltaFromLastLocationX, ",  deltaFromLastLocationY = ").concat(deltaFromLastLocationY));
        /** If we are pretty far away, and we are getting further away still... */
        if (deltaFromLastLocationX > 0 && deltaFromLastLocationY > 0) {
            debug('isThisSquareWorseInBothDirectionsSimultaneously(): Returning TRUE');
            return true;
        }
        debug('isThisSquareWorseInBothDirectionsSimultaneously(): Returning FALSE');
        return false;
    };
    KnightInTransitMovementHistory.prototype.cloneAndAffixSquare = function (knightInTransit) {
        var clone = new KnightInTransitMovementHistory(this.m_history);
        clone.m_history.unshift(knightInTransit);
        return clone;
    };
    KnightInTransitMovementHistory.prototype.getNumMovesAlready = function () {
        // The starting position is in the array.  So there is one less
        return this.m_history.length - 1;
    };
    KnightInTransitMovementHistory.prototype.getNumDifferentSquares = function () {
        // The starting position is in the array.  So there is one less move than there are positions
        return this.m_history.length;
    };
    KnightInTransitMovementHistory.prototype.toString = function () {
        return this.getHistory().slice().reverse().map(function (item) { return "(".concat(item.getCurrentSquare().getX(), ", ").concat(item.getCurrentSquare().getY(), ")"); }).join(' -> ');
    };
    KnightInTransitMovementHistory.prototype.getMostRecentKnightInTransit = function () {
        return this.m_history[0];
    };
    KnightInTransitMovementHistory.prototype.clone = function () {
        return new KnightInTransitMovementHistory(this.m_history.slice());
    };
    return KnightInTransitMovementHistory;
}());
/**
 * Returns undefined if there are no next moves
 */
function determineBestHistoryThatWorks(knightInTransitMovementHistory, numRecursions, maxNumRecursions) {
    if (numRecursions > 20) {
        warn("determineBestHistoryThatWorks(): Entering with knightInTransitMovementHistory.getSize() = ".concat(knightInTransitMovementHistory.getSize(), ",  knightInTransitMovementHistory = ").concat(knightInTransitMovementHistory.toString(), ",  numRecursions = ").concat(numRecursions));
    }
    debug("determineBestHistoryThatWorks(): Entering with knightInTransitMovementHistory.getSize() = ".concat(knightInTransitMovementHistory.getSize(), ",  numRecursions = ").concat(numRecursions));
    if (maxNumRecursions != null && numRecursions > maxNumRecursions) {
        debug('determineBestHistoryThatWorks(): Too many recursions');
        return undefined;
    }
    var mostRecentKnightMovement = knightInTransitMovementHistory.getMostRecentKnightInTransit();
    if (mostRecentKnightMovement.amIAtMyDestination()) {
        debug('determineBestHistoryThatWorks(): I am there yet');
        return knightInTransitMovementHistory;
    }
    var divergingHistoriesThatWork = [];
    /**
     * Breadth first population of divergingHistoriesThatWork
     */
    for (var ii = 0; ii < iterateAllDirections.length; ii++) {
        /*
         * Should we even consider going in this direction?
         */
        debug("determineBestHistoryThatWorks(): Should we even consider direction = ".concat(ii, " of ").concat(iterateAllDirections.length, ": ").concat(iterateAllDirections[ii]));
        var considerThisAsNextDirection = iterateAllDirections[ii];
        var considerThisKnightMove = mostRecentKnightMovement.cloneAndMoveInDirection(considerThisAsNextDirection);
        /*
            8888888888 d8b 888 888                     d8b
            888        Y8P 888 888                     Y8P
            888            888 888
            8888888    888 888 888888  .d88b.  888d888 888 88888b.   .d88b.
            888        888 888 888    d8P  Y8b 888P"   888 888 "88b d88P"88b
            888        888 888 888    88888888 888     888 888  888 888  888
            888        888 888 Y88b.  Y8b.     888     888 888  888 Y88b 888
            888        888 888  "Y888  "Y8888  888     888 888  888  "Y88888
                                                                        888
                                                                    Y8b d88P
                                                                    "Y88P"
        */
        if (knightInTransitMovementHistory.haveIBeenHereBefore(considerThisKnightMove)) {
            info('determineBestHistoryThatWorks(): I have been here before.  Going in circles');
            continue;
        }
        if (!considerThisKnightMove.isCurrentSquareEvenOnTheBoard()) {
            info('determineBestHistoryThatWorks(): I am not even on the board anymore');
            continue;
        }
        if (knightInTransitMovementHistory.isThisSquareSignificantlyWorseThanThePrevious(considerThisKnightMove)) {
            info('determineBestHistoryThatWorks(): Significantly worse positioning');
            continue;
        }
        if (knightInTransitMovementHistory.isThisSquareWorseInBothDirectionsSimultaneously(considerThisKnightMove)) {
            info('determineBestHistoryThatWorks(): Worse in both directions simultaneously');
            continue;
        }
        if (knightInTransitMovementHistory.isDistantAndNotGettingCloserInBothDirectionsSimultaneously(considerThisKnightMove)) {
            info('determineBestHistoryThatWorks(): Distant and not getting closer in both directions');
            continue;
        }
        // if (considerThisKnightMove.amIAdjacentFromDestination()) {
        //   info(`determineBestHistoryThatWorks(): I am ADJACENT to my destination`)
        // }
        // if (considerThisKnightMove.amIWithinOneJumpAsTheCrowFlies()) {
        //   info(`determineBestHistoryThatWorks(): I am within one jump as the crow flies`)
        // }
        info('determineBestHistoryThatWorks(): Still potentially viable after filtering');
        // The quick filters haven't short-circuited this approach yet,
        // so trigger recursion
        var anotherPotentialHistory = knightInTransitMovementHistory.cloneAndAffixSquare(considerThisKnightMove);
        var bestHistoryThatWorks = determineBestHistoryThatWorks(anotherPotentialHistory, numRecursions + 1, undefined);
        if (bestHistoryThatWorks != null) {
            debug('determineBestHistoryThatWorks(): Found a diverging history that works');
            divergingHistoriesThatWork.unshift(bestHistoryThatWorks);
        }
    }
    debug("determineBestHistoryThatWorks(): divergingHistoriesThatWork.length = ".concat(divergingHistoriesThatWork.length));
    var bestHistorySoFar;
    /**
     * Iterate through divergingHistoriesThatWork and see if there are any better ones
     */
    for (var ii = 0; ii < divergingHistoriesThatWork.length; ii++) {
        var currentHistoryUnderTest = (divergingHistoriesThatWork)[ii];
        if (bestHistorySoFar == null) {
            bestHistorySoFar = currentHistoryUnderTest;
        }
        else {
            if (currentHistoryUnderTest.getNumMovesAlready() < bestHistorySoFar.getNumMovesAlready()) {
                bestHistorySoFar = currentHistoryUnderTest;
                debug("determineBestHistoryThatWorks(): Found new bestHistorySoFar = ".concat(JSON.stringify(bestHistorySoFar)));
            }
        }
    }
    debug("determineBestHistoryThatWorks(): Returning ".concat(JSON.stringify(bestHistorySoFar)));
    return bestHistorySoFar;
}
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
    debug("myArgs = ".concat(JSON.stringify(myArgs)));
    var keyValuePairs = new Map();
    for (var ii = 0; ii < myArgs.length; ii++) {
        var key = myArgs[ii];
        ii++;
        var value = myArgs[ii];
        debug("Handling key/value = '".concat(key, "'/'").concat(value, "'"));
        keyValuePairs.set(key, value);
    }
    /* Handle Argv */
    var argKeys = Array.from(keyValuePairs.keys());
    for (var ii = 0; ii < argKeys.length; ii++) {
        var key = argKeys[ii];
        var value = keyValuePairs.get(key);
        debug("Handling key/value = '".concat(key, "'/'").concat(value, "'"));
        if (key === '--board_size') {
            var _a = value.split(','), x = _a[0], y = _a[1];
            debug("Handling board_size = '".concat(value, "'"));
            chessBoard = new ChessBoard(Number(x), Number(y));
        }
        else if (key === '--source') {
            var _b = value.split(','), x = _b[0], y = _b[1];
            knightStartingSquare = new ChessBoardSquare(Number(x), Number(y));
        }
        else if (key === '--dest') {
            var _c = value.split(','), x = _c[0], y = _c[1];
            knightDestinationSquare = new ChessBoardSquare(Number(x), Number(y));
        }
    }
}
function findMinimalKnightMoves() {
    var knightInTransit = KnightInTransit.createWithStartingSquareAndDestinationInMind(chessBoard, knightStartingSquare, knightDestinationSquare);
    var knightInTransitMovementHistory = new KnightInTransitMovementHistory([knightInTransit]);
    // const knightInTransitMovementHistoryClone = knightInTransitMovementHistory.cloneAndAffixSquare(KnightInTransit)
    knightInTransitMovementHistory = determineBestHistoryThatWorks(knightInTransitMovementHistory, 0, undefined);
    if (knightInTransitMovementHistory != null && knightInTransitMovementHistory.getSize() > 0) {
        console.log(">> ".concat(knightInTransitMovementHistory.toString()));
        console.log(">> ".concat(knightInTransitMovementHistory.getNumDifferentSquares()));
    }
    else {
        console.log('-1');
    }
}
findMinimalKnightMoves();
// % npx ts-node knight_moves.ts --board_size 11,11 --dest 11,11 --source 1,1
// % npx ts-node knight_moves.ts --board_size 11,11 --dest 10,10 --source 1,1
// % ./knight_moves --board_size 3,3 --dest 3,3 --source 1,1
// % ./knight_moves --board_size 27,27 --dest 27,27 --source 1,1
// >> (1, 1) -> (3, 2) -> (5, 3) -> (7, 4) -> (9, 5) -> (11, 6) -> (13, 7) -> (15, 8) -> (17, 9) -> (19, 10) -> (21, 11) -> (22, 13) -> (23, 15) -> (24, 17) -> (25, 19) -> (26, 21) -> (27, 23) -> (26, 25) -> (27, 27)
// >> 19
// jeano@MacBook-Pro app %

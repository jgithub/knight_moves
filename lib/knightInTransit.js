"use strict";
exports.__esModule = true;
exports.KnightInTransit = void 0;
var constant_1 = require("./constant");
var KmLogger_1 = require("./log/KmLogger");
var knightUtil_1 = require("./knightUtil");
var inversify_config_1 = require("./inversify.config");
var diTypes_1 = require("./diTypes");
/**
 * Captures the path that a "Knight in Transit" is taking/has taken
 */
var KnightInTransit = /** @class */ (function () {
    function KnightInTransit(desintationSquare) {
        this.LOG = KnightInTransit.LOG;
        this.m_destinationSquare = desintationSquare;
        this.m_pathTaken = [];
    }
    KnightInTransit.prototype.clone = function () {
        var _clone = new KnightInTransit(this.m_destinationSquare);
        // shallow clone the path
        _clone.m_pathTaken = this.m_pathTaken.slice();
        return _clone;
    };
    /**
     * A knight is always somewhere, and this one is on this square
     */
    KnightInTransit.prototype.getCurrentSquare = function () {
        return this.m_pathTaken[0];
    };
    /**
     * Previous square of the knight if any
     */
    KnightInTransit.prototype.getPreviousSquare = function () {
        if (this.m_pathTaken.length > 1) {
            return this.m_pathTaken[1];
        }
        return undefined;
    };
    /**
     * A knight is always somewhere, and this one is right here
     */
    KnightInTransit.prototype.getDestinationSquare = function () {
        return this.m_destinationSquare;
    };
    /**
     * Previous square of the knight if any
     */
    KnightInTransit.prototype.getInitialSquare = function () {
        return this.m_pathTaken[this.m_pathTaken.length - 1];
    };
    /**
     * Has the current chess board square already been visited during the
     * associated knight's journey
     *
     */
    KnightInTransit.prototype.visitedCurrentSquareAlready = function () {
        var currentSquare = this.getCurrentSquare();
        // Start at the previous square
        for (var ii = 1; ii < this.m_pathTaken.length; ii++) {
            var squareUnderTest = this.m_pathTaken[ii];
            if (squareUnderTest.isSameAs(currentSquare)) {
                return true;
            }
        }
        return false;
    };
    /**
     * I think it's true that when a Knight is still far away from it's destination, it should move to make both it's
     * X, Y coordinates closer to the destination.
     *
     * This is not true when a Knight is closer to it's destination.  Sometimes a knight is adjacent to it's destination, but has to move further
     * away before it can reach the target.
     *
     * TODO:  Confirm this
     */
    KnightInTransit.prototype.isDistantAndNotGettingCloserInBothDirections = function () {
        var currentSquare = this.getCurrentSquare();
        var previousSquare = this.getPreviousSquare();
        if (previousSquare != null) {
            var changeX = currentSquare.deltaX(this.getDestinationSquare()) - previousSquare.deltaX(this.getDestinationSquare());
            var changeY = currentSquare.deltaY(this.getDestinationSquare()) - previousSquare.deltaY(this.getDestinationSquare());
            this.LOG.debug("isDistantAndNotGettingCloserInBothDirections(): changeX = ".concat(changeX, ",  changeY = ").concat(changeY));
            /** If we are pretty far away, and we are getting further away still... */
            if ((this.getDestinationSquare().distanceBetween(currentSquare) > constant_1.KNIGHT_JUMP_DISTANCE) && (changeX > 0 || changeY > 0)) {
                this.LOG.debug('isDistantAndNotGettingCloserInBothDirections(): Returning TRUE');
                return true;
            }
        }
        this.LOG.debug('isDistantAndNotGettingCloserInBothDirections(): Returning FALSE');
        return false;
    };
    /**
     * this KnightInTransit is immutable.  So create a cloned KnightInTransit
     * with this specified nextMove applied
     * @param nextMove
     */
    KnightInTransit.prototype.applyNextSquare = function (nextMove) {
        var clone = this.clone();
        clone.m_pathTaken.unshift(nextMove);
        this.LOG.debug("applyNextSquare(): clone = ".concat(clone));
        return clone;
    };
    KnightInTransit.prototype.getNumMoves = function () {
        // The starting position is in the array.  So there is one less
        return this.m_pathTaken.length - 1;
    };
    KnightInTransit.prototype.getNumSquaresInPath = function () {
        // The starting position is in the array.  So there is one less move than there are positions
        return this.m_pathTaken.length;
    };
    KnightInTransit.prototype.toString = function () {
        return this.m_pathTaken.slice().reverse().map(function (square) { return "(".concat(square.getX(), ", ").concat(square.getY(), ")"); }).join(' -> ');
    };
    /**
     * Determine if the Knight has reached it's destination
     */
    KnightInTransit.prototype.amAtDest = function () {
        var retval = this.getCurrentSquare().isSameAs(this.getDestinationSquare());
        this.LOG.debug("amAtDest(): Returning ".concat(retval));
        return retval;
    };
    /**
     * Recursively find a best path that works from this subtree
     * @returns undefined if there are no next moves that can be made with this subtree or if
     *          the bestPathSoFar is better than anything we can generate in this subtree
     */
    KnightInTransit.prototype.findBestPath = function (bestPathSoFar) {
        if (bestPathSoFar != null && bestPathSoFar.getNumSquaresInPath() < this.getNumSquaresInPath()) {
            this.LOG.debug('findBestPath(): bestPathSoFar is better than this path.   We can\'t beat it.  Return undefined');
            return undefined;
        }
        /**
         * With the path in it's current state, have I arrived?  If so, there's nothing left to do
         * and return the cufrent path
         */
        if (this.amAtDest()) {
            this.LOG.debug('findBestPath(): Knight reached destination.  This path works.  Returning it');
            return this;
        }
        // const subtreesToConsider: Array<KnightInTransit | undefined> = []
        // let bestPathSoFarFromAllSubtrees: KnightInTransit | undefined
        var nextDirectionGuesserFactory = inversify_config_1["default"].get(diTypes_1["default"].NextDirectionGuesserFactory);
        var nextDirectionGuesser = nextDirectionGuesserFactory.build();
        /**
         * Consider all the directions a knight might move.  Make use of the
         * NextDirectionGuesser interface to determine the next "guess"
         */
        while (nextDirectionGuesser.hasMoreGuesses(this)) {
            var guessedNextDirection = nextDirectionGuesser.nextDirection(this);
            var guessedNextSquare = (0, knightUtil_1.applyKnightMovementFrom)(this.getCurrentSquare(), guessedNextDirection);
            this.LOG.debug("findBestPath(): guessedNextSquare = ".concat(guessedNextSquare));
            var knightMoveBeingConsidered = this.applyNextSquare(guessedNextSquare);
            /**
             * Filter out/Disregard as many bogus moves as possible, as fast as possible
             */
            if (knightMoveBeingConsidered.visitedCurrentSquareAlready()) {
                this.LOG.info('findBestPath(): [SHORT-CIRCUIT] I have been here before.  Going in circles');
                continue;
            }
            if (!knightMoveBeingConsidered.getCurrentSquare().isOnBoard()) {
                this.LOG.info('findBestPath(): [SHORT-CIRCUIT] I am not even on the board anymore');
                continue;
            }
            if (knightMoveBeingConsidered.isDistantAndNotGettingCloserInBothDirections()) {
                this.LOG.info('findBestPath(): [SHORT-CIRCUIT] Distant and not getting closer in both directions');
                continue;
            }
            this.LOG.info('findBestPath(): Still potentially viable after filtering');
            /*
             * The quick filters haven't short-circuited this approach yet,
             * so trigger recursion
             */
            /*
             * TODO: Consider a breadth-first approach vs a depth-first approach.
             */
            var bestPathFromSubtree = knightMoveBeingConsidered.findBestPath(bestPathSoFar);
            if (bestPathFromSubtree != null) {
                if (bestPathSoFar == null) {
                    this.LOG.debug("findBestPath(): bestPathSoFar is null.  So using bestPathSoFar = bestPathFromSubtree = ".concat(bestPathFromSubtree));
                    bestPathSoFar = bestPathFromSubtree;
                }
                else {
                    if (bestPathFromSubtree.getNumSquaresInPath() < bestPathSoFar.getNumSquaresInPath()) {
                        this.LOG.debug("findBestPath(): Found faster/better subtree.  bestPathFromSubtree = ".concat(bestPathFromSubtree));
                        bestPathSoFar = bestPathFromSubtree;
                    }
                }
            }
        }
        this.LOG.debug("findBestPath(): Returning ".concat(bestPathSoFar));
        return bestPathSoFar;
    };
    KnightInTransit.LOG = KmLogger_1.KmLogger.getLogger('KnightInTransit');
    return KnightInTransit;
}());
exports.KnightInTransit = KnightInTransit;

"use strict";
exports.__esModule = true;
exports.NextDirectionGuesserBruteForceImpl = void 0;
var KnightMoveDirection_1 = require("./KnightMoveDirection");
var KmLogger_1 = require("./log/KmLogger");
// TODO:  Determine existing best practices for naming implementations vs interfaces?
/*
 * An iteratable list of all possible directions
 */
var allKnightDirections = Object.freeze([
    KnightMoveDirection_1.KnightMoveDirection.northNorthEast,
    KnightMoveDirection_1.KnightMoveDirection.eastNorthEast,
    KnightMoveDirection_1.KnightMoveDirection.eastSouthEast,
    KnightMoveDirection_1.KnightMoveDirection.southSouthEast,
    KnightMoveDirection_1.KnightMoveDirection.southSouthWest,
    KnightMoveDirection_1.KnightMoveDirection.westSouthWest,
    KnightMoveDirection_1.KnightMoveDirection.westNorthWest,
    KnightMoveDirection_1.KnightMoveDirection.northNorthWest
    // TODO: Prob cleaner way to do this
]);
/**
 * This is the brute force approach to guessing the next Knight move jump
 * direction.   This implementation iterates through all possible directions.
 *
 * It's slow, but it should be able to generate the Gold Result Set given
 * enough CPU and time
 *
 * This implementation of NextDirectionGuesser does not make use of the
 * "immutableInightInTransit" but my hypothesis is we can make other implementations
 * of this interface faster by knowing the state of the knight's journey
 */
var NextDirectionGuesserBruteForceImpl = /** @class */ (function () {
    function NextDirectionGuesserBruteForceImpl() {
        this.LOG = NextDirectionGuesserBruteForceImpl.LOG;
    }
    NextDirectionGuesserBruteForceImpl.prototype.hasMoreGuesses = function (immutableInightInTransit) {
        var nextDirectionIndex = this.m_previousDirectionIndex == null ? 0 : this.m_previousDirectionIndex + 1;
        if (nextDirectionIndex >= allKnightDirections.length) {
            this.LOG.info('hasMoreGuesses(): Returning FALSE.  No directions left to "guess"');
            return false;
        }
        this.LOG.trace('hasMoreGuesses(): Returning TRUE.');
        return true;
    };
    NextDirectionGuesserBruteForceImpl.prototype.nextDirection = function (immutableInightInTransit) {
        if (!this.hasMoreGuesses(immutableInightInTransit)) {
            this.LOG.info('nextDirection(): Returning <undefined>.  No directions left to "guess"');
            return undefined;
        }
        var nextDirectionIndex = this.m_previousDirectionIndex == null ? 0 : this.m_previousDirectionIndex + 1;
        // Consider this guess to be used.  Now move the state forward
        this.m_previousDirectionIndex = nextDirectionIndex;
        var retval = allKnightDirections[nextDirectionIndex];
        this.LOG.debug("nextDirection(): Returning ".concat(retval));
        return retval;
    };
    NextDirectionGuesserBruteForceImpl.LOG = KmLogger_1.KmLogger.getLogger('NextDirectionGuesserBruteForceImpl');
    return NextDirectionGuesserBruteForceImpl;
}());
exports.NextDirectionGuesserBruteForceImpl = NextDirectionGuesserBruteForceImpl;

"use strict";
exports.__esModule = true;
exports.NextDirectionGuesserSlopeOfVectorImpl = void 0;
var KmLogger_1 = require("./log/KmLogger");
// TODO:  Determine existing best practices for naming implementations vs interfaces?
/**
 * TODO: Code up this implementation of the NextDirectionGuesser interface
 *
 * My hypothesis is that using the slope of the vector from the Knight's current
 * location towards the destination can be used to determine the next hop direction
 * (when not close).
 *
 * I haven't had time to code this up yet.   The Brute Force implementation
 * should be used to generate the gold result sets.  I suspect this implementation
 * will be much more performant.
 */
var NextDirectionGuesserSlopeOfVectorImpl = /** @class */ (function () {
    function NextDirectionGuesserSlopeOfVectorImpl() {
        this.LOG = NextDirectionGuesserSlopeOfVectorImpl.LOG;
    }
    NextDirectionGuesserSlopeOfVectorImpl.prototype.hasMoreGuesses = function (immutableInightInTransit) {
        throw new Error('Not Implemented Yet');
    };
    NextDirectionGuesserSlopeOfVectorImpl.prototype.nextDirection = function (immutableInightInTransit) {
        throw new Error('Not Implemented Yet');
    };
    NextDirectionGuesserSlopeOfVectorImpl.LOG = KmLogger_1.KmLogger.getLogger('NextDirectionGuesserSlopeOfVectorImpl');
    return NextDirectionGuesserSlopeOfVectorImpl;
}());
exports.NextDirectionGuesserSlopeOfVectorImpl = NextDirectionGuesserSlopeOfVectorImpl;

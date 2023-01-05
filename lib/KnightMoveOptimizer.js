"use strict";
exports.__esModule = true;
exports.KnightMoveOptimizer = void 0;
var knightInTransit_1 = require("./knightInTransit");
/**
 * Determines a knight movement path that minimzes the hops to reach the specified destination
 */
var KnightMoveOptimizer = /** @class */ (function () {
    function KnightMoveOptimizer() {
    }
    /**
     * Determines a knight movement path that minimzes/optimizes the hops to reach the specified destination
     *
     * @param knightStartingSquare
     * @param knightDestinationSquare
     * @returns an optimal path, or undefined if one can't be determined
     */
    KnightMoveOptimizer.prototype.optimize = function (knightStartingSquare, knightDestinationSquare) {
        // Apply the knights starting location to an empty KnightInTransit record
        var knightInTransit = new knightInTransit_1.KnightInTransit(knightDestinationSquare).applyNextSquare(knightStartingSquare);
        return knightInTransit.findBestPath(undefined /* best path so far is undefined */);
    };
    return KnightMoveOptimizer;
}());
exports.KnightMoveOptimizer = KnightMoveOptimizer;

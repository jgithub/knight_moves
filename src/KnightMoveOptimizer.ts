import { ChessBoardSquare } from './ChessBoardSquare'
import { KnightInTransit } from './knightInTransit'

/**
 * Determines a knight movement path that minimzes the hops to reach the specified destination
 */

export class KnightMoveOptimizer {
  /**
   * Determines a knight movement path that minimzes/optimizes the hops to reach the specified destination
   *
   * @param knightStartingSquare
   * @param knightDestinationSquare
   * @returns an optimal path, or undefined if one can't be determined
   */

  public optimize (knightStartingSquare: ChessBoardSquare, knightDestinationSquare: ChessBoardSquare): KnightInTransit | undefined {
    // Apply the knights starting location to an empty KnightInTransit record
    const knightInTransit = new KnightInTransit(knightDestinationSquare).applyNextSquare(knightStartingSquare)
    return knightInTransit.findBestPath(undefined /* best path so far is undefined */)
  }
}

import { KnightMoveDirection } from './KnightMoveDirection'
import { KnightInTransit } from './KnightInTransit'

/**
 * Interface contract for an object that can generate a "next guess" for the
 * direction that a Knight should move next
 *
 * The current working impl of this is NextDirectionGuesserBruteForceImpl which
 * is slow and uses a less-than-ideal amount of RAM
 *
 * My hypthothesis is that other implementations won't need to Guess the next direction
 * at all... they can determine it.   I'm interested in benchmark comparisons
 * between NextDirectionGuesserBruteForceImpl, NextDirectionGuesserSlopeOfVectorImpl
 * and others
 */

export interface NextDirectionGuesser {
  hasMoreGuesses: (immutableInightInTransit: KnightInTransit) => boolean

  /**
   * Return the next Direction to attempt for the associated KnightInTransit record
   *
   * @param immutableInightInTransit
   */
  nextDirection: (immutableInightInTransit: KnightInTransit) => KnightMoveDirection | undefined
}

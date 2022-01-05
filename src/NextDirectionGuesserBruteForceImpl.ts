import { KnightMoveDirection } from './KnightMoveDirection'
import { NextDirectionGuesser } from './NextDirectionGuesser'
import { KnightInTransit } from './KnightInTransit'
import { KmLogger } from './log/KmLogger'

// TODO:  Determine existing best practices for naming implementations vs interfaces?

/*
 * An iteratable list of all possible directions
 */
const allKnightDirections: KnightMoveDirection[] = Object.freeze([
  KnightMoveDirection.northNorthEast,
  KnightMoveDirection.eastNorthEast,
  KnightMoveDirection.eastSouthEast,
  KnightMoveDirection.southSouthEast,
  KnightMoveDirection.southSouthWest,
  KnightMoveDirection.westSouthWest,
  KnightMoveDirection.westNorthWest,
  KnightMoveDirection.northNorthWest
  // TODO: Prob cleaner way to do this
]) as KnightMoveDirection[]

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

export class NextDirectionGuesserBruteForceImpl implements NextDirectionGuesser {
  private static readonly LOG: KmLogger = KmLogger.getLogger('NextDirectionGuesserBruteForceImpl')
  private readonly LOG: KmLogger = NextDirectionGuesserBruteForceImpl.LOG

  private m_previousDirectionIndex: number

  public hasMoreGuesses (immutableInightInTransit: KnightInTransit): boolean {
    const nextDirectionIndex: number = this.m_previousDirectionIndex == null ? 0 : this.m_previousDirectionIndex + 1

    if (nextDirectionIndex >= allKnightDirections.length) {
      this.LOG.info('hasMoreGuesses(): Returning FALSE.  No directions left to "guess"')
      return false
    }

    this.LOG.trace('hasMoreGuesses(): Returning TRUE.')
    return true
  }

  public nextDirection (immutableInightInTransit: KnightInTransit): KnightMoveDirection | undefined {
    if (!this.hasMoreGuesses(immutableInightInTransit)) {
      this.LOG.info('nextDirection(): Returning <undefined>.  No directions left to "guess"')
      return undefined
    }

    const nextDirectionIndex: number = this.m_previousDirectionIndex == null ? 0 : this.m_previousDirectionIndex + 1
    // Consider this guess to be used.  Now move the state forward
    this.m_previousDirectionIndex = nextDirectionIndex

    const retval = allKnightDirections[nextDirectionIndex]
    this.LOG.debug(`nextDirection(): Returning ${retval}`)
    return retval
  }
}

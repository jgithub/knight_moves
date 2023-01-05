import { KnightMoveDirection } from './KnightMoveDirection'
import { NextDirectionGuesser } from './NextDirectionGuesser'
import { KnightInTransit } from './KnightInTransit'
import { KmLogger } from './log/KmLogger'

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

export class NextDirectionGuesserSlopeOfVectorImpl implements NextDirectionGuesser {
  private static readonly LOG: KmLogger = KmLogger.getLogger('NextDirectionGuesserSlopeOfVectorImpl')
  private readonly LOG: KmLogger = NextDirectionGuesserSlopeOfVectorImpl.LOG

  private readonly m_previousDirectionIndex: number

  public hasMoreGuesses (immutableInightInTransit: KnightInTransit): boolean {
    throw new Error('Not Implemented Yet')
  }

  public nextDirection (immutableInightInTransit: KnightInTransit): KnightMoveDirection | undefined {
    throw new Error('Not Implemented Yet')
  }
}

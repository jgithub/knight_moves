import { ChessBoardSquare } from './ChessBoardSquare'
import { KNIGHT_JUMP_DISTANCE } from './constant'
import { KnightMoveDirection } from './KnightMoveDirection'
import { KmLogger } from './log/KmLogger'
import { applyKnightMovementFrom } from './knightUtil'
import { NextDirectionGuesser } from './NextDirectionGuesser'
import container from './inversify.config'
import { NextDirectionGuesserFactory } from './NextDirectionGuesserFactory'
import DI_TYPES from './diTypes'

/**
 * Captures the path that a "Knight in Transit" is taking/has taken
 */

export class KnightInTransit {
  private static readonly LOG: KmLogger = KmLogger.getLogger('KnightInTransit')
  private readonly LOG: KmLogger = KnightInTransit.LOG

  // Most recent location is at the front of the list
  private /* readonly */ m_pathTaken: ChessBoardSquare[]
  private readonly m_destinationSquare: ChessBoardSquare

  constructor (desintationSquare: ChessBoardSquare) {
    this.m_destinationSquare = desintationSquare
    this.m_pathTaken = []
  }

  public clone (): KnightInTransit {
    const _clone = new KnightInTransit(this.m_destinationSquare)
    // shallow clone the path
    _clone.m_pathTaken = this.m_pathTaken.slice()
    return _clone
  }

  /**
   * A knight is always somewhere, and this one is on this square
   */
  public getCurrentSquare (): ChessBoardSquare {
    return this.m_pathTaken[0]
  }

  /**
   * Previous square of the knight if any
   */
  public getPreviousSquare (): ChessBoardSquare | undefined {
    if (this.m_pathTaken.length > 1) {
      return this.m_pathTaken[1]
    }
    return undefined
  }

  /**
   * A knight is always somewhere, and this one is right here
   */
  public getDestinationSquare (): ChessBoardSquare {
    return this.m_destinationSquare
  }

  /**
   * Previous square of the knight if any
   */
  public getInitialSquare (): ChessBoardSquare {
    return this.m_pathTaken[this.m_pathTaken.length - 1]
  }

  /**
   * Has the current chess board square already been visited during the
   * associated knight's journey
   *
   */

  public visitedCurrentSquareAlready (): boolean {
    const currentSquare: ChessBoardSquare = this.getCurrentSquare()

    // Start at the previous square
    for (let ii = 1; ii < this.m_pathTaken.length; ii++) {
      const squareUnderTest: ChessBoardSquare = this.m_pathTaken[ii]
      if (squareUnderTest.isSameAs(currentSquare)) {
        return true
      }
    }

    return false
  }

  /**
   * I think it's true that when a Knight is still far away from it's destination, it should move to make both it's
   * X, Y coordinates closer to the destination.
   *
   * This is not true when a Knight is closer to it's destination.  Sometimes a knight is adjacent to it's destination, but has to move further
   * away before it can reach the target.
   *
   * TODO:  Confirm this
   */

  public isDistantAndNotGettingCloserInBothDirections (): boolean {
    const currentSquare: ChessBoardSquare = this.getCurrentSquare()
    const previousSquare: ChessBoardSquare | undefined = this.getPreviousSquare()

    if (previousSquare != null) {
      const changeX = currentSquare.deltaX(this.getDestinationSquare()) - previousSquare.deltaX(this.getDestinationSquare())
      const changeY = currentSquare.deltaY(this.getDestinationSquare()) - previousSquare.deltaY(this.getDestinationSquare())

      this.LOG.debug(`isDistantAndNotGettingCloserInBothDirections(): changeX = ${changeX},  changeY = ${changeY}`)

      /** If we are pretty far away, and we are getting further away still... */
      if ((this.getDestinationSquare().distanceBetween(currentSquare) > KNIGHT_JUMP_DISTANCE) && (changeX > 0 || changeY > 0)) {
        this.LOG.debug('isDistantAndNotGettingCloserInBothDirections(): Returning TRUE')
        return true
      }
    }

    this.LOG.debug('isDistantAndNotGettingCloserInBothDirections(): Returning FALSE')
    return false
  }

  /**
   * this KnightInTransit is immutable.  So create a cloned KnightInTransit
   * with this specified nextMove applied
   * @param nextMove
   */

  public applyNextSquare (nextMove: ChessBoardSquare): KnightInTransit {
    const clone: KnightInTransit = this.clone()
    clone.m_pathTaken.unshift(nextMove)
    this.LOG.debug(`applyNextSquare(): clone = ${clone}`)
    return clone
  }

  public getNumMoves (): number {
    // The starting position is in the array.  So there is one less
    return this.m_pathTaken.length - 1
  }

  public getNumSquaresInPath (): number {
    // The starting position is in the array.  So there is one less move than there are positions
    return this.m_pathTaken.length
  }

  public toString (): string {
    return this.m_pathTaken.slice().reverse().map((square) => `(${square.getX()}, ${square.getY()})`).join(' -> ')
  }

  /**
   * Determine if the Knight has reached it's destination
   */
  public amAtDest (): boolean {
    const retval = this.getCurrentSquare().isSameAs(this.getDestinationSquare())
    this.LOG.debug(`amAtDest(): Returning ${retval}`)
    return retval
  }

  /**
   * Recursively find a best path that works from this subtree
   * @returns undefined if there are no next moves that can be made with this subtree or if
   *          the bestPathSoFar is better than anything we can generate in this subtree
   */

  public findBestPath (bestPathSoFar: KnightInTransit | undefined): KnightInTransit | undefined {
    if (bestPathSoFar != null && bestPathSoFar.getNumSquaresInPath() < this.getNumSquaresInPath()) {
      this.LOG.debug('findBestPath(): bestPathSoFar is better than this path.   We can\'t beat it.  Return undefined')
      return undefined
    }

    /**
     * With the path in it's current state, have I arrived?  If so, there's nothing left to do
     * and return the cufrent path
     */
    if (this.amAtDest()) {
      this.LOG.debug('findBestPath(): Knight reached destination.  This path works.  Returning it')
      return this
    }

    // const subtreesToConsider: Array<KnightInTransit | undefined> = []
    // let bestPathSoFarFromAllSubtrees: KnightInTransit | undefined

    const nextDirectionGuesserFactory: NextDirectionGuesserFactory = container.get<NextDirectionGuesserFactory>(DI_TYPES.NextDirectionGuesserFactory)
    const nextDirectionGuesser: NextDirectionGuesser = nextDirectionGuesserFactory.build()

    /**
     * Consider all the directions a knight might move.  Make use of the
     * NextDirectionGuesser interface to determine the next "guess"
     */
    while (nextDirectionGuesser.hasMoreGuesses(this)) {
      const guessedNextDirection: KnightMoveDirection = nextDirectionGuesser.nextDirection(this)
      const guessedNextSquare: ChessBoardSquare = applyKnightMovementFrom(this.getCurrentSquare(), guessedNextDirection)
      this.LOG.debug(`findBestPath(): guessedNextSquare = ${guessedNextSquare}`)
      const knightMoveBeingConsidered: KnightInTransit = this.applyNextSquare(guessedNextSquare)

      /**
       * Filter out/Disregard as many bogus moves as possible, as fast as possible
       */

      if (knightMoveBeingConsidered.visitedCurrentSquareAlready()) {
        this.LOG.info('findBestPath(): [SHORT-CIRCUIT] I have been here before.  Going in circles')
        continue
      }

      if (!knightMoveBeingConsidered.getCurrentSquare().isOnBoard()) {
        this.LOG.info('findBestPath(): [SHORT-CIRCUIT] I am not even on the board anymore')
        continue
      }

      if (knightMoveBeingConsidered.isDistantAndNotGettingCloserInBothDirections()) {
        this.LOG.info('findBestPath(): [SHORT-CIRCUIT] Distant and not getting closer in both directions')
        continue
      }

      this.LOG.info('findBestPath(): Still potentially viable after filtering')

      /*
       * The quick filters haven't short-circuited this approach yet,
       * so trigger recursion
       */

      /*
       * TODO: Consider a breadth-first approach vs a depth-first approach.
       */

      const bestPathFromSubtree = knightMoveBeingConsidered.findBestPath(bestPathSoFar)

      if (bestPathFromSubtree != null) {
        if (bestPathSoFar == null) {
          this.LOG.debug(`findBestPath(): bestPathSoFar is null.  So using bestPathSoFar = bestPathFromSubtree = ${bestPathFromSubtree}`)
          bestPathSoFar = bestPathFromSubtree
        } else {
          if (bestPathFromSubtree.getNumSquaresInPath() < bestPathSoFar.getNumSquaresInPath()) {
            this.LOG.debug(`findBestPath(): Found faster/better subtree.  bestPathFromSubtree = ${bestPathFromSubtree}`)
            bestPathSoFar = bestPathFromSubtree
          }
        }
      }
    }

    this.LOG.debug(`findBestPath(): Returning ${bestPathSoFar}`)
    return bestPathSoFar
  }
}

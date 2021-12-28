/**
 *
 * Sometimes a knight is adjacent to it's destination, but has to move further
 * away before it can hit the target.
 *
 * TODOs:
 * - Create correctness test suites/gold results
 * - Benchmarking
 * - break this into multiple files
 * - unit testing
 * - I'm not yet confident in the filtering correctness or performance.  More testing is needed here.
 * - More concise naming in a few places
 * - Infinite board will take a lot of CPU.  But target the implementation to be memory efficient.  RAM usage CANNOT scale with board size
 *     - I've already taken some steps towards this, but I haven't done any profile testing or really large board tests yet
 * - There are also a bunch of TODOs littered around in the code.
 */

/*
 * Every knight movement looks like an 'L'.   There's a long side and a short side
 */
// TODO: Naming
const LONG_SIDE = 2
const SHORT_SIDE = 1

/*
 * This is how far a knight travels when it moves
 */
const KNIGHT_JUMP_DISTANCE = Math.sqrt(5)

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

// TODO: replace with log4js and named loggers
function trace (msg: any, ...args: any[]): void {
  // Uncomment these lines to include logging
  // if ( args.length > 0 ) {
  //   console.log(msg, args)
  // } else {
  //   console.log(msg)
  // }
}

export function debug (msg: any, ...args: any[]): void {
  // if ( args.length > 0 ) {
  //   console.log(msg, args)
  // } else {
  //   console.log(msg)
  // }
}

function info (msg: any, ...args: any[]): void {
  // if ( args.length > 0 ) {
  //   console.info(msg, args)
  // } else {
  //   console.info(msg)
  // }
}

function warn (msg: any, ...args: any[]): void {
  // if ( args.length > 0 ) {
  //   console.warn(msg, args)
  // } else {
  //   console.warn(msg)
  // }
}

/*
 * These are all the possible directions a Knight can move
 */
enum KnightMoveDirection {
  northNorthEast = 'northNorthEast',
  eastNorthEast = 'eastNorthEast',
  eastSouthEast = 'eastSouthEast',
  southSouthEast = 'southSouthEast',
  southSouthWest = 'southSouthWest',
  westSouthWest = 'westSouthWest',
  westNorthWest = 'westNorthWest',
  northNorthWest = 'northNorthWest',
}

/*
 * An iteratable list of all possible directions
 */
const iterateAllDirections: KnightMoveDirection[] = Object.freeze([
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
 * This represents a single square on a chess board
 * 1,1 is the lower left-hand corner of the board
 */
export class ChessBoardSquare {
  private readonly m_x: number
  private readonly m_y: number

  constructor (x: number, y: number) {
    this.m_x = x
    this.m_y = y
  }

  /**
   * Return the square's X-position
   */
  public getX (): number {
    return this.m_x
  }

  /**
   * Return the square's Y-position
   */
  public getY (): number {
    return this.m_y
  }

  /**
   * Calculate the distance between this square and another
   */
  public distanceBetween (anotherSquare: ChessBoardSquare): number {
    const xDiff = anotherSquare.getX() - this.m_x
    const yDiff = anotherSquare.getY() - this.m_y
    const c: number = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2))
    debug(`distanceBetween(): Returning ${c},   based on xDiff = ${xDiff}, yDiff = ${yDiff}, c = ${c}`)
    return c
  }

  /**
   * Is this square in the same location as another?
   */
  public isSameAs (anotherSquare: ChessBoardSquare): boolean {
    const retval = this.distanceBetween(anotherSquare) === 0
    debug(`isSameAs(): Returning ${retval}`)
    return retval
  }
}

/**
 * Represents a ChessBoard object... specifically the dimensions
 */

export class ChessBoard {
  private readonly m_numCols: number
  private readonly m_numRows: number

  constructor (numCols: number, numRows: number) {
    this.m_numCols = numCols
    this.m_numRows = numRows
    debug(`constructor(): Creating chess board ${numCols}x${numRows}...`)
  }

  // corresponds to X
  public getNumCols (): number {
    return this.m_numCols
  }

  // corresponds to Y
  public getNumRows (): number {
    return this.m_numRows
  }
}

export class KnightInTransit {
  private readonly m_currentSquare: ChessBoardSquare
  private readonly m_destinationSquare: ChessBoardSquare

  // Reference back to the chess board this knight is moving within
  private readonly m_chessBoardRef: ChessBoard

  private constructor (chessBoard: ChessBoard, currentSquare: ChessBoardSquare, destinationSquare: ChessBoardSquare) {
    this.m_currentSquare = currentSquare
    this.m_destinationSquare = destinationSquare
    this.m_chessBoardRef = chessBoard
  }

  // TODO: More concise naming
  public static createKnightWithStartingSquareAndDestinationInMind (board: ChessBoard, startingSquare: ChessBoardSquare, destinationSquare: ChessBoardSquare): KnightInTransit {
    return new KnightInTransit(board, startingSquare, destinationSquare)
  }

  public calculateDistanceFromDestination (): number {
    return this.m_destinationSquare.distanceBetween(this.m_currentSquare)
  }

  public calculateDeltaXFromDestination (): number {
    return Math.abs(this.m_destinationSquare.getX() - this.m_currentSquare.getX())
  }

  public calculateDeltaYFromDestination (): number {
    return Math.abs(this.m_destinationSquare.getY() - this.m_currentSquare.getY())
  }

  // Retain for debugging
  // public amIWithinOneJumpAsTheCrowFlies(): boolean {
  //   return this.m_destinationSquare.distanceBetween(this.m_currentSquare) < KNIGHT_JUMP_DISTANCE
  // }

  // public amIAdjacentFromDestination(): boolean {
  //   return this.m_destinationSquare.distanceBetween(this.m_currentSquare) < Math.sqrt(2)
  // }

  public isCurrentSquareEvenOnTheBoard (): boolean {
    if (this.m_currentSquare.getX() > this.m_chessBoardRef.getNumCols()) {
      debug(`isCurrentSquareEvenOnTheBoard(): Returning FALSE  this.m_currentSquare = ${JSON.stringify(this.m_currentSquare)}`)
      return false
    }
    if (this.m_currentSquare.getY() > this.m_chessBoardRef.getNumRows()) {
      debug(`isCurrentSquareEvenOnTheBoard(): Returning FALSE  this.m_currentSquare = ${JSON.stringify(this.m_currentSquare)}`)
      return false
    }

    if (this.m_currentSquare.getX() < 1) {
      debug('isCurrentSquareEvenOnTheBoard(): X-pos cannot be less than 1')
      return false
    }

    if (this.m_currentSquare.getY() < 1) {
      debug('isCurrentSquareEvenOnTheBoard(): Y-pos cannot be less than 1')
      return false
    }

    debug(`isCurrentSquareEvenOnTheBoard(): Returning TRUE.  this.m_currentSquare = ${JSON.stringify(this.m_currentSquare)}`)
    return true
  }

  /**
   * Determine if the Knight has reached it's destination
   */
  public amIAtMyDestination (): boolean {
    const retval = this.m_currentSquare.isSameAs(this.m_destinationSquare)
    debug(`amIAtMyDestination(): Returning ${retval}`)
    return retval
  }

  /**
   * Instantiate and return a cloned KnightInTransit, having been moved in the specified direction
   */

  public cloneAndMoveInDirection (direction: KnightMoveDirection): KnightInTransit {
    const newSquare: ChessBoardSquare = (() => {
      debug(`cloneAndMoveInDirection(): Jumping '${direction}' from currentSquare = ${JSON.stringify(this.m_currentSquare)}`)
      switch (direction) {
        case KnightMoveDirection.northNorthEast: {
          return new ChessBoardSquare(this.m_currentSquare.getX() + SHORT_SIDE, this.m_currentSquare.getY() + LONG_SIDE)
        } case KnightMoveDirection.eastNorthEast: {
          return new ChessBoardSquare(this.m_currentSquare.getX() + LONG_SIDE, this.m_currentSquare.getY() + SHORT_SIDE)
        } case KnightMoveDirection.eastSouthEast: {
          return new ChessBoardSquare(this.m_currentSquare.getX() + LONG_SIDE, this.m_currentSquare.getY() - SHORT_SIDE)
        } case KnightMoveDirection.southSouthEast: {
          return new ChessBoardSquare(this.m_currentSquare.getX() + SHORT_SIDE, this.m_currentSquare.getY() - LONG_SIDE)
        } case KnightMoveDirection.southSouthWest: {
          return new ChessBoardSquare(this.m_currentSquare.getX() - SHORT_SIDE, this.m_currentSquare.getY() - LONG_SIDE)
        } case KnightMoveDirection.westSouthWest: {
          return new ChessBoardSquare(this.m_currentSquare.getX() - LONG_SIDE, this.m_currentSquare.getY() - SHORT_SIDE)
        } case KnightMoveDirection.westNorthWest: {
          return new ChessBoardSquare(this.m_currentSquare.getX() - LONG_SIDE, this.m_currentSquare.getY() + SHORT_SIDE)
        } case KnightMoveDirection.northNorthWest: {
          return new ChessBoardSquare(this.m_currentSquare.getX() - SHORT_SIDE, this.m_currentSquare.getY() + LONG_SIDE)
        }
      }
    })()
    debug(`cloneAndMoveInDirection(): newSquare = ${JSON.stringify(newSquare)}`)
    return new KnightInTransit(this.m_chessBoardRef, newSquare, this.m_destinationSquare)
  }

  public getCurrentSquare (): ChessBoardSquare {
    return this.m_currentSquare
  }
}

export class KnightInTransitMovementHistory {
  private readonly m_history: KnightInTransit[]

  constructor (existingHistory: KnightInTransit[] | undefined) {
    if (existingHistory != null) {
      this.m_history = existingHistory.slice()
    } else {
      this.m_history = []
    }
  }

  public getSize (): number {
    return this.m_history.length
  }

  public getHistory (): KnightInTransit[] {
    return this.m_history
  }

  public haveIBeenHereBefore (knightInTransit: KnightInTransit): boolean {
    for (let ii = 0; ii < this.m_history.length; ii++) {
      const knightPostionUnderTest: ChessBoardSquare = this.m_history[ii].getCurrentSquare()
      if (knightPostionUnderTest.isSameAs(knightInTransit.getCurrentSquare())) {
        return true
      }
    }

    return false
  }

  /**
   * I think it's true that when a Knight is still far away from it's destination, it should always be jumping closer to it's desgination
   *
   * This is not true when a Knight is closer to it's destination.  Sometimes a knight is adjacent to it's destination, but has to move further
   * away before it can reach the target.
   *
   * TODO:  Confirm this
   */

  public isThisSquareSignificantlyWorseThanThePrevious (knightInTransit: KnightInTransit): boolean {
    const deltaFromPreviousLocation = knightInTransit.calculateDistanceFromDestination() - this.m_history[0].calculateDistanceFromDestination()
    debug(`isThisSquareSignificantlyWorseThanThePrevious(): deltaFromPreviousLocation = ${deltaFromPreviousLocation}`)

    /** If we are pretty far away, and we are getting further away still... */
    if ((knightInTransit.calculateDistanceFromDestination() > KNIGHT_JUMP_DISTANCE) && deltaFromPreviousLocation > 0) {
      debug('isThisSquareSignificantlyWorseThanThePrevious(): Returning TRUE')
      return true
    }

    debug('isThisSquareSignificantlyWorseThanThePrevious(): Returning FALSE')
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

  public isDistantAndNotGettingCloserInBothDirectionsSimultaneously (knightInTransit: KnightInTransit): boolean {
    const deltaFromLastLocationX = knightInTransit.calculateDeltaXFromDestination() - this.m_history[0].calculateDeltaXFromDestination()
    const deltaFromLastLocationY = knightInTransit.calculateDeltaYFromDestination() - this.m_history[0].calculateDeltaYFromDestination()

    debug(`isDistantAndNotGettingCloserInBothDirectionsSimultaneously(): deltaFromLastLocationX = ${deltaFromLastLocationX},  deltaFromLastLocationY = ${deltaFromLastLocationY}`)

    /** If we are pretty far away, and we are getting further away still... */
    if ((knightInTransit.calculateDistanceFromDestination() > KNIGHT_JUMP_DISTANCE) && (deltaFromLastLocationX > 0 || deltaFromLastLocationY > 0)) {
      debug('isDistantAndNotGettingCloserInBothDirectionsSimultaneously(): Returning TRUE')
      return true
    }

    debug('isDistantAndNotGettingCloserInBothDirectionsSimultaneously(): Returning FALSE')
    return false
  }

  /**
   * I think it's true that in order to calculate the most efficient movement path, every Knight move
   * should be making at least one of the X,Y coordinates no-worse in relation to the destination
   *
   * TODO:  Confirm this
   */

  public isThisSquareWorseInBothDirectionsSimultaneously (knightInTransit: KnightInTransit): boolean {
    const deltaFromLastLocationX = knightInTransit.calculateDeltaXFromDestination() - this.m_history[0].calculateDeltaXFromDestination()
    const deltaFromLastLocationY = knightInTransit.calculateDeltaYFromDestination() - this.m_history[0].calculateDeltaYFromDestination()

    debug(`isThisSquareWorseInBothDirectionsSimultaneously(): deltaFromLastLocationX = ${deltaFromLastLocationX},  deltaFromLastLocationY = ${deltaFromLastLocationY}`)

    /** If we are pretty far away, and we are getting further away still... */
    if (deltaFromLastLocationX > 0 && deltaFromLastLocationY > 0) {
      debug('isThisSquareWorseInBothDirectionsSimultaneously(): Returning TRUE')
      return true
    }

    debug('isThisSquareWorseInBothDirectionsSimultaneously(): Returning FALSE')
    return false
  }

  public cloneAndAffixSquare (knightInTransit: KnightInTransit): KnightInTransitMovementHistory {
    const clone = new KnightInTransitMovementHistory(this.m_history)
    clone.m_history.unshift(knightInTransit)
    return clone
  }

  public getNumMovesAlready (): number {
    // The starting position is in the array.  So there is one less
    return this.m_history.length - 1
  }

  public getNumDifferentSquares (): number {
    // The starting position is in the array.  So there is one less move than there are positions
    return this.m_history.length
  }

  public toString (): string {
    return this.getHistory().slice().reverse().map((item) => `(${item.getCurrentSquare().getX()}, ${item.getCurrentSquare().getY()})`).join(' -> ')
  }

  public getMostRecentKnightInTransit (): KnightInTransit {
    return this.m_history[0]
  }

  public clone (): KnightInTransitMovementHistory {
    return new KnightInTransitMovementHistory(this.m_history.slice())
  }

  /**
   * Recursively find the best path that works from this subtree
   * Returns undefined if there are no next moves that can be made with this subtree
   */

  public determineMostEfficientMovePath (numRecursions: number, maxNumRecursions: number | undefined): KnightInTransitMovementHistory | undefined {
    if (numRecursions > 20) {
      warn(`determineMostEfficientMovePath(): Entering with this.getSize() = ${this.getSize()},  this = ${this.toString()},  numRecursions = ${numRecursions}`)
    }
    debug(`determineMostEfficientMovePath(): Entering with this.getSize() = ${this.getSize()},  numRecursions = ${numRecursions}`)

    if (maxNumRecursions != null && numRecursions > maxNumRecursions) {
      debug('determineMostEfficientMovePath(): Too many recursions')
      return undefined
    }

    const mostRecentKnightMovement: KnightInTransit = this.getMostRecentKnightInTransit()
    if (mostRecentKnightMovement.amIAtMyDestination()) {
      debug('determineMostEfficientMovePath(): I am there yet')
      return this
    }

    const knightInTransitMovementHistorySubtrees: Array<KnightInTransitMovementHistory | undefined> = []

    /**
     * Consider all the directions a knight might move.  There are 8
     */
    for (let ii: number = 0; ii < iterateAllDirections.length; ii++) {
      /*
       * Should we even consider going in this direction?
       */

      debug(`determineMostEfficientMovePath(): Should we even consider direction = ${ii} of ${iterateAllDirections.length}: ${iterateAllDirections[ii]}`)

      const considerThisAsNextDirection: KnightMoveDirection = iterateAllDirections[ii]
      const considerThisKnightMove: KnightInTransit = mostRecentKnightMovement.cloneAndMoveInDirection(considerThisAsNextDirection)

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

      /**
       * Filter out/Disregard as many bogus moves as possible, as fast as possible
       *
       * TODO:  There is some risk and debt here.  These filters are based on my gut.   There
       * are possibly a number of bugs and/or performance weaknesses.
       *
       * TODO:  Correctness and performance testing
       * TODO:  More testing with test sets that I know are accurate
       * TODO:  Profiling/performance improvements; optimzations
       * TODO:  For instance Consider a board where we are moving from square (1,1) to square (1000,1000).
       *        The fastest approach might to just prefix the history with a bunch of alternating
       *        North-north-east and ENE movements until we "get close"
       * TODO:  Consider more-elegant implementations here
       */

      if (this.haveIBeenHereBefore(considerThisKnightMove)) {
        info('determineMostEfficientMovePath(): I have been here before.  Going in circles')
        continue
      }
      if (!considerThisKnightMove.isCurrentSquareEvenOnTheBoard()) {
        info('determineMostEfficientMovePath(): I am not even on the board anymore')
        continue
      }
      // if (this.isThisSquareSignificantlyWorseThanThePrevious(considerThisKnightMove)) {
      //   info('determineMostEfficientMovePath(): Significantly worse positioning')
      //   continue
      // }
      if (this.isThisSquareWorseInBothDirectionsSimultaneously(considerThisKnightMove)) {
        info('determineMostEfficientMovePath(): Worse in both directions simultaneously')
        continue
      }
      if (this.isDistantAndNotGettingCloserInBothDirectionsSimultaneously(considerThisKnightMove)) {
        info('determineMostEfficientMovePath(): Distant and not getting closer in both directions')
        continue
      }

      // if (considerThisKnightMove.amIAdjacentFromDestination()) {
      //   info(`determineMostEfficientMovePath(): I am ADJACENT to my destination`)
      // }

      // if (considerThisKnightMove.amIWithinOneJumpAsTheCrowFlies()) {
      //   info(`determineMostEfficientMovePath(): I am within one jump as the crow flies`)
      // }

      info('determineMostEfficientMovePath(): Still potentially viable after filtering')

      // The quick filters haven't short-circuited this approach yet,
      // so trigger recursion

      const anotherPotentialHistoryToConsider: KnightInTransitMovementHistory = this.cloneAndAffixSquare(considerThisKnightMove)

      // TODO: More concise name
      const bestKnightInTransitMovementHistoryFromThisSubtree: KnightInTransitMovementHistory | undefined = anotherPotentialHistoryToConsider.determineMostEfficientMovePath(numRecursions + 1, undefined)
      if (bestKnightInTransitMovementHistoryFromThisSubtree != null) {
        debug('determineMostEfficientMovePath(): Found a diverging history that works')
        knightInTransitMovementHistorySubtrees.unshift(bestKnightInTransitMovementHistoryFromThisSubtree)
      }
    }

    debug(`determineMostEfficientMovePath(): knightInTransitMovementHistorySubtrees.length = ${knightInTransitMovementHistorySubtrees.length}`)

    let bestHistorySoFar: KnightInTransitMovementHistory | undefined

    /**
     * Iterate through knightInTransitMovementHistorySubtrees and see if there are any better ones
     */
    for (let ii: number = 0; ii < knightInTransitMovementHistorySubtrees.length; ii++) {
      const currentHistoryUnderTest = (knightInTransitMovementHistorySubtrees)[ii]
      if (bestHistorySoFar == null) {
        bestHistorySoFar = currentHistoryUnderTest
      } else {
        if (currentHistoryUnderTest.getNumMovesAlready() < bestHistorySoFar.getNumMovesAlready()) {
          bestHistorySoFar = currentHistoryUnderTest
          debug(`determineMostEfficientMovePath(): Found new bestHistorySoFar = ${JSON.stringify(bestHistorySoFar)}`)
        }
      }
    }

    debug(`determineMostEfficientMovePath(): Returning ${JSON.stringify(bestHistorySoFar)}`)
    return bestHistorySoFar
  }
}

export class KnightMoveRunner {
  public run (chessBoard: ChessBoard, knightStartingSquare: ChessBoardSquare, knightDestinationSquare: ChessBoardSquare): KnightInTransitMovementHistory | undefined {
    const knightInTransit: KnightInTransit = KnightInTransit.createKnightWithStartingSquareAndDestinationInMind(chessBoard, knightStartingSquare, knightDestinationSquare)
    const initialHistory: KnightInTransitMovementHistory | undefined = new KnightInTransitMovementHistory([knightInTransit])
    const knightInTransitMovementHistory = initialHistory.determineMostEfficientMovePath(0, undefined)
    return knightInTransitMovementHistory
  }
}

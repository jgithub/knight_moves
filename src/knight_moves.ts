// jeano@MacBook-Pro app % cat knight_moves.ts
/**
 * Requires node, typescript, and ts-node
 *
 *
 * Sometimes a knight is adjacent to it's destination, but has to move further
 * away before it can hit the target.
 *
 * - Goals
 * - Simple Brute force
 * - Aim for Correctness with some performance-related implementation debt
 * - Common Sense (to me anyways) filtering-out of "bad moves"
 * - Most everything is immutable\
 * - OO
 * - Program to an interface
 *
 * TODOs:
 * - Create some test sets
 * - Automated testing
 * - Benchmarking
 * - Make this a npm package
 * - A few global vars need cleanup
 */

/*
 * Every knight movement looks like an 'L'.   There's a long side and a short side
 */
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

function trace(msg: any, ...args: any[]): void {
  // if ( args.length > 0 ) {
  //   console.log(msg, args)
  // } else {
  //   console.log(msg)
  // }
}

export function debug(msg: any, ...args: any[]): void {
  // if ( args.length > 0 ) {
  //   console.log(msg, args)
  // } else {
  //   console.log(msg)
  // }
}

function info(msg: any, ...args: any[]): void {
  // if ( args.length > 0 ) {
  //   console.info(msg, args)
  // } else {
  //   console.info(msg)
  // }
}

function warn(msg: any, ...args: any[]): void {
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

  constructor(x: number, y: number) {
    this.m_x = x
    this.m_y = y
  }

  /**
   * Return the square's X-position
   */
  public getX(): number {
    return this.m_x
  }

  /**
   * Return the square's Y-position
   */
  public getY(): number {
    return this.m_y
  }

  /**
   * Calculate the distance to another position
   */
  public distanceBetween(anotherSquare: ChessBoardSquare): number {
    const xDiff = anotherSquare.getX() - this.m_x
    const yDiff = anotherSquare.getY() - this.m_y
    const c: number = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2))
    debug(`distanceBetween(): Returning ${c},   based on xDiff = ${xDiff}, yDiff = ${yDiff}, c = ${c}`)
    return c
  }

  public isSameAs(anotherSquare: ChessBoardSquare): boolean {
    const retval = this.distanceBetween(anotherSquare) === 0
    debug(`isSameAs(): Returning ${retval}`)
    return retval
  }
}

export class ChessBoard {
  private readonly m_numCols: number
  private readonly m_numRows: number

  constructor(numCols: number, numRows: number) {
    this.m_numCols = numCols
    this.m_numRows = numRows
    debug(`constructor(): Creating chess board ${numCols}x${numRows}...`)
  }

  // corresponds to X
  public getNumCols(): number {
    return this.m_numCols
  }

  // corresponds to Y
  public getNumRows(): number {
    return this.m_numRows
  }
}

export class KnightInTransit {
  private readonly m_currentSquare: ChessBoardSquare
  private readonly m_destinationSquare: ChessBoardSquare

  // Reference back to the chess board this knight is moving within
  private readonly m_chessBoardRef: ChessBoard

  private constructor(chessBoard: ChessBoard, currentSquare: ChessBoardSquare, destinationSquare: ChessBoardSquare) {
    this.m_currentSquare = currentSquare
    this.m_destinationSquare = destinationSquare
    this.m_chessBoardRef = chessBoard
  }

  public static createWithStartingSquareAndDestinationInMind(board: ChessBoard, startingSquare: ChessBoardSquare, destinationSquare: ChessBoardSquare): KnightInTransit {
    return new KnightInTransit(board, startingSquare, destinationSquare)
  }

  public distanceFromDestination(): number {
    return this.m_destinationSquare.distanceBetween(this.m_currentSquare)
  }

  public deltaXFromDestination(): number {
    return Math.abs(this.m_destinationSquare.getX() - this.m_currentSquare.getX())
  }

  public deltaYFromDestination(): number {
    return Math.abs(this.m_destinationSquare.getY() - this.m_currentSquare.getY())
  }

  // public amIWithinOneJumpAsTheCrowFlies(): boolean {
  //   return this.m_destinationSquare.distanceBetween(this.m_currentSquare) < KNIGHT_JUMP_DISTANCE
  // }

  // public amIAdjacentFromDestination(): boolean {
  //   return this.m_destinationSquare.distanceBetween(this.m_currentSquare) < Math.sqrt(2)
  // }

  public isCurrentSquareEvenOnTheBoard(): boolean {
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
  public amIAtMyDestination(): boolean {
    const retval = this.m_currentSquare.isSameAs(this.m_destinationSquare)
    debug(`amIAtMyDestination(): Returning ${retval}`)
    return retval
  }

  /**
   * Instantiate and return a cloned KnightInTransit, having been moved in the specified direction
   */

  public cloneAndMoveInDirection(direction: KnightMoveDirection): KnightInTransit {
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

  public getCurrentSquare(): ChessBoardSquare {
    return this.m_currentSquare
  }
}

export class KnightInTransitMovementHistory {
  private readonly m_history: KnightInTransit[]

  constructor(existingHistory: KnightInTransit[] | undefined) {
    if (existingHistory != null) {
      this.m_history = existingHistory.slice()
    } else {
      this.m_history = []
    }
  }

  public getSize(): number {
    return this.m_history.length
  }

  public getHistory(): KnightInTransit[] {
    return this.m_history
  }

  public haveIBeenHereBefore(knightInTransit: KnightInTransit): boolean {
    for (let ii = 0; ii < this.m_history.length; ii++) {
      const knightPostionUnderTest: ChessBoardSquare = this.m_history[ii].getCurrentSquare()
      if (knightPostionUnderTest.isSameAs(knightInTransit.getCurrentSquare())) {
        return true
      }
    }

    return false
  }

  public isThisSquareSignificantlyWorseThanThePrevious(knightInTransit: KnightInTransit): boolean {
    const deltaFromPreviousLocation = knightInTransit.distanceFromDestination() - this.m_history[0].distanceFromDestination()
    debug(`isThisSquareSignificantlyWorseThanThePrevious(): deltaFromPreviousLocation = ${deltaFromPreviousLocation}`)

    /** If we are pretty far away, and we are getting further away still... */
    if ((knightInTransit.distanceFromDestination() > KNIGHT_JUMP_DISTANCE) && deltaFromPreviousLocation > 0) {
      debug('isThisSquareSignificantlyWorseThanThePrevious(): Returning TRUE')
      return true
    }

    debug('isThisSquareSignificantlyWorseThanThePrevious(): Returning FALSE')
    return false
  }

  public isDistantAndNotGettingCloserInBothDirectionsSimultaneously(knightInTransit: KnightInTransit): boolean {
    const deltaFromLastLocationX = knightInTransit.deltaXFromDestination() - this.m_history[0].deltaXFromDestination()
    const deltaFromLastLocationY = knightInTransit.deltaYFromDestination() - this.m_history[0].deltaYFromDestination()

    debug(`isDistantAndNotGettingCloserInBothDirectionsSimultaneously(): deltaFromLastLocationX = ${deltaFromLastLocationX},  deltaFromLastLocationY = ${deltaFromLastLocationY}`)

    /** If we are pretty far away, and we are getting further away still... */
    if ((knightInTransit.distanceFromDestination() > KNIGHT_JUMP_DISTANCE) && (deltaFromLastLocationX > 0 || deltaFromLastLocationY > 0)) {
      debug('isDistantAndNotGettingCloserInBothDirectionsSimultaneously(): Returning TRUE')
      return true
    }

    debug('isDistantAndNotGettingCloserInBothDirectionsSimultaneously(): Returning FALSE')
    return false
  }

  public isThisSquareWorseInBothDirectionsSimultaneously(knightInTransit: KnightInTransit): boolean {
    const deltaFromLastLocationX = knightInTransit.deltaXFromDestination() - this.m_history[0].deltaXFromDestination()
    const deltaFromLastLocationY = knightInTransit.deltaYFromDestination() - this.m_history[0].deltaYFromDestination()

    debug(`isThisSquareWorseInBothDirectionsSimultaneously(): deltaFromLastLocationX = ${deltaFromLastLocationX},  deltaFromLastLocationY = ${deltaFromLastLocationY}`)

    /** If we are pretty far away, and we are getting further away still... */
    if (deltaFromLastLocationX > 0 && deltaFromLastLocationY > 0) {
      debug('isThisSquareWorseInBothDirectionsSimultaneously(): Returning TRUE')
      return true
    }

    debug('isThisSquareWorseInBothDirectionsSimultaneously(): Returning FALSE')
    return false
  }

  public cloneAndAffixSquare(knightInTransit: KnightInTransit): KnightInTransitMovementHistory {
    const clone = new KnightInTransitMovementHistory(this.m_history)
    clone.m_history.unshift(knightInTransit)
    return clone
  }

  public getNumMovesAlready(): number {
    // The starting position is in the array.  So there is one less
    return this.m_history.length - 1
  }

  public getNumDifferentSquares(): number {
    // The starting position is in the array.  So there is one less move than there are positions
    return this.m_history.length
  }

  public toString(): string {
    return this.getHistory().slice().reverse().map((item) => `(${item.getCurrentSquare().getX()}, ${item.getCurrentSquare().getY()})`).join(' -> ')
  }

  public getMostRecentKnightInTransit(): KnightInTransit {
    return this.m_history[0]
  }

  public clone(): KnightInTransitMovementHistory {
    return new KnightInTransitMovementHistory(this.m_history.slice())
  }

  /**
 * Returns undefined if there are no next moves
 */

  public determineBestHistoryThatWorks(numRecursions: number, maxNumRecursions: number | undefined): KnightInTransitMovementHistory | undefined {
    if (numRecursions > 20) {
      warn(`determineBestHistoryThatWorks(): Entering with this.getSize() = ${this.getSize()},  this = ${this.toString()},  numRecursions = ${numRecursions}`)
    }
    debug(`determineBestHistoryThatWorks(): Entering with this.getSize() = ${this.getSize()},  numRecursions = ${numRecursions}`)

    if (maxNumRecursions != null && numRecursions > maxNumRecursions) {
      debug('determineBestHistoryThatWorks(): Too many recursions')
      return undefined
    }

    const mostRecentKnightMovement: KnightInTransit = this.getMostRecentKnightInTransit()
    if (mostRecentKnightMovement.amIAtMyDestination()) {
      debug('determineBestHistoryThatWorks(): I am there yet')
      return this
    }

    const divergingHistoriesThatWork: Array<KnightInTransitMovementHistory | undefined> = []

    /**
     * Breadth first population of divergingHistoriesThatWork
     */
    for (let ii: number = 0; ii < iterateAllDirections.length; ii++) {
      /*
       * Should we even consider going in this direction?
       */

      debug(`determineBestHistoryThatWorks(): Should we even consider direction = ${ii} of ${iterateAllDirections.length}: ${iterateAllDirections[ii]}`)

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

      if (this.haveIBeenHereBefore(considerThisKnightMove)) {
        info('determineBestHistoryThatWorks(): I have been here before.  Going in circles')
        continue
      }
      if (!considerThisKnightMove.isCurrentSquareEvenOnTheBoard()) {
        info('determineBestHistoryThatWorks(): I am not even on the board anymore')
        continue
      }
      if (this.isThisSquareSignificantlyWorseThanThePrevious(considerThisKnightMove)) {
        info('determineBestHistoryThatWorks(): Significantly worse positioning')
        continue
      }
      if (this.isThisSquareWorseInBothDirectionsSimultaneously(considerThisKnightMove)) {
        info('determineBestHistoryThatWorks(): Worse in both directions simultaneously')
        continue
      }
      if (this.isDistantAndNotGettingCloserInBothDirectionsSimultaneously(considerThisKnightMove)) {
        info('determineBestHistoryThatWorks(): Distant and not getting closer in both directions')
        continue
      }

      // if (considerThisKnightMove.amIAdjacentFromDestination()) {
      //   info(`determineBestHistoryThatWorks(): I am ADJACENT to my destination`)
      // }

      // if (considerThisKnightMove.amIWithinOneJumpAsTheCrowFlies()) {
      //   info(`determineBestHistoryThatWorks(): I am within one jump as the crow flies`)
      // }

      info('determineBestHistoryThatWorks(): Still potentially viable after filtering')

      // The quick filters haven't short-circuited this approach yet,
      // so trigger recursion

      const anotherPotentialHistory: KnightInTransitMovementHistory = this.cloneAndAffixSquare(considerThisKnightMove)
      const bestHistoryThatWorks: KnightInTransitMovementHistory | undefined = anotherPotentialHistory.determineBestHistoryThatWorks(numRecursions + 1, undefined)
      if (bestHistoryThatWorks != null) {
        debug('determineBestHistoryThatWorks(): Found a diverging history that works')
        divergingHistoriesThatWork.unshift(bestHistoryThatWorks)
      }
    }

    debug(`determineBestHistoryThatWorks(): divergingHistoriesThatWork.length = ${divergingHistoriesThatWork.length}`)

    let bestHistorySoFar: KnightInTransitMovementHistory | undefined

    /**
     * Iterate through divergingHistoriesThatWork and see if there are any better ones
     */
    for (let ii: number = 0; ii < divergingHistoriesThatWork.length; ii++) {
      const currentHistoryUnderTest = (divergingHistoriesThatWork)[ii]
      if (bestHistorySoFar == null) {
        bestHistorySoFar = currentHistoryUnderTest
      } else {
        if (currentHistoryUnderTest.getNumMovesAlready() < bestHistorySoFar.getNumMovesAlready()) {
          bestHistorySoFar = currentHistoryUnderTest
          debug(`determineBestHistoryThatWorks(): Found new bestHistorySoFar = ${JSON.stringify(bestHistorySoFar)}`)
        }
      }
    }

    debug(`determineBestHistoryThatWorks(): Returning ${JSON.stringify(bestHistorySoFar)}`)
    return bestHistorySoFar
  }
}



export class KnightMoveRunner {
  public run(chessBoard: ChessBoard, knightStartingSquare: ChessBoardSquare, knightDestinationSquare: ChessBoardSquare): KnightInTransitMovementHistory | undefined {
    const knightInTransit: KnightInTransit = KnightInTransit.createWithStartingSquareAndDestinationInMind(chessBoard, knightStartingSquare, knightDestinationSquare)
    const initialHistory: KnightInTransitMovementHistory | undefined = new KnightInTransitMovementHistory([knightInTransit])
    const knightInTransitMovementHistory = initialHistory.determineBestHistoryThatWorks(0, undefined)
    return knightInTransitMovementHistory
  }
} 

import { KmLogger } from './log/KmLogger'
import { ChessBoard } from './ChessBoard'

/**
 * This represents a single square on a chess board
 * 1,1 is the lower left-hand corner of the board
 */

export class ChessBoardSquare {
  private static readonly LOG: KmLogger = KmLogger.getLogger('ChessBoardSquare')
  private readonly LOG: KmLogger = ChessBoardSquare.LOG

  private readonly m_x: number
  private readonly m_y: number

  // Reference to the Chess Board that this square lives within
  private readonly m_chessBoardRef: ChessBoard

  constructor (chessBoard: ChessBoard, x: number, y: number) {
    this.m_chessBoardRef = chessBoard
    this.m_x = x
    this.m_y = y
  }

  public toString (): string {
    return `(${this.m_x}, ${this.m_y})`
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
   * Return the associated Chess Board reference
   */
  public getChessBoard (): ChessBoard {
    return this.m_chessBoardRef
  }

  /**
   * Is this square, with it's current specified X, Y location, a valid square on
   * the associated chess board?
   */

  public isOnBoard (): boolean {
    if (this.getX() > this.getChessBoard().getNumCols()) {
      this.LOG.debug(`isOnBoard(): Returning FALSE  this = ${this}`)
      return false
    }
    if (this.getY() > this.getChessBoard().getNumRows()) {
      this.LOG.debug(`isOnBoard(): Returning FALSE  this = ${this}`)
      return false
    }

    if (this.getX() < 1) {
      this.LOG.debug('isOnBoard(): X-pos cannot be less than 1')
      return false
    }

    if (this.getY() < 1) {
      this.LOG.debug('isOnBoard(): Y-pos cannot be less than 1')
      return false
    }

    this.LOG.trace(`isOnBoard(): Returning TRUE.  this = ${this}`)
    return true
  }

  /**
   * Calculate the distance between this square and another
   */
  public distanceBetween (anotherSquare: ChessBoardSquare): number {
    const xDiff = anotherSquare.getX() - this.m_x
    const yDiff = anotherSquare.getY() - this.m_y
    const c: number = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2))
    this.LOG.trace(`distanceBetween(): Returning ${c},   based on xDiff = ${xDiff}, yDiff = ${yDiff}, c = ${c}`)
    return c
  }

  /**
   * Calculate the horizontal distance between this square and another
   */
  public deltaX (anotherSquare: ChessBoardSquare): number {
    return anotherSquare.getX() - this.m_x
  }

  /**
   * Calculate the horizontal distance between this square and another
   */
  public deltaY (anotherSquare: ChessBoardSquare): number {
    return anotherSquare.getY() - this.m_y
  }

  /**
   * Is this square in the same location as another?
   */
  public isSameAs (anotherSquare: ChessBoardSquare): boolean {
    const retval = this.distanceBetween(anotherSquare) === 0
    this.LOG.trace(`isSameAs(): Returning ${retval}`)
    return retval
  }
}

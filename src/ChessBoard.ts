import { KmLogger } from './log/KmLogger'

/**
 * Represents a ChessBoard object... specifically the dimensions of a board
 */

export class ChessBoard {
  private static readonly LOG: KmLogger = KmLogger.getLogger('ChessBoard')
  private readonly LOG: KmLogger = ChessBoard.LOG

  private readonly m_numCols: number
  private readonly m_numRows: number

  constructor (numCols: number, numRows: number) {
    this.m_numCols = numCols
    this.m_numRows = numRows
    this.LOG.debug(`constructor(): Creating chess board ${numCols}x${numRows}...`)
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

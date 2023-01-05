import { ChessBoardSquare } from './ChessBoardSquare'
import { KnightMoveDirection } from './KnightMoveDirection'
import { KNIGHT_JUMP_SHORT, KNIGHT_JUMP_LONG } from './constant'
import { KmLogger } from './log/KmLogger'
const LOG: KmLogger = KmLogger.getLogger('knightUtil.ts')

/**
 * Given a current square and a "Knight Jump direction",
 * what is the next square on which the Knight will end up
 *
 * This square may be "off the board"
 *
 * @param currentSquare
 * @param direction
 */

export const applyKnightMovementFrom = (currentSquare: ChessBoardSquare, direction: KnightMoveDirection): ChessBoardSquare => {
  const newSquare: ChessBoardSquare = (() => {
    LOG.debug(`moveCloneInDirection(): Jumping '${direction}' from currentSquare = ${currentSquare}`)
    switch (direction) {
      case KnightMoveDirection.northNorthEast: {
        return new ChessBoardSquare(currentSquare.getChessBoard(), currentSquare.getX() + KNIGHT_JUMP_SHORT, currentSquare.getY() + KNIGHT_JUMP_LONG)
      } case KnightMoveDirection.eastNorthEast: {
        return new ChessBoardSquare(currentSquare.getChessBoard(), currentSquare.getX() + KNIGHT_JUMP_LONG, currentSquare.getY() + KNIGHT_JUMP_SHORT)
      } case KnightMoveDirection.eastSouthEast: {
        return new ChessBoardSquare(currentSquare.getChessBoard(), currentSquare.getX() + KNIGHT_JUMP_LONG, currentSquare.getY() - KNIGHT_JUMP_SHORT)
      } case KnightMoveDirection.southSouthEast: {
        return new ChessBoardSquare(currentSquare.getChessBoard(), currentSquare.getX() + KNIGHT_JUMP_SHORT, currentSquare.getY() - KNIGHT_JUMP_LONG)
      } case KnightMoveDirection.southSouthWest: {
        return new ChessBoardSquare(currentSquare.getChessBoard(), currentSquare.getX() - KNIGHT_JUMP_SHORT, currentSquare.getY() - KNIGHT_JUMP_LONG)
      } case KnightMoveDirection.westSouthWest: {
        return new ChessBoardSquare(currentSquare.getChessBoard(), currentSquare.getX() - KNIGHT_JUMP_LONG, currentSquare.getY() - KNIGHT_JUMP_SHORT)
      } case KnightMoveDirection.westNorthWest: {
        return new ChessBoardSquare(currentSquare.getChessBoard(), currentSquare.getX() - KNIGHT_JUMP_LONG, currentSquare.getY() + KNIGHT_JUMP_SHORT)
      } case KnightMoveDirection.northNorthWest: {
        return new ChessBoardSquare(currentSquare.getChessBoard(), currentSquare.getX() - KNIGHT_JUMP_SHORT, currentSquare.getY() + KNIGHT_JUMP_LONG)
      }
    }
  })()
  LOG.debug(`moveCloneInDirection(): Returning ${newSquare}`)
  return newSquare
}

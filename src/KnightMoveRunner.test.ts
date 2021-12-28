import { KnightMoveRunner, debug, ChessBoard, ChessBoardSquare, KnightInTransitMovementHistory } from './knight_moves'

describe("KnightMoveRunner", ()=> {
  describe("#run", ()=> {
    describe("when testing on an 11x11 board that historically gave me trouble", () => {
      test("it generates the expected result", () => {
        const chessBoard: ChessBoard = new ChessBoard(11,11)
        const knightStartingSquare: ChessBoardSquare = new ChessBoardSquare(1, 1)
        const knightDestinationSquare: ChessBoardSquare = new ChessBoardSquare(10, 10)

        const knightMoveRunner: KnightMoveRunner = new KnightMoveRunner()
        const knightInTransitMovementHistory: KnightInTransitMovementHistory | undefined = knightMoveRunner.run(chessBoard, knightStartingSquare, knightDestinationSquare)
        
        expect(knightInTransitMovementHistory).not.toBeUndefined
        expect(knightInTransitMovementHistory).not.toBeNull
        expect(knightInTransitMovementHistory.toString()).toBe('(1, 1) -> (3, 2) -> (5, 3) -> (7, 4) -> (8, 6) -> (9, 8) -> (10, 10)')
        expect(knightInTransitMovementHistory.getNumDifferentSquares()).toBe(7)
      });
    });

    describe("when testing on an 3x3 board", () => {
      test("it generates the expected result", () => {

        const chessBoard: ChessBoard = new ChessBoard(11,11)
        const knightStartingSquare: ChessBoardSquare = new ChessBoardSquare(1, 1)
        const knightDestinationSquare: ChessBoardSquare = new ChessBoardSquare(3, 3)

        const knightMoveRunner: KnightMoveRunner = new KnightMoveRunner()
        const knightInTransitMovementHistory: KnightInTransitMovementHistory | undefined = knightMoveRunner.run(chessBoard, knightStartingSquare, knightDestinationSquare)
        
        expect(knightInTransitMovementHistory).not.toBeUndefined
        expect(knightInTransitMovementHistory).not.toBeNull
        expect(knightInTransitMovementHistory.toString()).toBe('(1, 1) -> (3, 2) -> (2, 4) -> (1, 2) -> (3, 3)')
        expect(knightInTransitMovementHistory.getNumDifferentSquares()).toBe(5)
      })
    });
  })  
})


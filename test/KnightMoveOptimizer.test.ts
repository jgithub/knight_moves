import { ChessBoard } from "../src/ChessBoard";
import { ChessBoardSquare } from "../src/ChessBoardSquare";
import { KnightMoveOptimizer } from "../src/KnightMoveOptimizer";
import { KnightInTransit } from "../src/knightInTransit";

describe("KnightMoveOptimizer", ()=> {
  describe("#optimize()", ()=> {

    describe("when testing the given sample", () => {
      test("it generates the expected result", () => {
        const chessBoard: ChessBoard = new ChessBoard(10, 10)
        const knightStartingSquare: ChessBoardSquare = new ChessBoardSquare(chessBoard, 4, 5)
        const knightDestinationSquare: ChessBoardSquare = new ChessBoardSquare(chessBoard, 3, 2)

        const knightMoveOptimizer: KnightMoveOptimizer = new KnightMoveOptimizer()
        const knightInTransit: KnightInTransit | undefined = knightMoveOptimizer.optimize(knightStartingSquare, knightDestinationSquare)
        
        expect(knightInTransit).not.toBeUndefined
        expect(knightInTransit).not.toBeNull
        expect(knightInTransit.toString()).toBe('(4, 5) -> (5, 3) -> (3, 2)')
        expect(knightInTransit.getNumSquaresInPath()).toBe(3)
      });
    });


    describe("when testing on an 11x11 board that historically gave me trouble", () => {
      test("it generates the expected result", () => {
        const chessBoard: ChessBoard = new ChessBoard(11,11)
        const knightStartingSquare: ChessBoardSquare = new ChessBoardSquare(chessBoard, 1, 1)
        const knightDestinationSquare: ChessBoardSquare = new ChessBoardSquare(chessBoard, 10, 10)

        const knightMoveOptimizer: KnightMoveOptimizer = new KnightMoveOptimizer()
        const knightInTransit: KnightInTransit | undefined = knightMoveOptimizer.optimize(knightStartingSquare, knightDestinationSquare)
        
        expect(knightInTransit).not.toBeUndefined
        expect(knightInTransit).not.toBeNull
        expect(knightInTransit.toString()).toBe('(1, 1) -> (2, 3) -> (3, 5) -> (4, 7) -> (6, 8) -> (8, 9) -> (10, 10)')
        expect(knightInTransit.getNumSquaresInPath()).toBe(7)
      });
    });

    describe("when testing on an 3x3 board", () => {
      describe("when going from (1,1) to (3,3)", () => {
        test("it generates the expected result", () => {

          const chessBoard: ChessBoard = new ChessBoard(3, 3)
          const knightStartingSquare: ChessBoardSquare = new ChessBoardSquare(chessBoard, 1, 1)
          const knightDestinationSquare: ChessBoardSquare = new ChessBoardSquare(chessBoard, 3, 3)

          const knightMoveOptimizer: KnightMoveOptimizer = new KnightMoveOptimizer()
          const knightInTransit: KnightInTransit | undefined = knightMoveOptimizer.optimize(knightStartingSquare, knightDestinationSquare)
          
          expect(knightInTransit).not.toBeUndefined
          expect(knightInTransit).not.toBeNull
          expect(knightInTransit.toString()).toBe('(1, 1) -> (2, 3) -> (3, 1) -> (1, 2) -> (3, 3)')
          expect(knightInTransit.getNumSquaresInPath()).toBe(5)
        })
      });

      describe("when starting at the destination", () => {
        test("it generates the expected (no-movement) result", () => {

          const chessBoard: ChessBoard = new ChessBoard(3,3)
          const knightStartingSquare: ChessBoardSquare = new ChessBoardSquare(chessBoard, 1, 1)
          const knightDestinationSquare: ChessBoardSquare = new ChessBoardSquare(chessBoard, 1, 1)

          const knightMoveOptimizer: KnightMoveOptimizer = new KnightMoveOptimizer()
          const knightInTransit: KnightInTransit | undefined = knightMoveOptimizer.optimize(knightStartingSquare, knightDestinationSquare)
          
          expect(knightInTransit).not.toBeUndefined
          expect(knightInTransit).not.toBeNull
          expect(knightInTransit.toString()).toBe('(1, 1)')
          expect(knightInTransit.getNumSquaresInPath()).toBe(1)
        })
      });      
    });

    describe("when testing on an 2x2 board", () => {
      describe("when going from (1,1) to (2,2)", () => {
        test("returns undefined (no viable path from source to dest)", () => {

          const chessBoard: ChessBoard = new ChessBoard(2,2)
          const knightStartingSquare: ChessBoardSquare = new ChessBoardSquare(chessBoard, 1, 1)
          const knightDestinationSquare: ChessBoardSquare = new ChessBoardSquare(chessBoard, 2, 2)

          const knightMoveOptimizer: KnightMoveOptimizer = new KnightMoveOptimizer()
          const knightInTransit: KnightInTransit | undefined = knightMoveOptimizer.optimize(knightStartingSquare, knightDestinationSquare)
          
          // No viable path
          expect(knightInTransit).toBeUndefined
        })
      });
    });    

    describe("when testing on an 27x27 board", () => {
      test("it generates the expected result", () => {

        const chessBoard: ChessBoard = new ChessBoard(27,27)
        const knightStartingSquare: ChessBoardSquare = new ChessBoardSquare(chessBoard, 1, 1)
        const knightDestinationSquare: ChessBoardSquare = new ChessBoardSquare(chessBoard, 27,27)

        const knightMoveOptimizer: KnightMoveOptimizer = new KnightMoveOptimizer()
        const knightInTransit: KnightInTransit | undefined = knightMoveOptimizer.optimize(knightStartingSquare, knightDestinationSquare)
        
        expect(knightInTransit).not.toBeUndefined
        expect(knightInTransit).not.toBeNull
        expect(knightInTransit.toString()).toBe('(1, 1) -> (2, 3) -> (3, 5) -> (4, 7) -> (5, 9) -> (6, 11) -> (7, 13) -> (8, 15) -> (9, 17) -> (10, 19) -> (11, 21) -> (13, 22) -> (15, 23) -> (17, 24) -> (19, 25) -> (21, 26) -> (23, 27) -> (25, 26) -> (27, 27)')
        expect(knightInTransit.getNumSquaresInPath()).toBe(19)
      })
    });    

    // TODO: Consider a 100x100 board.  It's dang slow.  So I'm not including it for now

    // TODO: How to test an infinitely large chess board?
  })  
})


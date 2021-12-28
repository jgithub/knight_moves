import { KnightMoveRunner, debug, ChessBoard, ChessBoardSquare, KnightInTransitMovementHistory } from './knight_moves'

let chessBoard: ChessBoard
let knightStartingSquare: ChessBoardSquare
let knightDestinationSquare: ChessBoardSquare

/*
       d8888                              
      d88888                              
     d88P888                              
    d88P 888   888d888 .d88b.    888  888 
   d88P  888   888P"  d88P"88b   888  888 
  d88P   888   888    888  888   Y88  88P 
 d8888888888   888    Y88b 888    Y8bd8P  
d88P     888   888     "Y88888     Y88P   
                           888            
                      Y8b d88P            
                       "Y88P"             
*/
{
  const myArgs = process.argv.slice(2)
  debug(`myArgs = ${JSON.stringify(myArgs)}`)

  const keyValuePairs: Map<string, string> = new Map()

  for (let ii = 0; ii < myArgs.length; ii++) {
    const key = myArgs[ii]
    ii++
    const value = myArgs[ii]
    debug(`Handling key/value = '${key}'/'${value}'`)
    keyValuePairs.set(key, value)
  }


  /* Handle Argv */
  const argKeys = Array.from( keyValuePairs.keys() );
  for (let ii = 0; ii < argKeys.length; ii++) {
    const key = argKeys[ii]
    const value = keyValuePairs.get(key)
    debug(`Handling key/value = '${key}'/'${value}'`)

    if (key === '--board_size') {
      const [x, y] = (value as string).split(',')
      debug(`Handling board_size = '${value}'`)
      chessBoard = new ChessBoard(Number(x), Number(y))
    } else if (key === '--source') {
      const [x, y] = (value as string).split(',')
      knightStartingSquare = new ChessBoardSquare(Number(x), Number(y))
    } else if (key === '--dest') {
      const [x, y] = (value as string).split(',')
      knightDestinationSquare = new ChessBoardSquare(Number(x), Number(y))
    }
  }
}

const knightMoveRunner: KnightMoveRunner = new KnightMoveRunner()
const knightInTransitMovementHistory: KnightInTransitMovementHistory | undefined = knightMoveRunner.run(chessBoard, knightStartingSquare, knightDestinationSquare)
if (knightInTransitMovementHistory != null && knightInTransitMovementHistory.getSize() > 0) {
  console.log(`>> ${knightInTransitMovementHistory.toString()}`)
  console.log(`>> ${knightInTransitMovementHistory.getNumDifferentSquares()}`)
} else {
  console.log('-1')
}

// % npx ts-node knight_moves.ts --board_size 11,11 --dest 11,11 --source 1,1
// % npx ts-node knight_moves.ts --board_size 11,11 --dest 10,10 --source 1,1
// % ./knight_moves --board_size 3,3 --dest 3,3 --source 1,1
// % ./knight_moves --board_size 27,27 --dest 27,27 --source 1,1
// >> (1, 1) -> (3, 2) -> (5, 3) -> (7, 4) -> (9, 5) -> (11, 6) -> (13, 7) -> (15, 8) -> (17, 9) -> (19, 10) -> (21, 11) -> (22, 13) -> (23, 15) -> (24, 17) -> (25, 19) -> (26, 21) -> (27, 23) -> (26, 25) -> (27, 27)
// >> 19
// jeano@MacBook-Pro app %
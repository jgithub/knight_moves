
/**
 * This file provides the the "knight_moves CLI" functionality
 */

import { ChessBoardSquare } from './ChessBoardSquare'
import { ChessBoard } from './ChessBoard'
import { KmLogger } from './log/KmLogger'
import { KnightMoveOptimizer } from './KnightMoveOptimizer'
import { KnightInTransit } from './knightInTransit'

let chessBoard: ChessBoard
let knightStartingSquare: ChessBoardSquare
let knightDestinationSquare: ChessBoardSquare

const LOG: KmLogger = KmLogger.getLogger('cli.ts')

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
  LOG.debug(`cli.ts: myArgs = ${JSON.stringify(myArgs)}`)

  const keyValuePairs: Map<string, string> = new Map()

  for (let ii = 0; ii < myArgs.length; ii++) {
    const key = myArgs[ii]
    ii++
    const value = myArgs[ii]
    LOG.debug(`Handling key/value = '${key}'/'${value}'`)
    keyValuePairs.set(key, value)
  }

  /* Handle Argv */
  const argKeys = Array.from(keyValuePairs.keys())
  for (let ii = 0; ii < argKeys.length; ii++) {
    const key = argKeys[ii]
    const value = keyValuePairs.get(key)
    LOG.debug(`Handling key/value = '${key}'/'${value}'`)

    if (key === '--board_size') {
      const [x, y] = (value).split(',')
      LOG.debug(`Handling board_size = '${value}'`)
      chessBoard = new ChessBoard(Number(x), Number(y))
    } else if (key === '--source') {
      if (chessBoard == null) {
        throw new Error('Please specify the --board_size before --source and --dest')
      }
      const [x, y] = (value).split(',')
      knightStartingSquare = new ChessBoardSquare(chessBoard, Number(x), Number(y))
    } else if (key === '--dest') {
      if (chessBoard == null) {
        throw new Error('Please specify the --board_size before --source and --dest')
      }
      const [x, y] = (value).split(',')
      knightDestinationSquare = new ChessBoardSquare(chessBoard, Number(x), Number(y))
    }
  }
}

const knightMoveOptimizer: KnightMoveOptimizer = new KnightMoveOptimizer()
const knightInTransit: KnightInTransit | undefined = knightMoveOptimizer.optimize(knightStartingSquare, knightDestinationSquare)
if (knightInTransit != null && knightInTransit.getNumSquaresInPath() > 0) {
  console.log(`>> ${knightInTransit.toString()}`)
  console.log(`>> ${knightInTransit.getNumSquaresInPath()}`)
} else {
  console.log('-1')
}

// % npx ts-node knight_moves.ts --board_size 11,11 --dest 11,11 --source 1,1
// % npx ts-node knight_moves.ts --board_size 11,11 --dest 10,10 --source 1,1
// % ./knight_moves --board_size 3,3 --dest 3,3 --source 1,1
// % ./knight_moves --board_size 27,27 --dest 27,27 --source 1,1
// >> (1, 1) -> (2, 3) -> (3, 5) -> (4, 7) -> (5, 9) -> (6, 11) -> (7, 13) -> (8, 15) -> (9, 17) -> (10, 19) -> (11, 21) -> (13, 22) -> (15, 23) -> (17, 24) -> (19, 25) -> (21, 26) -> (23, 27) -> (25, 26) -> (27, 27)
// >> 19
// jeano@MacBook-Pro app %

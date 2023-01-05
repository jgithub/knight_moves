# knight_moves

## Quickstart

* If you have a recent version of node install, the easiest way to run this is probably `./knight_moves.sh --board_size 11,11 --dest 10,10 --source 1,1`.   This uses the precompiled *.js files
 
```
% ./knight_moves.sh --board_size 10,10 --source 4,5 --dest 3,2 
>> (4, 5) -> (5, 3) -> (3, 2)
>> 3
% 
```

Or if you prefer to run the typescript

```
% npm install
% # cp dotenv.template .env
% npx ts-node src/cli.ts --board_size 11,11 --dest 10,10 --source 1,1
>> (1, 1) -> (2, 3) -> (3, 5) -> (4, 7) -> (6, 8) -> (8, 9) -> (10, 10)
>> 7
% 
``` 


## "Coding Exercise Ask"

Below is the small technical exercise for our interview. You can welcome to choose any languages you want. Please provide documentation on how to compile and execute it. 

**Minimum steps to reach the target by a Knight**

Given a source (A, B) to destination (X, Y) points on a chessboard, we need to find the minimal number of steps a Knight needs to move to the destination. If it is possible, please print each of the steps it took and the number of steps. If it is not possible, please print -1.

The program should allow users to enter the size of the chessboard and the source/destination points.

For example:
```
./knight_move --board_size 10,10 --source 4,5 --dest 3,2
>> (4, 5) -> (5, 3) -> (3, 2)
>> 3
```

**Bonus**: Support infinite chessboard 

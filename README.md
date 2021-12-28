# knight_moves
* If you have a recent version of node install, the easiest way to run this is probably `./knight_moves.sh --board_size 11,11 --dest 10,10 --source 1,1`.   This uses the precompiled *.js files
 
```
% ./knight_moves.sh --board_size 10,10 --source 4,5 --dest 3,2 
>> (4, 5) -> (2, 4) -> (3, 2)
>> 3
% 
```

Or if you prefer to run the typescript

```
% npm install
% npx ts-node src/cli.ts --board_size 11,11 --dest 10,10 --source 1,1
``` 

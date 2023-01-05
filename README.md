# knight_moves
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

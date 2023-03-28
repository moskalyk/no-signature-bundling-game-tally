# no-signature-bundling-game-tally

Store a hash of game participants and game state in a single bytes32 hash.

## to run

First run the off-chain hash rollup on the state.

```
# run the off-chain signature
$ mv .env.example .env // and fill out variables
$ ts-node index.ts // take signature output and use remix to validate signature 
```

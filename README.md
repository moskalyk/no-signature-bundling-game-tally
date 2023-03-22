# no-signature-bundling-game-tally

This repo is a work in progress, currently breaking.

The address returned from the verifier.validate function is something different than the signer.

## to run

First run the off-chain hash rollup on the state.

```
# run the off-chain signature
$ mv .env.example .env // and fill out variables
$ ts-node index.ts // take signature output and use remix to validate signature 
```
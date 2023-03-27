require('dotenv').config()

import { ethers, utils } from "ethers";
import { Wallet } from '@0xsequence/wallet'
import { RpcRelayer } from '@0xsequence/relayer'

(async () => {
    // Get a provider
    const provider = new ethers.providers.JsonRpcProvider('https://nodes.sequence.app/polygon')
    const pkey = process.env.pkey!
    // const wallet = new ethers.Wallet(pkey);
    const walletEOA = new ethers.Wallet(pkey, provider)

    // Create your rpc relayer instance with relayer node you want to use
    const relayer = new RpcRelayer({url: 'https://polygon-relayer.sequence.app', provider: provider})

    const wallet = (await Wallet.singleOwner(walletEOA)).connect(provider, relayer)

    // Craft your transaction
    const erc721Interface = new ethers.utils.Interface([
        'function tally(address[] winners, bytes[] signatures, address[][] addressess, address[] sessionAddresses, address[] verifierAddresses, uint[][] state, uint[] nonces) external returns (bool)'
    ])

    // [["0xc48835421ce2651BC5F78Ee59D1e10244753c7FC", "0x29afb54810138011109f9d75d3ba032fb6157dd825f9aec62df8d3310f2f1a242e3a814215828fc80e1d3d9702bf7111ab4c19ca52fb7fcafbffd4860770010a1b", ["0xc48835421ce2651BC5F78Ee59D1e10244753c7FC","0xbCDCC8D0DF0f459f034A7fbD0A6ce672AF0f0953"], ["0xc48835421ce2651BC5F78Ee59D1e10244753c7FC","0x60d8d2a73354c462F88B0b9e91e5637Fe638a4b1"],[1,2,3,4],0]]
    // const myStructData = ethers.utils.AbiCoder.prototype.encode(
    //     ['address', 'bytes', 'address[]', 'tuple(address sessionAddress, address verifierAddress)', 'uint[]','uint'],
    //     [
    //         ["0xc48835421ce2651BC5F78Ee59D1e10244753c7FC"],
    //         ["0x29afb54810138011109f9d75d3ba032fb6157dd825f9aec62df8d3310f2f1a242e3a814215828fc80e1d3d9702bf7111ab4c19ca52fb7fcafbffd4860770010a1b"],
    //         [["0xc48835421ce2651BC5F78Ee59D1e10244753c7FC","0xbCDCC8D0DF0f459f034A7fbD0A6ce672AF0f0953"]],
    //         ["0xc48835421ce2651BC5F78Ee59D1e10244753c7FC"], 
    //         ["0x60d8d2a73354c462F88B0b9e91e5637Fe638a4b1"],
    //         [[1,2,3,4]],
    //         [0]
    //     ]
    //   );

    const games: any = []
    // console.log(myStructData)
    // games.push(myStructData)
    
    const data = erc721Interface.encodeFunctionData(
        'tally', [
            ["0xc48835421ce2651BC5F78Ee59D1e10244753c7FC"],
            ["0x29afb54810138011109f9d75d3ba032fb6157dd825f9aec62df8d3310f2f1a242e3a814215828fc80e1d3d9702bf7111ab4c19ca52fb7fcafbffd4860770010a1b"],
            [["0xc48835421ce2651BC5F78Ee59D1e10244753c7FC","0xbCDCC8D0DF0f459f034A7fbD0A6ce672AF0f0953"]],
            ["0xc48835421ce2651BC5F78Ee59D1e10244753c7FC"], 
            ["0x60d8d2a73354c462F88B0b9e91e5637Fe638a4b1"],
            [[1,2,3,4]],
            [0]
        ]
    )
    
    const contractAddress = ''
    const txn = {
        to: contractAddress,
        data: data
    }
    console.log('----')
    console.log(txn)
    console.log('----')

    let output = '0x';

    output = utils.solidityPack([ 'bytes', 'uint'], [ output, 0 ])
    console.log(output)
    const hash = utils.solidityKeccak256(['bytes'], [output])
    console.log(hash)

    // const signer = await wallet.getSigner()
    const txnResponse = await wallet.sendTransaction([txn])

    // Wait for transaction to be mined
   const txnReceipt = await txnResponse.wait()
   console.log(txnReceipt)
    // var signature = await wallet.signMessage(ethers.utils.arrayify(hash))
    // console.log(signature)
})()
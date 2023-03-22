require('dotenv').config()
import { ethers, utils } from "ethers";

const _addresses = [process.env.account_0, process.env.account_1]
const _state = [1,2,3,4]

const pkey = process.env.pkey!
var wallet = new ethers.Wallet(pkey);

let output = '0x'

for(let i = 0; i < Math.max(_addresses.length, _state.length); i++){
    if(i < _addresses.length && i < _state.length){
        output = utils.solidityPack([ 'bytes', 'address', 'uint' ], [ output, _addresses[i], _state[i] ])
    } else if (i < _addresses.length) {
        output = utils.solidityPack([ 'bytes', 'address'], [ output, _addresses[i] ])
    } else if (i < _state.length) {
        output = utils.solidityPack([ 'bytes', 'uint'], [ output, _state[i] ])
    }
}

(async () => {
    output = utils.solidityPack([ 'bytes', 'uint'], [ output, 0 ])
    const hash = utils.keccak256(output)
    console.log(hash)
    var signature = await wallet.signMessage(ethers.utils.arrayify(hash))
    console.log(signature)
})()

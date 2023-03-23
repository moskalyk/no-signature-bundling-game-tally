require('dotenv').config()
import { ethers, utils } from "ethers";

const _addresses = [process.env.account_0, process.env.account_1]
const _state = [1,2,3,4]

const pkey = process.env.pkey!
var wallet = new ethers.Wallet(pkey);

let output = '0x'

output = utils.solidityPack(['address', 'uint' ], [_addresses[0], _state[0] ])

console.log(output)
console.log('-----')
for(let i = 0; i < Math.max(_addresses.length, _state.length); i++){
    if(i < _addresses.length && i < _state.length){
        output = utils.soliditySha256([ 'bytes', 'address', 'uint' ], [ output, _addresses[i], _state[i] ])
        console.log(output, "+", i)
    } else if (i < _addresses.length) {
        output = utils.soliditySha256([ 'bytes', 'address'], [ output, _addresses[i] ])
        console.log(output, "+", i)
    } else if (i < _state.length) {
        output = utils.soliditySha256([ 'bytes', 'uint'], [ output, _state[i] ])
        console.log(output, "+", i)
    }
}

(async () => {
    output = utils.soliditySha256([ 'bytes', 'uint'], [ output, 0 ])
    console.log(output)
    const hash = utils.soliditySha256(['bytes'], [output])
    console.log(hash)
    var signature = await wallet.signMessage(ethers.utils.arrayify(hash))
    console.log(signature)
})()

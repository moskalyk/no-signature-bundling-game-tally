// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

library ECRecovery {

  /**
   * @dev Recover signer address from a message by using his signature
   * @param hash bytes32 message, the hash is the signed message. What is recovered is the signer address.
   * @param sig bytes signature, the signature is generated using web3.eth.sign()
   */
  function recover(bytes32 hash, bytes memory sig) public pure returns (address) {
    bytes32 r;
    bytes32 s;
    uint8 v;

    //Check the signature length
    if (sig.length != 65) {
      return (address(0));
    }

    // Divide the signature in r, s and v variables
    assembly {
      r := mload(add(sig, 32))
      s := mload(add(sig, 64))
      v := byte(0, mload(add(sig, 96)))
    }

    // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
    if (v < 27) {
      v += 27;
    }

    // If the version is correct return the signer address
    if (v != 27 && v != 28) {
      return (address(0));
    } else {
      return ecrecover(hash, v, r, s);
    }
  }

}

interface IGameVerifer {
    function validate(bytes memory _signature, address[] memory _addresses, uint[] memory _state, uint _nonce) external returns (address);
}

contract Verifier is IGameVerifer {
    using ECDSA for bytes32;
    using ECRecovery for bytes32;

    event Verified(bytes32 indexed valid);
    event Address(address indexed _address);

    constructor(){}

    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a >= b ? a : b;
    }

    function validate(bytes memory _sig, address[] memory _addresses, uint[] memory _state, uint _nonce) public returns (address) {

        bytes memory output = "0x";

        for (uint256 i = 0; i < max(_addresses.length, _state.length); i++) {
            if(i < _addresses.length && i < _state.length){
                output = abi.encodePacked(output, _addresses[i], _state[i]);
            } else if (i < _addresses.length) {
                output = abi.encodePacked(output, _addresses[i]);
            } else if (i < _state.length) {
                output = abi.encodePacked(output, _state[i]);
            }
        }
        
        bytes32 message = keccak256(abi.encodePacked(output, _nonce));
        bytes32 preFixedMessage = message.toEthSignedMessageHash();
    
        // Confirm the signature came from the owner
        emit Address(ECRecovery.recover(preFixedMessage, _sig));
        return ECRecovery.recover(preFixedMessage, _sig);
    }
}

contract GameTally is ERC721, IGameTally {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    mapping(address => uint) public tallies;
    mapping(bytes => bool) public nonces;

    constructor() ERC721("GameTally", "GTY"){}

    function tally(address _sessionAddress, Game[] memory _games ) public returns (bool) {

        // increment counter
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);

        // check if nonce has been used before
        for(uint i; i< _games.length; i++){
            if(!nonces[abi.encodePacked(_sessionAddress, _games[i].nonce)]){
                nonces[abi.encodePacked(_sessionAddress, _games[i].nonce)] = true;
                if(_games[i].winner == _sessionAddress){
                    // tally count
                    tallies[_sessionAddress] = tallies[_sessionAddress]+1;
                    // do something with a IVerfifier(address).validate(...)
                    return true;
                }
            } else {
                revert("Nonce used");
            }
        }
    }
}
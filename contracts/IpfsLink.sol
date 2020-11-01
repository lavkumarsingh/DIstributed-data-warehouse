// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract IpfsLink {
  string ipfsHash;

  function set(string memory x) public {
    ipfsHash = x;
  }

  function get() public view returns (string memory) {
    return ipfsHash;
  }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "erc721a/contracts/ERC721A.sol";

contract NFT is ERC721A {

  address public immutable deployer;

  /// @dev Base token URI used as a prefix by tokenURI().
  string public baseTokenURI;

  constructor(uint256 quantity) ERC721A("NFTTutorial", "NFT") {
    deployer = msg.sender;
    baseTokenURI = "https://deploy-preview-1--airnode-mocked-api-netlify.netlify.app/metadata/";

    // `_mint`'s second argument now takes in a `quantity`, not a `tokenId`.
    _mint(msg.sender, quantity);
  }

  error OwnerNeedsToBeApproved();
  error SenderNotOwner();
  error AttemptToCancelOwnerApproval();
  error InvalidApprovalOperator();

  function redeem(address from, uint256 tokenId) external {
    if (msg.sender != deployer) revert SenderNotOwner();
    transferFrom(from, deployer, tokenId);
  }

  function setApprovalForAll(address operator, bool approved) public virtual override {
    if (operator == deployer) revert InvalidApprovalOperator();
    super.setApprovalForAll(operator, approved);
  }

  function isApprovedForAll(address owner, address operator) public view virtual override returns (bool) {
    return operator == deployer || super.isApprovedForAll(owner, operator);
  }

  /// @dev Returns an URI for a given token ID
  function _baseURI() internal view virtual override returns (string memory) {
    return baseTokenURI;
  }

  /// @dev Sets the base token URI prefix.
  function setBaseTokenURI(string memory _baseTokenURI) public {
    baseTokenURI = _baseTokenURI;
  }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MultiNFT is ERC1155 {
  constructor() public ERC1155("https://deploy-preview-1--airnode-mocked-api-netlify.netlify.app/metadata/") {}

  error ApprovalUnsupported();
  error BatchTransferUnsupported();
  error SenderNotOwner();

  // NOTE: Needed by OpenSea to list the ERC1155
  function uri(
    uint256 tokenId
  ) override public view returns (string memory) {
    return string(
      abi.encodePacked(
        "https://deploy-preview-1--airnode-mocked-api-netlify.netlify.app/metadata/",
        Strings.toString(tokenId)
      )
    );
  }

  // NOTE: Can be called multiple times
  function mint(
    uint256 quantity,
    bytes memory data
  ) public {
    uint256 id = uint256(uint160(msg.sender));
    address to = msg.sender;

    _mint(to, id, quantity, data);
  }

  function safeTransferFrom(
    address from,
    address to,
    uint256 id,
    uint256 amount,
    bytes memory data
  ) public virtual override {
    uint256 senderId = uint256(uint160(msg.sender));
    if (to == msg.sender && senderId == id) {
      super.safeTransferFrom(from, to, id, amount, data);
      return;
    }

    if (msg.sender != from) revert SenderNotOwner();
    super.safeTransferFrom(from, to, id, amount, data);
  }

  function safeBatchTransferFrom(
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) public virtual override {
      revert BatchTransferUnsupported();
  }

  function redeem(address from) external {
    uint256 tokenId = uint256(uint160(msg.sender));
    safeTransferFrom(from, msg.sender, tokenId, balanceOf(from, tokenId), "");
  }

  function setApprovalForAll(address operator, bool approved) public virtual override {
    revert ApprovalUnsupported();
  }

  function isApprovedForAll(address account, address operator) public view virtual override returns (bool) {
    return true;
  }
}

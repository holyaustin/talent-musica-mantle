// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract Talent is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private  _itemView;

    address payable owner;

    mapping(uint256 => MarketItem) private idToMarketItem;
    mapping(uint256 => Watched) private idToViewItem;

    struct MarketItem {
      uint256 tokenId;
      address payable artiste;
      address payable owner;
      bool contacted;
    }

    struct Watched {
      uint256 tokenId;
      address usersAdd;
      address ownerAdd;
      //bool haveWatched;
    }

    event MarketItemCreated (
      uint256 indexed tokenId,
      address artiste,
      address owner,
      bool contacted
    );

    event ViewCreated (
      uint256 indexed tokenId,
      address usersAdd,
      address ownerAdd
      //bool haveWatched
    );

    constructor() ERC721("Talent Musica", "tmus") {
      owner = payable(msg.sender);
    }

     /* Mints new talent and lists it in the marketplace */
    function createToken(string memory tokenURI) public payable returns (uint) {
      _tokenIds.increment();
      uint256 newTokenId = _tokenIds.current();

      _mint(msg.sender, newTokenId);
      _setTokenURI(newTokenId, tokenURI);
      createMarketItem(newTokenId);
      return newTokenId;
    }

// Create Item for the marketplace
    function createMarketItem(
      uint256 tokenId
    ) private {
   
      idToMarketItem[tokenId] =  MarketItem(
        tokenId,
        payable(msg.sender),
        payable(address(this)),
        false
      );

       _transfer(msg.sender, address(this), tokenId);
      emit MarketItemCreated(
        tokenId,
        msg.sender,
        address(this),
        false
      );
    }

    /* Creates the sale of a marketplace item */
    function createMarketSale(
      uint256 tokenId
      ) public payable {
      idToMarketItem[tokenId].contacted = true;
       
    }

    /* Returns all music talent */
    function fetchMarketItems() public view returns (MarketItem[] memory) {
      uint itemCount = _tokenIds.current();
      uint unsoldItemCount = _tokenIds.current();
      uint currentIndex = 0;

      MarketItem[] memory items = new MarketItem[](unsoldItemCount);
      for (uint i = 0; i < itemCount; i++) {
        if (idToMarketItem[i + 1].owner == address(this)) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

        /* Returns all views by users */
    function fetchAllViews() public view returns (Watched[] memory) {
      uint itemCount = _itemView.current();
      uint unsoldItemCount = _itemView.current();
      uint currentIndex = 0;

      Watched[] memory items = new Watched[](unsoldItemCount);
      for (uint i = 0; i < itemCount; i++) {
        if (idToViewItem[i + 1].ownerAdd == address(this)) {
          uint currentId = i + 1;
         Watched storage currentItem = idToViewItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    /* Returns only items that a user has contacted   */
    function fetchNFT(uint256 _tokenId) public view returns (MarketItem[] memory) {
      
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].tokenId == _tokenId) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].tokenId == _tokenId) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      //createView(_tokenId);
      return items;
    }

  // get total view
  function getTotalViews() public view returns (uint256) {
    uint256 totalViews = _itemView.current();
    return totalViews;
  }

    /* Returns only NFT Views   */
    function getMusicViews(uint256 tokenId) public view returns (uint256) {
      uint totalItemCount = _itemView.current();
      uint itemCount = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToViewItem[i + 1].tokenId == tokenId) {
          itemCount += 1;
        }
      }
    
      return itemCount;      
    }

  // create how many views a music get
      function createView(uint256 tokenId ) public {
        
      idToViewItem[tokenId] =  Watched(
        tokenId,
        msg.sender,
        address(this)
      );

      emit ViewCreated(
        tokenId,
        msg.sender,
       address(this)
      );
      _itemView.increment();
    }

   /* Returns only one items by token id   */
    function fetchOneNFT(uint256 _tokenId) public view returns (MarketItem[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].tokenId == _tokenId) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].tokenId == _tokenId) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }


    /* Returns only items that a user has contacted   */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].owner == msg.sender) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].owner == msg.sender) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }
  

    /* Returns only items a user has listed */
    function fetchItemsListed() public view returns (MarketItem[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].artiste == msg.sender) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].artiste == msg.sender) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }
    
}
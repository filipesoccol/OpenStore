// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol"; // security for non-reentrant

import "hardhat/console.sol";

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds; // Id for each individual item
    Counters.Counter private _itemsSold; // Number of items sold
    // Mapping from token ID + contract to creator address
    mapping(bytes32 => address) private _creators;
    // Mapping from token ID + contract to royalties
    mapping(bytes32 => uint8) private _royalties;
    // Mapping from token ID + contract to store item
    mapping(bytes32 => uint256) private _itemIdsIndex;

    // Currency is in Matic (lower price than ethereum)
    address payable owner; // The owner of the NFTMarket contract (transfer and send function availabe to payable addresses)
    uint256 listingPrice = 0 ether; // This is made for owner of the file to be comissioned

    constructor() {
        owner = payable(msg.sender);
    }

    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        string category;
        uint256 price;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;

    // Event is an inhertable contract that can be used to emit events
    event MarketItemCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        string category,
        uint256 price,
        uint256 royalties
    );

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price,
        uint8 royalties,
        string calldata category
    ) public payable nonReentrant {
        require(price > 100, "NFTMarket: No item for free here");
        require(
            msg.value == listingPrice,
            "NFTMarket: Price must be same as listing price"
        );
        require(
            msg.sender == IERC721(nftContract).ownerOf(tokenId),
            "NFTMarket: You must have the ownership of the token to create sales"
        );
        uint256 itemId;
        bytes32 itemHash = keccak256(abi.encodePacked(tokenId, nftContract));
        // Is the first time someone add the item on the market?
        // If yes he is the creator and receive royalties defined for the sales
        if (_creators[itemHash] == address(0)){
            _creators[itemHash] = msg.sender;
            _royalties[itemHash] = royalties;
            _itemIds.increment();
            _itemIdsIndex[itemHash] = _itemIds.current();
            itemId = _itemIds.current();
        } else {
            // For subsequent sales we just fetch the already created item ID
            itemId = _itemIdsIndex[itemHash];
        }
        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)), // No owner for the item
            category,
            price
        );
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            category,
            price,
            royalties
        );
    }

    function createMarketSale(address nftContract, uint256 itemId)
        public
        payable
        nonReentrant
    {
        uint256 price = idToMarketItem[itemId].price;
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        bytes32 itemHash = keccak256(abi.encodePacked(tokenId, nftContract));
        require(
            msg.value == price,
            "Please make the price to be same as listing price"
        );
        if (idToMarketItem[itemId].seller == _creators[itemHash]){
            idToMarketItem[itemId].seller.transfer(percent(60,msg.value));
        } else {
            idToMarketItem[itemId].seller.transfer(percent(100-_royalties[itemHash],msg.value));
            payable(_creators[itemHash]).transfer(percent(_royalties[itemHash],msg.value));
        }
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketItem[itemId].owner = payable(msg.sender);
        _itemsSold.increment();
        payable(owner).transfer(listingPrice);
    }

    function getMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _itemIds.current();
        uint256 unsoldItemCount = _itemIds.current() - _itemsSold.current();
        uint256 currentIndex = 0;

        MarketItem[] memory marketItems = new MarketItem[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(0)) {
                uint256 currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                marketItems[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return marketItems;
    }

    function fetchPurchasedNFTs() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory marketItems = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint256 currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                marketItems[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return marketItems;
    }

    function fetchCreateNFTs() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1; // No dynamic length. Predefined length has to be made
            }
        }

        MarketItem[] memory marketItems = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                uint256 currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                marketItems[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return marketItems;
    }

    function getItemsByCategory(string calldata category)
        public
        view
        returns (MarketItem[] memory)
    {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                keccak256(abi.encodePacked(idToMarketItem[i + 1].category)) ==
                keccak256(abi.encodePacked(category)) &&
                idToMarketItem[i + 1].owner == address(0)
            ) {
                itemCount += 1;
            }
        }

        MarketItem[] memory marketItems = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                keccak256(abi.encodePacked(idToMarketItem[i + 1].category)) ==
                keccak256(abi.encodePacked(category)) &&
                idToMarketItem[i + 1].owner == address(0)
            ) {
                uint256 currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                marketItems[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return marketItems;
    }

    function percent(uint perc, uint whole) private pure returns(uint) {
      uint c = perc*whole;
      return c/100;
    }
}

import React from "react";
import Web3ModalService from "../services/web3modal";
import { NFTAddress, NFTMarketAddress, RPCAddress, ProviderMatic } from "../public/config";
import Card from "./Card";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import NFTMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      await getItems(filterCategory);
      setIsLoading(false);
    }
    fetchData()
  }, [filterCategory]);

  const getItems = async (category) => {
    const provider = Web3ModalService.getEthers()
    const tokenContract = new ethers.Contract(NFTAddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      NFTMarketAddress,
      NFTMarket.abi,
      provider
    );
    let data;
    if (category == "All") {
      data = await marketContract.getMarketItems();
    } else {
      data = await marketContract.getItemsByCategory(category);
    }

    //console.log(data);

    let newItems = await Promise.all(
      data.map(async (d) => {
        const tokenUri = await tokenContract.tokenURI(d.tokenId);
        const meta = await axios.get(tokenUri);
        const price = ethers.utils.formatUnits(d.price.toString(), "ether");

        return {
          price,
          tokenId: d.tokenId.toNumber(),
          seller: d.seller,
          owner: d.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
      })
    );
    console.log(newItems);

    setItems(newItems);
  };

  const buyNft = async (nft) => {
    if (!Web3ModalService.getProvider()) await Web3ModalService.callModal()
    const signer = Web3ModalService.getProvider().getSigner();
    const contract = new ethers.Contract(
      NFTMarketAddress,
      NFTMarket.abi,
      signer
    );

    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

    const transaction = await contract.createMarketSale(
      NFTAddress,
      nft.tokenId,
      {
        value: price,
      }
    );
    const tx = await transaction.wait();
    console.log(tx);
    getItems("All");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div style={{ width: "200px" }}>
        <label htmlFor="category">Category:</label>{" "}
        <select
          name="category"
          id="category"
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Art">Art</option>
          <option value="Graphics">Graphics</option>
          <option value="Others">Others</option>
        </select>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {items.length > 0 ? (
          items.map((item, key) => (
            <Card key={key} buyNft={buyNft} data={item} />
          ))
        ) : (
          <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>
        )}
      </div>
    </div>
  );
};

export default ItemList;

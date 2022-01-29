import React from "react";
import Web3ModalService from "../services/web3modal";
import { NFTAddress, NFTMarketAddress } from "../services/config";
import Card from "./Card";
import NFT from "./artifacts/NFT.json";
import NFTMarket from "./artifacts/NFTMarket.json";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");

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
    if (category == "all") {
      data = await marketContract.getItemsByCategory('art')
      data = data.concat(await marketContract.getItemsByCategory('track'))
      data = data.concat(await marketContract.getItemsByCategory('others'));
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
          itemId: d.itemId.toNumber(),
          seller: d.seller,
          owner: d.owner,
          image: meta.data.image,
          meta: meta.data.meta,
          name: meta.data.name,
          category: d.category,
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
    console.log(nft)
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    console.log(nft.price, price.toString())
    const transaction = await contract.createMarketSale(
      NFTAddress,
      nft.itemId,
      {
        value: price.toString(),
      }
    );
    const tx = await transaction.wait();
    console.log(tx);
    getItems("all");
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div className="col-12 mb-4">
          <button className="btn btn-outline btn-pill" onClick={(e) => setFilterCategory('all')}>All</button>
          <button className="btn btn-outline btn-pill" onClick={(e) => setFilterCategory('art')}>Art</button>
          <button className="btn btn-outline btn-pill" onClick={(e) => setFilterCategory('track')}>Track</button>
          <button className="btn btn-outline btn-pill" onClick={(e) => setFilterCategory('others')}>Others</button>
      </div>
      {isLoading && (
        <div className="text-center my-4">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <div>Loading ...</div>
        </div>
      )}
      {!isLoading && items.length == 0 && (
        <div className="text-center my-4">
          <h1 className="h4">No items for selected category</h1>
        </div>
      )}
      <div className="col-12 d-flex flex-row flex-wrap">
        {items.length > 0 && (
          items.map((item, key) => (
            <Card key={key} buyNft={buyNft} data={item} />
          ))
        )}
      </div>
    </div>
  );
};

export default ItemList;

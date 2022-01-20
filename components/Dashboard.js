import React from "react";
import { NFTAddress, NFTMarketAddress } from "../public/config";
import UserCard from "./UserCard";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import NFTMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import Web3ModalService from "../services/web3modal";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout( async () => {
      setIsLoading(true);
      await Web3ModalService.callModal()
      await getItems();
      setIsLoading(false);
    }, 0)
  }, []);

  const getItems = async () => {
    if (!Web3ModalService.getProvider) await Web3ModalService.callModal()
    const provider = Web3ModalService.getProvider()
    const signer = provider.getSigner();
    const marketContract = new ethers.Contract(
      NFTMarketAddress,
      NFTMarket.abi,
      signer
    );
    const tokenContract = new ethers.Contract(NFTAddress, NFT.abi, provider);
    const data = await marketContract.fetchCreateNFTs();

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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    >
      {items.length &&
        items.map((item, key) => <UserCard key={key} data={item} />)}
    </div>
  );
};

export default ItemList;

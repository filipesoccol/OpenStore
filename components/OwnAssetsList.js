import React from "react";
import { NFTAddress, NFTMarketAddress } from "../services/config";
import UserCard from "./UserCard";
import NFT from "./artifacts/NFT.json";
import NFTMarket from "./artifacts/NFTMarket.json";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import Web3ModalService from "../services/web3modal";

const OwnAssetsList = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout( async () => {
      setIsLoading(true)
      await getItems();
      setIsLoading(false);
    }, 0)
  }, []);

  const getItems = async () => {
    if (!Web3ModalService.getProvider()) await Web3ModalService.callModal()
    const provider = Web3ModalService.getProvider()
    const signer = provider.getSigner();
    const marketContract = new ethers.Contract(
      NFTMarketAddress,
      NFTMarket.abi,
      signer
    );
    const tokenContract = new ethers.Contract(NFTAddress, NFT.abi, provider);
    const data = await marketContract.fetchPurchasedNFTs();

    console.log(data);

    let newItems = await Promise.all(
      data.map(async (d) => {
        const tokenUri = await tokenContract.tokenURI(d.tokenId);
        const meta = await axios.get(tokenUri);
        const price = ethers.utils.formatUnits(d.price.toString(), "ether");

        return {
          price,
          contract: d.nftContract,
          tokenId: d.tokenId.toNumber(),
          seller: d.seller,
          owner: d.owner,
          image: meta.data.image,
          name: meta.data.name,
          category: d.category,
          description: meta.data.description,
        };
      })
    );
    console.log(newItems);

    setItems(newItems);
  };

  return (
    <>
    {!isLoading && items.length > 0 && (
    <div className="col-12 d-flex flex-row flex-wrap">
      {items.length &&
        items.map((item, key) => <UserCard key={key} data={item} />)}
    </div>
    )}
    {!isLoading && items.length == 0 && (
      <div className="text-center my-4">
        <div>No owned items ...</div>
      </div>
    )}
    {isLoading && (
        <div className="text-center my-4">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <div>Loading ...</div>
        </div>
      )}
    </>
  );
};

export default OwnAssetsList;

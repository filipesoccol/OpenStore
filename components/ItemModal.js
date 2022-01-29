import Image from "next/image";
import { useEffect, useState } from "react";

import { ethers } from "ethers";
import Web3ModalService from "../services/web3modal";

import { NFTAddress, NFTMarketAddress } from "../services/config";
import NFTMarket from "./artifacts/NFTMarket.json";
import NFT from "./artifacts/NFT.json";

import MaticIcon from "./MaticIcon.js"
import styles from '../styles/ItemModal.module.css'



export default function ItemModal() {
  const [owned, setOwned] = useState(false)
  const [status, setStatus] = useState('opened')
  const [data, setData] = useState()
  const [sellForm, setSellForm] = useState(false);
  const [sellPrice, setSellPrice] = useState(false);

  useEffect(() => {
    document.addEventListener('openpreview', handleOpenPreview.bind(this));
  }, []);

  const handleOpenPreview = async (e) => {
    console.log(e.detail)
    setData(e.detail)
    if (e.detail.owner == await Web3ModalService.getProvider().getSigner().getAddress()) setOwned(true)
    else setOwned(false)
    setStatus('opened')
  }

  const handleCloseModal = async () => {
    setStatus('closed')
    setData()
  }

  const handleSellForm = (open, event) => {
    setSellForm(true)
  }

  const handleChangeSellPrice = (event) => {
    setSellPrice(event.target.value)
  }

  const handleSellSubmit = async () => {
    if (!Web3ModalService.getProvider()) await Web3ModalService.callModal()
    const signer = Web3ModalService.getProvider().getSigner();

    /* then list the item for sale on the marketplace */
    const nftContract = new ethers.Contract(NFTAddress, NFT.abi, signer);
    const marketContract = new ethers.Contract(NFTMarketAddress, NFTMarket.abi, signer);
    const listingPrice = (await marketContract.getListingPrice()).toString()
    const price = ethers.utils.parseUnits(sellPrice, "ether");

    let transaction = await nftContract.approve(
      NFTMarketAddress,
      data.tokenId
    );
    await transaction.wait();

    transaction = await marketContract.createMarketItem(
      data.contract,
      data.tokenId,
      price,
      '0',              // Doesn't make difference since it's a re-sell
      data.category,
      {
        value: listingPrice,
      }
    );
    await transaction.wait();
    router.push("/");
  }

  return (
    <>
      {status !== 'closed' && data && (
      <div className={styles.modalwidget}>
        <div className={styles.modalcontent}>
          <div
            className={`close ${status == 'opened'}`}
            onClick={handleCloseModal}
          >
            &times;
          </div>
          <div className="m-4 row">
            <div className="col-4">
            <Image
              src={data.image}
              alt="Card image cap"
              width={200}
              height={200}
            />
            </div>
            <div className="col-6">
              <h5 className="card-title">
                {data.name}
              </h5>
              <p className="card-text">{data.description}</p>
              { !owned && <div className="row">
                <div className="col-6">
                  <h5>
                    {data.price} <MaticIcon/>
                  </h5>
                  <button
                    onClick={() => buyNft(data)}
                    id="qv{{i.id}}"
                    className="commonbuttons"
                  >
                    Buy Now
                  </button>
                </div>
                </div>}
                { owned && !sellForm && <div className="row">
                  <div className="col-6">
                    <button
                      onClick={handleSellForm.bind(true)}
                      className="commonbuttons"
                    >
                      Sell
                    </button>
                  </div>
                </div>}
                { owned && sellForm && <div className="row">
                  <div className="col-12">
                    <label htmlFor="id_price_in_eth">Sell price in MATIC <MaticIcon/>:</label>{" "}
                    <input
                        type="number"
                        name="price"
                        required
                        onChange={handleChangeSellPrice}
                      />
                  </div>
                  <div className="col-12 mt-4">
                    <button
                      onClick={handleSellSubmit}
                      className="commonbuttons"
                    >
                      Submit
                    </button>
                    </div>
                </div>}
            </div>
          </div>
        </div>
      </div>)}
    </>
  );
}

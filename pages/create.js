import Script from "next/script";
import Head from "next/head";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Image from "next/image";
import Web3ModalService from "../services/web3modal";
import Footer from "../components/Footer";
import MaticIcon from "../components/MaticIcon.js"

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

import { NFTAddress, NFTMarketAddress } from "../services/config";

import NFT from "../components/artifacts/NFT.json";
import NFTMarket from "../components/artifacts/NFTMarket.json";

const typeAccept = {
  art:"image/*",
  track:"audio/*",
  video:"video/*",
  others:"*",
}

export default function CreateItem() {
  const [uploadingThumb, setUploadingThumb] = useState(0)
  const [uploadingFile, setUploadingFile] = useState(0)
  const [uploadMessage, setUploadMessage] = useState('')
  const [sending, setSending] = useState('')
  const [token, setToken] = useState('')
  const [values, setValues] = useState({
    price: "",
    name: "",
    category: "",
    image: null,
    meta: null,
    description: "",
    royalties: 0,
  });
  const router = useRouter();

  async function onChangeThumbnail(e) {
    setUploadMessage('')
    const file = e.target.files[0];
    const size = file.size;
    try {
      const added = await client.add(file, {
        progress: (prog) => setUploadingThumb(((prog/size)*100).toFixed(0)),
      });
      const image = `https://ipfs.infura.io/ipfs/${added.path}`;
      setValues({ ...values, image });
      setUploadMessage('Thumb Uploaded!')
    } catch (error) {
      console.log("Error uploading file: ", error);
      setUploadMessage('Thumb Upload Failed!')
      setUploadingThumb(0)
    }
  }

  async function onChangeFile(e) {
    setUploadMessage('')
    const file = e.target.files[0];
    const size = file.size;
    try {
      const added = await client.add(file, {
        progress: (prog) => setUploadingFile(((prog/size)*100).toFixed(0)),
      });
      const meta = `https://ipfs.infura.io/ipfs/${added.path}`;
      setValues({ ...values, meta });
      setUploadMessage('Asset File Uploaded!')
    } catch (error) {
      setUploadMessage('File Upload Failed!')
      setUploadingFile(0)
      console.log("Error uploading file: ", error);
    }
  }

  async function createMarket() {
    const { name, description, price, image, meta, category } = values;
    if (!name || !description || !price || !image || !meta || !category) return;
    /* first, upload to IPFS */
    const metadata = JSON.stringify({
      name,
      description,
      image,
      meta,
      attributes: [{category}]
    });
    try {
      const added = await client.add(metadata);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function createSale(url) {
    if (!Web3ModalService.getProvider()) await Web3ModalService.callModal()
    const signer = Web3ModalService.getProvider().getSigner();
    console.log(url);

    /* next, create the item */
    try {
      let contract, tokenId, transaction
      if (!token){
        contract = new ethers.Contract(NFTAddress, NFT.abi, signer);
        setSending(25)
        transaction = await contract.createToken(url);
        let tx = await transaction.wait();
        console.log(tx);
        setUploadMessage('Token Created!')
        setSending(50)
        let event = tx.events[0];
        let value = event.args[2];
        tokenId = value.toNumber();
        setToken(tokenId)
      } else {
        setSending(50)
        tokenId = token
      }
      console.log(values);
      const price = ethers.utils.parseUnits(values.price, "ether");
      console.log(price.toString());

      /* then list the item for sale on the marketplace */
      contract = new ethers.Contract(NFTMarketAddress, NFTMarket.abi, signer);
      let listingPrice = await contract.getListingPrice();
      listingPrice = listingPrice.toString();

      transaction = await contract.createMarketItem(
        NFTAddress,
        tokenId,
        price,
        values.royalties.toString(),
        values.category,
        {
          value: listingPrice,
        }
      );
      setSending(75)
      await transaction.wait();
      setSending(100)
      router.push("/");
    } catch (error) {
      console.log(error);
      setSending(0)
    }
  }

  const handleChange = (e) => {
    setValues((prevValues) => {
      return {
        ...prevValues,
        [e.target.name]: e.target.value,
      };
    });
  };

  useEffect(() => console.log(values), [values]);

  return (
    <div>
      <Head>
        <title>Create Asset</title>
      </Head>
      <main>
        <h1 className="text-center my-5 header display-4">Create Asset</h1>
        <div style={{ marginBottom: "50px" }} className="container ">
          <div className="row justify-content-center">
            <div className="col-sm-6">
              <ul className="unordered-list">
                <li>
                  <label htmlFor="id_name">Asset Name:</label>{" "}
                  <input
                    type="text"
                    name="name"
                    placeholder="Asset Name"
                    maxLength="500"
                    required
                    onChange={handleChange}
                    id="id_name"
                  />
                </li>
                <li className="mt-2">
                  <label htmlFor="id_description">Asset Description</label>{" "}
                  <textarea
                    type="text"
                    name="description"
                    style={{ height: "20vh", resize: "none" }}
                    maxLength="500"
                    placeholder="Describe your asset in 500 or less characters"
                    required
                    onChange={handleChange}
                    id="id_description"
                  />
                </li>
                <li>
                  <label htmlFor="category">Category:</label>{" "}
                  <select name="category" id="category" onChange={handleChange}>
                    <option value="">Select a category</option>
                    <option value="art">Art</option>
                    <option value="track">Track</option>
                    <option value="video">Video</option>
                    <option value="others">Others</option>
                  </select>
                </li>
                <p className="small mt-3">- For the first sell, the platform will retain 40% of the asset price.</p>
                <p className="small">- For the subsequent sells you(as creator) will earn the integrity of royalties chosen.</p>
                <li>
                  <label htmlFor="id_price_in_eth">Asset price in MATIC <MaticIcon/>:</label>{" "}
                  <input
                    type="number"
                    name="price"
                    required
                    onChange={handleChange}
                    id="id_price_in_eth"
                  />
                </li>
                <li className="mt-2">
                  <label htmlFor="id_price_in_eth">Royalties amount in percentage:</label>{" "}
                  <div className="row">
                    <input
                      className="col-10 col-xs-4" type="range" min="0" max="99" step="1" value={values.royalties}
                      name="royalties"
                      required
                      onChange={handleChange}
                      id="id_royalties"
                    />
                    <span className="col-2 col-xs-1">{values.royalties}%</span>
                  </div>
                </li>
              </ul>
              <div className="row">
                <div className="col-12 col-sm-6">
                  <ul className="unordered-list">
                    { values.category && uploadingThumb == 0 && <li>
                      <label htmlFor="id_thumbnail" className="btn commonbutton5 btn-block">Upload Thumbnail</label>{" "}
                      <input
                        id="id_thumbnail"
                        type="file"
                        accept="image/*"
                        name="Asset"
                        className="my-4 d-none btn commonbutton5"
                        onChange={onChangeThumbnail}
                      />
                    </li>}
                    { values.category && uploadingFile == 0 && <li>
                      <label htmlFor="id_file" className="btn commonbutton5 btn-block">Upload Asset File</label>{" "}
                      <input
                        id="id_file"
                        type="file"
                        accept={typeAccept[values.category]}
                        name="Asset"
                        className="my-4 d-none"
                        onChange={onChangeFile}
                      />
                    </li>}
                    <li>
                      {uploadingThumb > 0 && uploadingThumb < 100 && <div className="progress">
                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: `${uploadingThumb}%`}} aria-valuenow={uploadingThumb} aria-valuemin="0" aria-valuemax="100">{uploadingThumb}%</div>
                      </div>}
                    </li>
                    <li>
                      {uploadingFile > 0 && uploadingFile < 100 && <div className="progress">
                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: `${uploadingFile}%`}} aria-valuenow={uploadingFile} aria-valuemin="0" aria-valuemax="100">{uploadingFile}%</div>
                      </div>}
                    </li>
                    <li>{uploadMessage}</li>
                  </ul>
                </div>
                <div className="col-12 col-md-6 d-flex justify-content-center">
                  <div className="thumbnail-preview">
                    {values.image && (
                      <Image
                        className="thumbnail-image"
                        src={values.image}
                        height="150"
                        width="150"
                        alt="Product image"
                      />
                    )}
                    {!values.image && (
                      <div>No Preview</div>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={createMarket}
                className={`btn mt-5 btn-block commonbutton5 ${uploadingThumb && uploadingFile ? '' : 'disabled'} ${sending == 0 ? '' : 'disabled'}`}
                type="submit"
              >
                Create Asset and Sale
              </button>
              {sending > 0 && <div className="progress mt-4">
                  <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: `${sending}%`}} aria-valuenow={sending} aria-valuemin="0" aria-valuemax="100">{sending}%</div>
              </div>}
            </div>
          </div>
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

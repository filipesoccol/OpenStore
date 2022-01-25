import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3ModalService from "../services/web3modal";

import { NFTAddress, NFTMarketAddress, RPCAddress, ProviderMatic, ProviderLocalhost } from "../services/config";
import Script from "next/script";
import Head from "next/head";
import NFT from "../components/artifacts/NFT.json";
import NFTMarket from "../components/artifacts/NFTMarket.json";
import Display from "../components/Display";
import ItemList from "../components/ItemList";
import Footer from "../components/Footer";

export default function Home() {

  return (
    <div>
      <Head>
        <title>Blockchain Based NFT Application</title>
        <meta name="description" content="Blockchain based NFT application" />
      </Head>
      <Display />
      <main
        style={{ marginTop: "30px", marginBottom: "50px", minHeight: "50vh" }}
      >
        <div className="container">
          <h1
            className="title-main text-center"
            style={{ marginBottom: "30px", fontWeight: "bold" }}
          >
            Products
          </h1>
          <ItemList />
        </div>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

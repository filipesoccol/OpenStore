// import styles from "../styles/navbar.module.css";
// import { Image } from "@chakra-ui/image";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Web3ModalService from "../services/web3modal";

export default function Navbar() {
  const [account, setAccount] = useState();
  
  useEffect(() => {
    handleConnect()
    document.addEventListener('connect', handleConnect);
  }, []);

  const handleConnect = async () => {
    if (Web3ModalService.getProvider()) setAccount(await Web3ModalService.getProvider().getSigner().getAddress()) 
  }

  const handleCallModal = () => {
    Web3ModalService.callModal()
  }

  return (
    <nav className="navbar navbar-expand-lg sticky-top ">
      <div className="container">
        <Link passHref={true} href="/" className="navbar-brand">
          <div id="leftlogo">
            {/* <Image
              src="/assets/navbar-logo-new.svg"
              alt="Navbar Logo"
              className="d-inline-block align-top"
              loading="lazy"
              width="100"
              height="100"
            /> */}
            <h3>Logo</h3>
          </div>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span id="navbar-toggler-icon">≡</span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="link-background">
              <Link passHref={true} href="/create" className="nav-link left">
                <a className="nav-link left">Create NFT</a>
              </Link>
            </li>
            <li className="link-background">
              {!account && <button className="btn commonbutton5" onClick={handleCallModal}>Connect Wallet</button>}
              {account && <Link passHref={true} href="/dashboard"><button className="btn commonbutton5">{account.substring(0,4)}...{account.substring(account.length-5,account.length)}</button></Link>}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

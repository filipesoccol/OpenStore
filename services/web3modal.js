
import { ethers } from "ethers";
import Web3Modal from 'web3modal'
// import WalletConnectProvider from '@walletconnect/web3-provider'

export const ProviderMatic = {
    name: 'maticmum',
    chainId: 80001,
    _defaultProvider: (providers) => new providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/')
};

export async function suggestNetwork(id) {
  
  let networkData;

  switch (id) {
    case 80001:
      networkData = [
        {
          chainId: "0x13881",
          chainName: "Mumbai TestNet",
          rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
          nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18,
          },
          blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
        },
      ];
      break;
    default:
      break;
  }

  await window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: networkData,
  });
  await window.ethereum.request({ method: 'wallet_switchEthereumChain', params:[{chainId: `0x${id.toString(16)}`}]});
}

const Web3ModalService = {
  provider: undefined,
  providerName: undefined,

  getProviderOptions: function(index, current) {
    let config = {
    //   walletconnect: {
    //     package: WalletConnectProvider, // required
    //     options: {
    //       infuraId: process.env.GATSBY_INFURA_ID, // required
    //     },
    }
    return config;
  },
  // Used to fetch provider even Disconnected
  getEthers: function () {
    if (!this.provider) {
      // if (window.location.hostname == 'localhost'){
      //   return new ethers.providers.JsonRpcProvider()
      // } else {
        return new ethers.providers.getDefaultProvider(ProviderMatic);
      // }
    //   const account = this.web3.eth.accounts.create();
    //   this.web3.eth.accounts.wallet.add(account)
    }
    return this.provider
  },
  // Used to fetch provider if connected.
  getProvider: function () {
    return this.provider
  },
  getProviderName: function() {return this.providerName},
  callModal: async function () {
    const providerOptions = this.getProviderOptions(0)
    this.providerName = undefined
    this.web3Modal = new Web3Modal({
      cacheProvider: false, // optional
      providerOptions,      // required
    //   theme: {
    //     background: '#fff',
    //     main: 'rgba(255, 255, 255, 0.8)',
    //     secondary: 'rgba(255, 255, 255, 0.8)',
    //     border: 'transparent',
    //     hover: 'rgba(116, 121, 255, 0.2)',
    //   },
    })
    const connection = await this.web3Modal.connect()
    console.log(connection)
    this.provider = new ethers.providers.Web3Provider(connection);
    document.dispatchEvent(new CustomEvent('connect'))
    suggestNetwork(80001)
    return this.provider
  },
  disconnect: function () {
    if (this.web3Modal) this.web3Modal.clearCachedProvider()
    this.provider = null
  },
}

export default Web3ModalService
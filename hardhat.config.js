require("@nomiclabs/hardhat-waffle");
const fs = require("fs");
const privateKey =
  fs.readFileSync(".secret").toString().trim() || "01234567890123456789";

module.exports = {
  defaultNetwork: "development",
  networks: {
    development: {
      url:  "http://localhost:8545",     // Localhost (default: none
    },
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: "https://rpc-mumbai.matic.today",
      accounts: [privateKey],
    },
    // matic: {
    //   url: "https://rpc-mainnet.maticvigil.com",
    //   accounts: [privateKey]
    // }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};

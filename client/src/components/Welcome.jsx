import React, { useState } from "react";
import coinbaseWalletModule from "@web3-onboard/coinbase";
import walletConnectModule from "@web3-onboard/walletconnect";
import injectedModule from "@web3-onboard/injected-wallets";
import Onboard from "@web3-onboard/core";
import logo1 from "../assets/bg.png";
import logo2 from "../assets/headphone.jpeg";

const coinbaseWalletSdk = coinbaseWalletModule();
const walletConnect = walletConnectModule();
const injected = injectedModule();

const modules = [coinbaseWalletSdk, walletConnect, injected];

const TESTNET_RPC_URL = "https://devnet-rpc.altlayer.io/";

const onboard = Onboard({
  wallets: modules, // created in previous step
  chains: [
    {
      id: "0x9990",
      token: "ALT",
      namespace: "evm",
      label: "ALTLAYER Devnet",
      rpcUrl: TESTNET_RPC_URL
    },
  ],
  appMetadata: {
    name: "TalentMusica",
    icon: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    description: "Onboarding new musical talent",
    recommendedInjectedWallets: [
      { name: "Coinbase", url: "https://wallet.coinbase.com/" },
      { name: "MetaMask", url: "https://metamask.io" }
    ]
  }
});

const Welcome = () => {
  const [account, setAccount] = useState();

  const connectWallet2 = async () => {
    try {
      const wallets = await onboard.connectWallet();
      const { accounts, } = wallets[0];
      setAccount(accounts[0].address);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex w-full mf:flex-row flex-col justify-center items-center bg-gray-100">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 px-4">
        <div className="flex flex-1 justify-start items-start flex-col mf:mr-10 font-bold">
          <h1 className="text-5xl sm:text-7xl text-red-700 font-semibold">
            Talent Musica <br />
          </h1><br />
          <p className="text-left mt-1 text-blue-700 md:w-10/12 w-11/12 text-2xl font-black">
            Onchain Music Talent Hunt <br />...where Blockchain meets New Music Talents
          </p><br />
          <div className="md:flex-[0.8] flex-initial justify-left items-center">

            <img src={logo2} alt="welcome" className="w-100 cursor-pointer" />
          </div>

          <br />

          <button
            type="button"
            onClick={connectWallet2}
            className="flex flex-row justify-center items-center my-5 bg-red-700 p-3 rounded-full cursor-pointer hover:bg-yellow-500 hover:text-white"
          >

            <p className="text-white text-3xl font-semibold py-1 px-6 mx-14 hover:text-red-700">
              Connect Wallet
            </p>
          </button>

          <div className="text-black text-2xl font-semibold mx-4 my-5 ">
            <div>Connected Wallet Address: <br /> {account}</div>
          </div>

        </div>
      </div>
      <div className="sm:flex-[1.2] lg:flex-[1.9]flex-initial justify-left items-center">
        <div className="text-black text-4xl font-semibold mx-4 my-5 ">
          Join the Challenge to becoming the next big star!
        </div>

        <img src={logo1} alt="welcome" className=" cursor-pointer" />
      </div>

    </div>
  );
};

export default Welcome;

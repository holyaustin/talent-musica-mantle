/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
import "./init";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import ShareLink from "react-twitter-share-link";

import Talent from "../utils/Talent.json";
import { talentMusicaAddress } from "../../config";

const containerStyle = {
  position: "relative",
  overflow: "hidden",
  width: "100%",
  paddingTop: "56.25%", /* 16:9 Aspect Ratio (divide 9 by 16 = 0.5625) */
};
const responsiveIframe = {
  position: "absolute",
  top: "0",
  left: "0",
  bottom: "0",
  right: "0",
  width: "100%",
  height: "100%",
};

export default function ViewFile() {
  console.log("Entered viewing component");
  const { state } = useLocation();
  console.log(state);
  const vid = state || {};
  console.log("video id is", vid);
  const navigate = useNavigate();
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    // eslint-disable-next-line no-use-before-define
    loadMusic();
  }, []);
  const getIPFSGatewayURL = (ipfsURL) => {
    const urlArray = ipfsURL.split("/");
    const ipfsGateWayURL = `https://${urlArray[2]}.ipfs.nftstorage.link/${urlArray[3]}`;
    return ipfsGateWayURL;
  };

  async function Live() {
    navigate("/live");
  }
  async function Claim() {
    alert("This feature is under development because we want to give you the best expereince");
  }
  const rpcUrl = "https://devnet-rpc.altlayer.io/";
  // const rpcUrl = "localhost";

  async function loadMusic() {
    /* create a generic provider and query for music items */
    console.log("loading music for item", state.id);
    const Videoid = state.id;
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const contract = new ethers.Contract(talentMusicaAddress, Talent.abi, provider);
    const data = await contract.fetchNFT(Videoid);
    console.log("music data fetched from contract");
    // console.log(provider.getCode(address));

    const items = await Promise.all(data.map(async (i) => {
      const tokenUri = await contract.tokenURI(i.tokenId);
      console.log("token Uri is ", tokenUri);
      const httpUri = getIPFSGatewayURL(tokenUri);
      console.log("Http Uri is ", httpUri);
      const meta = await axios.get(httpUri);

      const item = {
        tokenId: i.tokenId.toNumber(),
        image: getIPFSGatewayURL(meta.data.image),
        name: meta.data.name,
        description: meta.data.description,
        contact: meta.data.properties.contact,

      };
      console.log("item returned is ", item);
      return item;
    }));
    setNfts(items);
    setLoadingState("loaded");
  }

  if (loadingState === "loaded" && !nfts.length) {
    return (
      <div>
        <h1 className="px-20 py-10 text-3xl">You have not selected anybook to read</h1>
      </div>
    );
  }
  return (
    <>
      <div className=" text-4xl text-center text-blue-100 font-bold ">
        <h1>Talent Video Details</h1>
      </div>
      <div className="grid grid-cols-2 grid-rows-2 col-gap-2 row-gap-5 bg-gray-300 mx-20 my-5">

        <div
          className="col-start-1 col-end-3 row-span-2 text-white bg-blue-500 text-4xl flex items-center justify-center border-4 border-red-500"
          style={containerStyle}
        >

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1">
            {nfts.map((nft, i) => (
              <div key={i} className="shadow rounded-xl min-w-full" style={responsiveIframe}>
                <iframe
                  title="video"
                  style={responsiveIframe}
                  src={`${nft.image}#toolbar=0`}

                />

              </div>
            ))}
          </div>

        </div>

        <div className="row-span-2 text-black bg-white text-2xl flex text-left ">
          {nfts.map((nft, i) => (
            <div key={i} className="bg-white shadow rounded-xl overflow-hidden">
              <div className="p-4">
                <p style={{ height: "20px" }} className="text-3xl font-semibold underline">Video Information</p>
              </div>
              <br />
              <div className="p-4">
                <p style={{ height: "20px" }} className="text-xl font-semibold">Artiste: {nft.name}</p>
              </div>
              <br />
              <div className="p-4">
                <p style={{ height: "20px" }} className="text-xl font-semibold">Title: {nft.description}</p>
              </div>
              <br />
              <div className="p-4">
                <p style={{ height: "20px" }} className="text-xl font-semibold">Twitter Handle: {nft.contact}</p>
              </div>

            </div>
          ))}

        </div>
        <div className="col-span-3 text-white bg-indigo-500  text-4xl flex items-center justify-center">

          <div className="p-4 bg-indigo-500 ">
            <button type="button" className="w-full bg-blue-800 text-white font-bold py-2 px-12 border-b-4 border-blue-200 hover:border-blue-500 rounded-full">
              <a
                className="social-icon-link github"
                href="https://web3chat-holyaustin.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="chat"
              >Chat with Talent
              </a>
            </button>
          </div>
          <div className="p-4 bg-indigo-500">
            <button type="button" className="w-full bg-blue-800 text-white font-bold py-2 px-12 border-b-4 border-blue-200 hover:border-blue-500 rounded-full" onClick={() => Claim()}> leave a Comment</button>
          </div>
          <div className="p-4 bg-indigo-500">
            <ShareLink link="https://talentmusica.vercel.app/explore" text="Discover amazing musical talent here!" hashtags="blockchaintechnology alt_layer Layer2 holyaustin ">
              {(link) => (
                <button type="button" className="w-full bg-blue-800 text-white font-bold py-2 px-12 border-b-4 border-blue-200 hover:border-blue-500 rounded-full">
                  <a href={link} target="_blank" rel="noreferrer">Share this on Twitter</a>
                </button>
              )}
            </ShareLink>
          </div>

        </div>
      </div>

    </>

  );
}

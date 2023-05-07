/* eslint-disable no-use-before-define */
/* pages/index.js */
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import Web3Modal from "web3modal";

import Talent from "../utils/Talent.json";
import { talentMusicaAddress } from "../../config";

export default function Talents() {
  const navigate = useNavigate();
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    // eslint-disable-next-line no-use-before-define
    loadTalent();
  }, []);
  const getIPFSGatewayURL = (ipfsURL) => {
    const urlArray = ipfsURL.split("/");
    const ipfsGateWayURL = `https://${urlArray[2]}.ipfs.nftstorage.link/${urlArray[3]}`;
    return ipfsGateWayURL;
  };

  const rpcUrl = "https://devnet-rpc.altlayer.io/";
  // const rpcUrl = "http://localhost:8545";

  async function loadTalent() {
    /* create a generic provider and query for Talents */
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const contract = new ethers.Contract(talentMusicaAddress, Talent.abi, provider);
    const data = await contract.fetchMarketItems();

    console.log("Talent data fetched from contract", data);
    /*
    *  map over items returned from smart contract and format
    *  them as well as fetch their token metadata
    */
    // eslint-disable-next-line arrow-parens
    const items = await Promise.all(data.map(async i => {
      // const data2 = await contract.NFTView(i.tokenId);
      const tokenUri = await contract.tokenURI(i.tokenId);
      console.log("token Uri is ", tokenUri);
      const httpUri = getIPFSGatewayURL(tokenUri);
      console.log("Http Uri is ", httpUri);
      const meta = await axios.get(httpUri);
      // const data2 = await contract.NFTView(i.tokenId);
      const views = i.tokenId.toString();

      const item = {
        tokenId: i.tokenId.toNumber(),
        image: getIPFSGatewayURL(meta.data.image),
        name: meta.data.name,
        description: meta.data.description,
        contact: meta.data.properties.contact,
        views,
      };
      console.log("item returned is ", item);
      return item;
    }));
    setNfts(items);
    setLoadingState("loaded");
  }

  async function view(nft) {
    console.log("item id clicked is", nft.tokenId);
    const vid = nft.tokenId;

    navigate("/watch", {
      state: {
        id: vid
      }
    });
    console.log("Prop result without {} is ", { vid });
  }
  if (loadingState === "loaded" && !nfts.length) {
    return (
      <div>
        <h1 className="px-20 py-10 text-3xl">No Entries yet</h1>
      </div>
    );
  }
  return (
    <div className="flex justify-center bg-white mb-5">

      <div className="px-4" style={{ maxWidth: "1600px" }}>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-4">
          {nfts.map((nft, i) => (

            <div key={i} className="shadow rounded-xl overflow-hidden border-2 border-gray-500 ">
              <div className="p-1">
                <p style={{ height: "14px" }} className="text-lg text-red-700 font-semibold">Twitter Handle: {nft.contact}</p>

              </div>
              <iframe
                title="Talent"
                height="400px"
                width="100%"
                src={`${nft.image}#toolbar=0`}
                className="py-3 object-fill h-500"
              />
              <div className="p-1">
                <p style={{ height: "34px" }} className="text-xl text-blue-700 font-semibold">Artiste: {nft.name}</p>
                <div style={{ height: "40px", overflow: "hidden" }}>
                  <p className="text-gray-700">Title of Song: {nft.description}</p>
                </div>
                <div style={{ height: "40px", overflow: "hidden" }}>
                  <p className="text-red-700 font-bold">Number of views: {nft.views}</p>
                </div>
              </div>

              <div className="p-2 bg-black">
                <button type="button" className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-12 rounded" onClick={() => view(nft)}>Watch Music</button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
import "./init";
import React, { useState } from "react";
import { NFTStorage } from "nft.storage";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Talent from "../utils/Talent.json";
import { talentMusicaAddress } from "../../config";

// eslint-disable-next-line max-len
const APIKEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDA4Zjc4ODAwMkUzZDAwNEIxMDI3NTFGMUQ0OTJlNmI1NjNFODE3NmMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1MzA1NjE4NzM4MCwibmFtZSI6InBlbnNpb25maSJ9.agI-2V-FeK_eVRAZ-T6KGGfE9ltWrTUQ7brFzzYVwdM";

const MintMusic = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState();
  const [imageView, setImageView] = useState();
  const [metaDataURL, setMetaDataURl] = useState();
  const [txURL, setTxURL] = useState();
  const [txStatus, setTxStatus] = useState();
  const [formInput, updateFormInput] = useState({ name: "", description: "", contact: "" });

  const handleFileUpload = (event) => {
    console.log("file for upload selected...");
    setUploadedFile(event.target.files[0]);
    setTxStatus("");
    setImageView("");
    setMetaDataURl("");
    setTxURL("");
  };

  const uploadNFTContent = async (inputFile) => {
    const { name, description, contact } = formInput;
    if (!name || !description || !inputFile) return;
    const nftStorage = new NFTStorage({ token: APIKEY, });
    try {
      console.log("Trying to upload asset to ipfs");
      setTxStatus("Uploading music to NFT.storage.");
      const metaData = await nftStorage.store({
        name,
        description,
        image: inputFile,
        properties: {
          contact,
        }
      });
      setMetaDataURl(metaData.url);
      console.log("metadata is: ", { metaData });

      return metaData;
    } catch (error) {
      setErrorMessage("Could not save your music - Minting Aborted.");
      console.log("Error Uploading Content", error);
    }
  };

  const sendTxToBlockchain = async (metaData) => {
    try {
      setTxStatus("connecting to ALTLAYER Blockchain.");
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);

      const connectedContract = new ethers.Contract(talentMusicaAddress, Talent.abi, provider.getSigner());
      console.log("Connected to contract", talentMusicaAddress);
      console.log("IPFS blockchain uri is ", metaData.url);

      const mintNFTTx = await connectedContract.createToken(metaData.url);
      console.log("Music successfully added to Blockchain");
      await mintNFTTx.wait();
      return mintNFTTx;
    } catch (error) {
      setErrorMessage("Failed to send tx to ALTLAYER.");
      console.log(error);
    }
  };

  const previewNFT = (metaData, mintNFTTx) => {
    console.log("getIPFSGatewayURL2 two is ...");
    const imgViewString = getIPFSGatewayURL(metaData.data.image.pathname);
    console.log("image ipfs path is", imgViewString);
    setImageView(imgViewString);
    setMetaDataURl(getIPFSGatewayURL(metaData.url));
    setTxURL(`https://devnet-explorer.altlayer.io/tx/${mintNFTTx.hash}`);
    setTxStatus("Talent registration was successfully!");
    console.log("Preview details completed");
  };

  const mintNFTToken = async (e, uploadedFile) => {
    e.preventDefault();
    // 1. upload NFT content via NFT.storage
    const metaData = await uploadNFTContent(uploadedFile);

    // 2. Mint a NFT token on BSC
    const mintNFTTx = await sendTxToBlockchain(metaData);

    // 3. preview the minted nft
    previewNFT(metaData, mintNFTTx);

    navigate("/explore");
  };

  const getIPFSGatewayURL = (ipfsURL) => {
    const urlArray = ipfsURL.split("/");
    const ipfsGateWayURL = `https://${urlArray[2]}.ipfs.nftstorage.link/${urlArray[3]}`;
    return ipfsGateWayURL;
  };

  return (
    <div className="bg-gray-100">
      <hr className="h-1 bg-white" />
      <div className="text-4xl text-center text-black font-bold mt-10">
        <h1> New Music Talent Upload</h1>
      </div>
      <div className="flex justify-center">
        <div className="w-1/2 flex flex-col pb-12 ">
          <input
            placeholder="Enter name of Artiste / Talent"
            className="mt-5 border rounded p-4 text-xl"
            onChange={(e) => updateFormInput({ ...formInput, name: e.target.value })}
          />
          <input
            placeholder="Title of Song"
            className="mt-5 border rounded p-4 text-xl"
            onChange={(e) => updateFormInput({ ...formInput, description: e.target.value })}
          />
          <input
            placeholder="Twitter Handle"
            className="mt-5 border rounded p-4 text-xl"
            onChange={(e) => updateFormInput({ ...formInput, contact: e.target.value })}
          />
          <br />

          <div className="MintNFT text-black text-xl">
            <form>
              <h3>Select your music file</h3>
              <input type="file" onChange={handleFileUpload} className="mt-5 border rounded p-4 text-xl" />
            </form>
            {txStatus && <p>{txStatus}</p>}

            {metaDataURL && <p className="text-blue"><a href={metaDataURL} className="text-blue">Metadata on IPFS</a></p>}

            {txURL && <p><a href={txURL} className="text-blue">See the mint transaction</a></p>}

            {errorMessage}
            <br />
            {imageView && (
            <iframe
              className="mb-10"
              title="Ebook "
              src={imageView}
              alt="NFT preview"
              height="50%"
              width="100%"
            />
            )}

          </div>

          <button type="button" onClick={(e) => mintNFTToken(e, uploadedFile)} className="font-bold mt-20 bg-blue-500 text-white text-2xl rounded p-4 shadow-lg">
            Upload Music
          </button>
        </div>
      </div>
    </div>

  );
};
export default MintMusic;

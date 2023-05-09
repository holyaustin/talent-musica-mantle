import * as LitJsSdk from "lit-js-sdk";

const client = new LitJsSdk.LitNodeClient();
const chain = "bsc";

//* Access control for a wallet with > 0.00001 ETH
const accessControlConditionsETHBalance = [
  {
    contractAddress: "",
    standardContractType: "",
    chain,
    method: "eth_getBalance",
    parameters: [
      ":userAddress",
      "latest"
    ],
    returnValueTest: {
      comparator: ">=",
      value: "10000000000000" // 0.000001 ETH
    }
  }
];

/**
// Must hold at least one Monster Suit NFT (https://opensea.io/assets/ethereum/0x495f947276749ce646f68ac8c248420045cb7b5e/75463724465658187066038671085849996808663636980377471186234080295252716945409)
const accessControlConditionsNFT = [
    {
      contractAddress: '0x495f947276749ce646f68ac8c248420045cb7b5e',
      standardContractType: 'ERC721',
      chain,
      method: 'balanceOf',
      parameters: [
        ':userAddress'
      ],
      returnValueTest: {
        comparator: '>=',
        value: '0'
      }
    }
  ]
*/
class Lit {
  litNodeClient;

  async connect() {
    await client.connect();
    this.litNodeClient = client;
  }

  async encryptString(str) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(str);

    const encryptedSymmetricKey = await window.litNodeClient.saveEncryptionKey({
      accessControlConditions: accessControlConditionsETHBalance,
      symmetricKey,
      authSig,
      chain,
    });

    return {
      encryptedFile: encryptedString,
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
    };
  }

  async decryptString(encryptedStr, encryptedSymmetricKey) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const symmetricKey = await this.litNodeClient.getEncryptionKey({
      accessControlConditions: accessControlConditionsETHBalance,
      toDecrypt: encryptedSymmetricKey,
      chain,
      authSig
    });
    const decryptedFile = await LitJsSdk.decryptString(
      encryptedStr,
      symmetricKey
    );
    // eslint-disable-next-line no-console
    console.log({
      decryptedFile
    });
    return { decryptedFile };
  }
}

export default new Lit();

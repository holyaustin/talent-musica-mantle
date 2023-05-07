const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const Talent = await hre.ethers.getContractFactory("Talent");
  const talent = await Talent.deploy();
  await talent.deployed();
  console.log("talentMusica deployed to:", talent.address);

  fs.writeFileSync('./config.js', `
  export const talentMusicaAddress = "${talent.address}"
  `)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

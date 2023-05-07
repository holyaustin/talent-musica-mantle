/* test/sample-test.js */
describe("TalentMarket", function() {
  it("Should create and execute talent", async function() {
    /* deploy the marketplace */
    const Talent = await ethers.getContractFactory("Talent")
    const talent = await talent.deploy()
    await talent.deployed()

    const auctionPrice = ethers.utils.parseUnits('1', 'ether')

    /* create two tokens */
    await waste.createToken("https://www.ipfsmetadata1.com")
    await waste.createToken("https://www.ipfsmetadata2.com")

    const [_, buyerAddress] = await ethers.getSigners()

    /* execute sale of token to another user */
    await waste.connect(buyerAddress).createMarketSale(1)

    /* query for and return the unsold items */
    items = await waste.fetchMarketItems()
    items = await Promise.all(items.map(async i => {
      const tokenUri = await waste.tokenURI(i.tokenId)
      let item = {
        tokenId: i.tokenId.toString(),
        artiste: i.artiste,
        owner: i.owner,
        tokenUri
      }
      return item
    }))
    console.log('items: ', items)
  })
})

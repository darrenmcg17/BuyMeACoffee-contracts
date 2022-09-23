// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

//returns the ether balance of a given address
async function getBalance(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

//logs the ether balances for a list of addresses
async function printBalances(addresses) {
  let idx = 0;
  for(const address of addresses) {
    console.log(`Address ${idx} balance:`, await getBalance(address));
    idx ++;
  }
}

//logs the memos stored on-chain from coffee purchases
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`);
  }
}

async function main() {
  //get example accounts
  const[owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();
  
  //get the contract to deploy & deploy
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log("BuyMeACoffee deployed to ", buyMeACoffee.address);

  //check balances before coffee purchase
  const addresses = [owner.address, tipper.address, buyMeACoffee.address];
  console.log("==> START <==");
  await printBalances(addresses);

  //buy the owner a few coffees
  const tipSmall = {value: hre.ethers.utils.parseEther("0.001")};
  const tipBig = {value: hre.ethers.utils.parseEther("0.003")};
  await buyMeACoffee.connect(tipper).buySmallCoffee("Carra", "you're fantastic", tipSmall);
  await buyMeACoffee.connect(tipper2).buyLargeCoffee("Zac", "you're the best dad", tipBig);
  await buyMeACoffee.connect(tipper3).buySmallCoffee("Ava", "Hi dad ", tipSmall);

  //check balances after coffee purchase
  console.log("==> Bought Coffee <==");
  await printBalances(addresses);

  //withdraw funds
  await buyMeACoffee.connect(owner).withdrawTips();

  //check balance after withdrawal
  console.log("==> Withdrew Tips <==");
  await printBalances(addresses);

  //read all the memos left for the owner
  console.log("==> Memos <==");
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
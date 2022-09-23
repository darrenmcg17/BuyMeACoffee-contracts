// scripts/withdraw.js

const hre = require("hardhat");
const abi = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");

async function getBalance(provider, address){
    const balanceBigInt = await provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt);
}

async function main() {
    //get the contract that has been deployed to goerli
    const contractAddress="0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const contractABI = abi.abi;

    //get the node connection and wallet connection
    const provider = new hre.ethers.providers.AlchemyProvider("goerli", process.env.GOERLI_API_KEY);

    //ensure signer is the same address as original contract deployer
    //or this script will fail with an error
    const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

    //instantiate connected contract
    const buyMeACoffee = new hre.ethers.Contract(contractAddress, contractABI, signer);

    //check start balances
    console.log("current balance of owner: ", await getBalance(provider, signer.address), "ETH");
    const contractBalance = await getBalance(provider, buyMeACoffee.address);
    console.log("current balance of contract: ", await getBalance(provider, buyMeACoffee.address), "ETH");

    //withdraw funds if there are funds to withdraw
    if (contractBalance !== "0.0"){
        console.log("withdrawing funds....")
        const withdrawTxn = await buyMeACoffee.withdrawTips();
        await withdrawTxn.wait();
    } else {
        console.log("No funds available!");
    }

    //check ending balance
    console.log("Current balance of owner: ", await getBalance(provider, signer.address), "ETH");

}

//We recommend this pattern to be able to use async/await everywhere
//and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
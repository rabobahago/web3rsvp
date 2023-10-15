// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
//npx hardhat node
//npx hardhat run --network localhost scripts/deploy.js
async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const rsvpContractFactory = await hre.ethers.getContractFactory("Web3RSVP");
  const rsvpContract = await rsvpContractFactory.deploy();
  await rsvpContract.deployed();
  console.log("Contract deployed to:", rsvpContract.address);
  const [first, second, third] = await hre.ethers.getSigners();
  const { address: deployer } = first;
  const { address: address1 } = second;
  const { address: address2 } = third;
  // console.log(deployer, address1, address2);
  let deposit = hre.ethers.utils.parseEther("1");
  let maxCapacity = 3;
  let timestamp = 1718926200;
  let eventDataCID =
    "bafybeibhwfzx6oo5rymsxmkdxpmkfwyvbjrrwcl7cekmbzlupmp5ypkyfi";

  let txn = await rsvpContract.createNewEvent(
    timestamp,
    deposit,
    maxCapacity,
    eventDataCID
  );
  let wait = await txn.wait();
  const {
    to,
    from,
    blockHash,
    transactionHash,
    logs: {
      transactionIndex,
      blockNumber,
      transactionHash: txnHash,
      address,
      topics,
      data,
    },
    blockHash: txnBlockHash,
    logIndex,
    events,
  } = wait;
  // console.log("details", events[0].event, events[0].args);
  // console.log("NEW EVENT CREATED:", wait.events[0].event, wait.events[0].args);

  let eventID = wait.events[0].args.eventID;
  // console.log("EVENT ID:", eventID);
  //create createNewEvent with deployer address
  txn = await rsvpContract.createNewRSVP(eventID, { value: deposit });
  wait = await txn.wait();
  console.log("New RSVP", wait.events[0].event, wait.events[0].args);
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

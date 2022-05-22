
const hre = require("hardhat");

async function main() {
  // Get the contract to deploy
  const PublicPoll = await hre.ethers.getContractFactory("PublicPoll");
  const publicpoll = await PublicPoll.deploy();

  await publicpoll.deployed();

  console.log("PublicPoll deployed to:", publicpoll.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

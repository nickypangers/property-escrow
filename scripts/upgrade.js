const { ethers } = require("ethers");

async function main() {
  const PropertyEscrow = await ethers.getContractFactory("PropertyEscrow");
  // Deploy PropertyEscrow
  // ProxyAdmin
  // Deploy Proxy
  const proxy = await upgrades.deployProxy(PropertyEscrow, [], {
    initializer: "store",
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

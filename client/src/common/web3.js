import { ethers } from "ethers";
import PropertyEscrowContract from "../contracts/PropertyEscrow.json";
import store from "@/store/index.js";

// 0x0d7AD7108Ee80A36e2F5a0542EE3A55eb56a91dc

// const connectToWeb3 = async () => {
//   const provider = getProvider();
// };

const contractAddress = () => "0x303318F340062CBb276BF53818e753FDBE5e1b0c";

const getNetwork = async () => {
  const network = await getProvider().getNetwork();
  // console.debug("network", network);
  if (network.name != "ropsten") {
    throw new Error(`Please connect to ropsten. (Currently: ${network.name})`);
  }
};

const getInfuraProvider = () => {
  return new ethers.providers.InfuraProvider(
    "ropsten",
    "2c12d41fd9bb4b30b3b6a21d9fd30657"
  );
};

const getWebProvider = () => {
  return new ethers.providers.Web3Provider(window.ethereum, "any");
};

const getProvider = () => {
  // return new ethers.providers.Web3Provider(window.ethereum, "any");
  if (store.state.isConnected == false) {
    return getWebProvider();
  }
  return getInfuraProvider();
};

const getAccounts = async () => {
  let provider = getProvider();
  if (provider == null) {
    throw "Provider not found";
  }

  let accounts = await provider.listAccounts();
  if (accounts.length == 0) {
    throw "No accounts";
  }

  // console.debug("accounts", accounts);
  store.commit("setAccounts", accounts);
};

const getSigner = () => {
  const provider = getProvider();

  if (provider == null) {
    throw "Provider not found";
  }

  let signer = provider.getSigner();
  if (signer == undefined || signer == null) {
    throw "No signer";
  }
  // console.debug("signer", signer);
  return signer;
};

export const getReadOnlyContract = async () => {
  let provider = getProvider();
  if (provider == null) {
    throw "Provider not found";
  }

  let readOnlyContract = new ethers.Contract(
    contractAddress(),
    PropertyEscrowContract.abi,
    provider
  );
  // console.debug("readOnlyContract", readOnlyContract);
  store.commit("setReadOnlyContract", readOnlyContract);
};

export const getContract = async () => {
  let signer = getSigner();
  if (signer == null) {
    throw "Signer not found";
  }

  let contract = new ethers.Contract(
    contractAddress(),
    PropertyEscrowContract.abi,
    signer
  );
  // console.debug("contract", contract);
  store.commit("setContract", contract);

  let contractSigner = contract.connect(signer);

  // console.debug("contractSigner", contractSigner);
  store.commit("setContractSigner", contractSigner);
};

export const initReadOnly = async () => {
  await getReadOnlyContract();
};

export const initWeb3 = async () => {
  if (window.ethereum == undefined) {
    throw "Please install metamask";
  }
  await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  await getNetwork();
  await getAccounts();
  await getContract();
  await getBalance();
  store.commit("setIsConnected", true);
};

export const getBalance = async () => {
  if (!store.state.isConnected) {
    return;
  }

  const provider = getProvider();
  if (provider == null) {
    throw "Provider not found";
  }

  let balance = await provider.getBalance(store.state.accounts[0]);
  store.commit("setBalance", balance);
};

export const formatEtherBalance = (balance, dp = 2) => {
  return Number(ethers.utils.formatEther(balance)).toFixed(dp);
};

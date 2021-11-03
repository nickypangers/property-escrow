import { ethers } from "ethers";
import PropertyEscrowContract from "../contracts/PropertyEscrow.json";
import store from "@/store/index.js";

const getContractAddress = () => "0xaE04272303c0DA608732513EB2fFEa8aEE4F9647";

const connectToWeb3 = () => {
  const provider = getProvider();
  console.debug("provider", provider);
  if (provider == null) {
    throw "Provider not found";
  }
  if (provider.network.name != "ropsten") {
    throw "Wrong network";
  }
};

const getProvider = () => {
  const provider = new ethers.providers.Web3Provider(
    window.ethereum,
    "ropsten"
  );
  return provider;
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

  console.debug("accounts", accounts);
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
  console.debug("signer", signer);
  return signer;
};

export const getContract = async () => {
  let provider = getProvider();
  if (provider == null) {
    throw "Provider not found";
  }

  let readOnlyContract = new ethers.Contract(
    getContractAddress(),
    PropertyEscrowContract.abi,
    provider
  );
  console.debug("readOnlyContract", readOnlyContract);
  store.commit("setReadOnlyContract", readOnlyContract);

  let signer = getSigner();
  if (signer == null) {
    throw "Signer not found";
  }

  let contract = new ethers.Contract(
    getContractAddress(),
    PropertyEscrowContract.abi,
    signer
  );
  console.debug("contract", contract);
  store.commit("setContract", contract);

  let contractSigner = contract.connect(signer);

  console.debug("contractSigner", contractSigner);
  store.commit("setContractSigner", contractSigner);
};

export const initWeb3 = async () => {
  if (window.ethereum == undefined) {
    throw "Please install metamask";
  }
  await window.ethereum.request({ method: "eth_requestAccounts" });
  try {
    connectToWeb3();
    await getAccounts();
    // getSigner();
    await getContract();
  } catch (e) {
    console.error("testing");
    throw e;
  }
};

export const getBalance = async () => {
  const provider = new ethers.providers.Web3Provider(
    window.ethereum,
    "ropsten"
  );
  if (provider == null) {
    throw "Provider not found";
  }

  let balance = await provider.getBalance(store.state.accounts[0]);
  // let formattedBalance = Number(ethers.utils.formatEther(balance));
  console.debug("formattedBalance", balance);
  // return Number(formattedBalance).toFixed(2);
  store.commit("setBalance", balance);
};

export const formatEtherBalance = (balance, dp = 2) => {
  return Number(ethers.utils.formatEther(balance)).toFixed(dp);
};

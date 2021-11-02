import { ethers } from "ethers";
import PropertyEscrowContract from "../contracts/PropertyEscrow.json";
import store from "@/store/index.js";

const getContractAddress = () => "0xBB693fb1e9E2a60161Aa2b4ce2E9e35c54897e37";

const connectToWeb3 = () => {
  const provider = getProvider();
  console.debug("provider", provider);
  if (provider == null) {
    throw "Provider not found";
  }
};

const getProvider = () => {
  return new ethers.providers.Web3Provider(window.ethereum, "ropsten");
};

const getAccounts = async () => {
  let provider = getProvider();
  // let provider = store.state.provider;
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
  connectToWeb3();
  await getAccounts();
  // getSigner();
  await getContract();
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
  let formattedBalance = ethers.utils.formatEther(balance);
  console.debug("formattedBalance", formattedBalance);
  return formattedBalance;
};

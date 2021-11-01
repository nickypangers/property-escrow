import { ethers } from "ethers";
import store from "@/store/index.js";

const connectToWeb3 = () => {
  const provider = new ethers.providers.Web3Provider(
    window.ethereum,
    "ropsten"
  );
  console.log(provider);
  if (provider == null) {
    throw "Provider not found";
  }

  store.commit("setProvider", provider);
};

const getAccounts = async () => {
  let provider = store.state.provider;

  if (provider == null) {
    throw "Provider not found";
  }

  let accounts = await provider.listAccounts();

  if (accounts.length == 0) {
    throw "No accounts";
  }

  console.log(accounts);
  store.commit("setAccounts", accounts);
};

const getSigner = () => {
  const provider = store.state.provider;

  if (provider == null) {
    throw "Provider not found";
  }

  const accounts = store.state.accounts;

  if (accounts.length == 0) {
    throw "No accounts";
  }

  let signer = provider.getSigner(accounts[0]);
  if (signer == undefined || signer == null) {
    throw "No signer";
  }

  console.log(signer);

  store.commit("setSigner", signer);
};

export const initWeb3 = async () => {
  if (window.ethereum == undefined) {
    throw "Please install metamask";
  }
  await window.ethereum.enable();
  connectToWeb3();
  await getAccounts();
  getSigner();
};

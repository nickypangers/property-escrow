import { createStore } from "vuex";
import { formatEtherBalance } from "@/common/web3.js";

export default createStore({
  state: {
    isConnected: false,
    isLoading: false,
    readOnlyContract: null,
    contract: null,
    contractSigner: null,
    accounts: [],
    balance: 0,
    modal: {
      title: "",
      body: "",
      showFooter: "",
    },
    isModalOpen: false,
    totalAmountTransacted: 0,
    totalListingsSold: 0,
  },
  getters: {
    activeContract: (state) => {
      if (state.isConnected) {
        return state.contract;
      }
      return state.readOnlyContract;
    },
  },
  mutations: {
    setModalClose(state) {
      state.isModalOpen = false;
    },
    setModal(state, modal) {
      state.modal.title = modal.title;
      state.modal.body = modal.body;
      state.modal.showFooter = modal.showFooter;
      state.isModalOpen = true;
    },
    setIsConnected(state, isConnected) {
      state.isConnected = isConnected;
    },
    setIsLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
    setReadOnlyContract(state, readOnlyContract) {
      state.readOnlyContract = readOnlyContract;
    },
    setContract(state, contract) {
      state.contract = contract;
    },
    setAccounts(state, accounts) {
      state.accounts = accounts;
    },
    setContractSigner(state, contractSigner) {
      state.contractSigner = contractSigner;
    },
    setBalance(state, balance) {
      state.balance = balance;
    },
    setTotalAmountTransacted(state, totalAmountTransacted) {
      state.totalAmountTransacted = formatEtherBalance(
        totalAmountTransacted,
        2
      );
    },
    setTotalListingsSold(state, totalListingsSold) {
      state.totalListingsSold = totalListingsSold;
    },
  },
  actions: {},
  modules: {},
});

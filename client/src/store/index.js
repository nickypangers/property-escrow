import { createStore } from "vuex";

export default createStore({
  state: {
    isConnected: false,
    isLoading: false,
    readOnlyContract: null,
    contract: null,
    contractSigner: null,
    accounts: [],
    balance: 0,
  },
  mutations: {
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
  },
  actions: {},
  modules: {},
});

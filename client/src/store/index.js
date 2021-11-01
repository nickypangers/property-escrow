import { createStore } from "vuex";

export default createStore({
  state: {
    readOnlyContract: null,
    contract: null,
    contractSigner: null,
    accounts: [],
  },
  // getters: {
  //   provider: (state) => state.provider,
  //   signer: (state) => state.signer,
  //   contract: (state) => state.contract,
  //   address: (state) => state.address,
  // },
  mutations: {
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
  },
  actions: {},
  modules: {},
});

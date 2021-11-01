import { createStore } from "vuex";

export default createStore({
  state: {
    provider: null,
    signer: null,
    contract: null,
    accounts: [],
  },
  // getters: {
  //   provider: (state) => state.provider,
  //   signer: (state) => state.signer,
  //   contract: (state) => state.contract,
  //   address: (state) => state.address,
  // },
  mutations: {
    setProvider(state, provider) {
      state.provider = provider;
    },
    setSigner(state, signer) {
      state.signer = signer;
    },
    setContract(state, contract) {
      state.contract = contract;
    },
    setAccounts(state, accounts) {
      state.accounts = accounts;
    },
  },
  actions: {},
  modules: {},
});

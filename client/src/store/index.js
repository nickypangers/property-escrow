import { createStore } from "vuex";

export default createStore({
  state: {
    provider: null,
    signer: null,
    contract: null,
    address: "",
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
    setAddress(state, address) {
      state.address = address;
    },
  },
  actions: {},
  modules: {},
});

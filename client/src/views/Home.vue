<template>
  <div class="home">{{ testing }}</div>
</template>

<script>
import { onMounted } from "vue";
import { ethers } from "ethers";
// import { getContractAddress } from "@/common/contract.js";
import PropertyEscrowContract from "../contracts/PropertyEscrow.json";

export default {
  name: "Home",
  components: {},
  setup() {
    const testing = "hi";

    // const store = useStore();

    let provider = null;

    onMounted(async () => {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.debug("accounts", accounts);

      provider = new ethers.getDefaultProvider(
        "https://eth-ropsten.alchemyapi.io/v2/MzQ5PAmiP3qH9nhONMES98WfElPeh05n"
      );
      console.debug("provider", provider);

      let signer = provider.getSigner(accounts[0]);
      console.debug("signer", await signer.getAddress());

      let contract = new ethers.Contract(
        signer.getAddress(),
        PropertyEscrowContract.abi,
        signer
      );
      console.debug("contract", contract);

      console.debug(
        "balance",
        await provider.getBalance("0x7efe0A45Cc04536c11634c813f589f3bafB69728")
      );
    });

    return {
      testing,
    };
  },
};
</script>

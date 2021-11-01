<template>
  <div class="home">
    <div>{{ testing }}</div>
    <div>{{ address }}</div>
    <div>
      <button @click="connect">Connect Account</button>
    </div>
  </div>
</template>

<script>
import { computed, watch, onMounted, ref } from "vue";
import { useStore } from "vuex";
// import { getProviderURL } from "@/common/contract.js";
import { initWeb3 } from "@/common/web3.js";
// import PropertyEscrowContract from "../contracts/PropertyEscrow.json";

export default {
  name: "Home",
  components: {},
  setup() {
    const testing = "hi";

    const store = useStore();
    const accounts = computed(() => store.state.accounts);
    const address = ref("");

    watch(accounts, (newVal) => {
      if (newVal.length > 0) {
        address.value = accounts.value[0];
      }
    });

    const connect = async () => {
      try {
        await initWeb3();
        store.stat;
      } catch (e) {
        alert(e);
      }
    };

    onMounted(async () => {});

    return {
      testing,
      address,
      connect,
    };
  },
};
</script>

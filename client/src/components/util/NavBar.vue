<template>
  <div class="p-4 bg-primary text-white">
    <div class="flex justify-between items-center">
      <button @click="router.push('/')">
        <div>Back To Mainpage</div>
      </button>
      <div>Total Amount Transacted: {{ totalAmountTransacted }} ETH</div>
      <div class="flex items-center">
        <div class="mr-3 font-bold" v-if="isConnected">{{ balance }} ETH</div>
        <div class="relative inline-block w-40">
          <button
            @click="connect"
            class="w-full bg-blue-accent rounded-2xl text-black"
            v-if="!isConnected"
          >
            Connect Account
          </button>
          <button
            v-if="isConnected"
            class="w-full truncate bg-blue-accent rounded-xl text-black"
            @click="showButtonMenu = !showButtonMenu"
          >
            {{ concealAddress(accounts[0]) }}
          </button>
          <div
            class="absolute w-full bg-white mt-4 rounded-xl"
            v-if="showButtonMenu"
          >
            <button class="w-full text-black" @click="disconnect">
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { initWeb3 } from "@/common/web3.js";
import { useRouter } from "vue-router";
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { getReadOnlyContract, formatEtherBalance } from "@/common/web3.js";
import { concealAddress } from "@/common/strings.js";
import contract from "@/common/contract.js";

export default {
  setup() {
    const router = useRouter();
    const store = useStore();

    const accounts = computed(() => store.state.accounts);
    const balance = computed(() => formatEtherBalance(store.state.balance, 5));
    const totalAmountTransacted = computed(
      () => store.state.totalAmountTransacted
    );

    const showButtonMenu = ref(false);

    const isConnected = computed({
      get() {
        return store.state.isConnected;
      },
      set(value) {
        store.commit("setIsConnected", value);
      },
    });

    const removeContract = () => {
      store.commit("setContract", null);
      store.commit("setContractSigner", null);
    };

    const connect = async () => {
      try {
        await initWeb3();
        router.push("/app");
      } catch (e) {
        alert(e);
      }
    };

    const disconnect = () => {
      showButtonMenu.value = false;
      isConnected.value = false;
      removeContract();
      router.push("/app");
    };

    onMounted(async () => {
      await getReadOnlyContract();
      contract.getTotalAmountTransacted();
    });

    return {
      connect,
      isConnected,
      accounts,
      showButtonMenu,
      disconnect,
      balance,
      concealAddress,
      totalAmountTransacted,
      router,
    };
  },
};
</script>

<style lang="scss" scoped>
button {
  @apply px-3 py-2;
}
</style>

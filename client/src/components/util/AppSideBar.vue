<template>
  <div class="mx-3 lg:col-span-1">
    <div
      class="
        rounded-xl
        divide-y divide-black divide-solid
        w-full
        h-auto
        bg-sidebar
        text-white
      "
    >
      <div>
        <button class="rounded-t-xl" @click="router.push('/app')">Home</button>
      </div>
      <div v-if="isConnected">
        <button @click="router.push('/app/manage')">Manage My Listings</button>
      </div>
      <div v-if="isConnected">
        <button @click="router.push('/app/orders')">Purchase History</button>
      </div>
      <div>
        <button @click="router.push('/app/about')">About</button>
      </div>
      <div>
        <a :href="contractUrl" target="_blank" rel="noopener noreferrer">
          <button class="rounded-b-xl">View Contract</button>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { computed } from "vue";
import { contractAddress } from "@/common/web3.js";
export default {
  setup() {
    const router = useRouter();
    const store = useStore();

    const isConnected = computed(() => {
      return store.state.isConnected;
    });

    const contractUrl =
      "https://ropsten.etherscan.io/address/" + contractAddress();

    return {
      router,
      isConnected,
      contractUrl,
    };
  },
};
</script>

<style lang="scss" scoped>
button {
  @apply w-full py-3 hover:bg-sidebar-hover;
}
</style>

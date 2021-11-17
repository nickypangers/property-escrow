<template>
  <div>
    <div class="p-4 flex justify-between">
      <div>Property Escrow</div>
      <button
        @click="router.push('/app')"
        class="bg-blue-accent px-8 py-3 rounded-2xl font-bold text-black"
      >
        Enter App
      </button>
    </div>
    <section id="home">
      <div>
        <p class="text-2xl">Blockchain Property Escrow</p>
        <br />
        <div class="text-lg">
          <p>
            This app is currrently live on <b>Ropsten Test Network</b>. Please
            connect to Ropsten in order to interact with the contract.
          </p>

          <!-- <p>This app is currently live on <b>Ropsten</b> test network.</p>
        <p>
          This is a personal project and the contract has not been audited.
          Please do not fill in any personal information including real-world
          addresses.
        </p>
        <p><b>This application is for entertainment purposes only.</b></p>
        <p>
          Feel free to check out my porfolio
          <a href="http://nickypangers.com" class="text-blue-500 underline">
            here
          </a>
        </p> -->
        </div>
      </div>
    </section>
    <section id="stats">
      <div
        class="
          w-full
          bg-black
          text-white
          py-16
          flex
          justify-around
          items-center
        "
      >
        <div class="stat-box">
          <p>Total Amount Transacted</p>
          <p>{{ totalAmountTransacted }} ETH</p>
        </div>
        <div class="stat-box">
          <p>Properties Sold</p>
          <p>{{ totalListingsSold }}</p>
        </div>
        <!-- <div class="stat-box">Test</div> -->
      </div>
    </section>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ref, computed, onMounted } from "vue";
import contract from "@/common/contract.js";
import { initReadOnly } from "@/common/web3.js";
export default {
  name: "Home",
  setup() {
    const router = useRouter();
    const store = useStore();

    const isConnected = computed({
      get: () => {
        return store.state.isConnected;
      },
      set: (val) => {
        store.commit("setIsConnected", val);
      },
    });
    const totalAmountTransacted = ref(0);
    const totalListingsSold = ref(0);

    const getTotalAmountTransacted = () => {
      contract.getTotalAmountTransacted().then(() => {
        totalAmountTransacted.value = store.state.totalAmountTransacted;
      });
    };

    const getTotalListingsSold = () => {
      contract.getTotalListingsSold().then(() => {
        totalListingsSold.value = store.state.totalListingsSold;
      });
    };

    onMounted(async () => {
      if (isConnected.value) {
        isConnected.value = false;
      }
      await initReadOnly();
      getTotalAmountTransacted();
      getTotalListingsSold();
    });

    return {
      router,
      totalAmountTransacted,
      totalListingsSold,
    };
  },
};
</script>
<style lang="scss" scoped>
section {
  @apply py-5;
}

.stat-box {
  @apply text-lg font-bold;
}
</style>

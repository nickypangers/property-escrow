<template>
  <div class="p-4">
    <div class="flex justify-between items-center">
      <div>Hio</div>
      <div class="relative inline-block w-40">
        <button @click="connect" class="w-full bg-blue-200" v-if="!isConnected">
          Connect Account
        </button>
        <button
          v-if="isConnected"
          class="w-full truncate border"
          @click="showButtonMenu = !showButtonMenu"
        >
          {{ accounts[0] }}
        </button>
        <div class="absolute w-full" v-if="showButtonMenu">
          <button class="w-full border" @click="disconnect">Disconnect</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { initWeb3 } from "@/common/web3.js";
import { useRouter } from "vue-router";
import { ref, computed } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const router = useRouter();
    const store = useStore();

    const accounts = computed(() => store.state.accounts);

    const showButtonMenu = ref(false);

    const isConnected = computed({
      get() {
        return store.state.isConnected;
      },
      set(value) {
        store.commit("setIsConnected", value);
      },
    });

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
    };

    return {
      connect,
      isConnected,
      accounts,
      showButtonMenu,
      disconnect,
    };
  },
};
</script>

<style lang="scss" scoped>
button {
  @apply px-3 py-2;
}
</style>

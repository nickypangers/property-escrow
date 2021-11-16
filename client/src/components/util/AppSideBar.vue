<template>
  <div
    class="
      mx-3
      rounded-xl
      divide-y divide-black divide-solid
      h-auto
      bg-sidebar
      text-white
    "
  >
    <div>
      <button @click="router.push('/app')">Home</button>
    </div>
    <div>
      <button @click="router.push('/app/manage')" :disabled="!isConnected">
        Manage My Listings
      </button>
    </div>
    <div>
      <button @click="router.push('/app/orders')" :disabled="!isConnected">
        Purchase History
      </button>
    </div>
    <div>
      <button>Help</button>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { computed } from "vue";
export default {
  setup() {
    const router = useRouter();
    const store = useStore();

    const isConnected = computed(() => {
      return store.state.isConnected;
    });
    return {
      router,
      isConnected,
    };
  },
};
</script>

<style lang="scss" scoped>
button {
  @apply w-full py-3;
}
</style>

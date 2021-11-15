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
      <button @click="router.push('/app/manage')">Manage My Listings</button>
    </div>
    <div>
      <button @click="router.push('/app/orders')">Purchase History</button>
    </div>
    <div>
      <button>Help</button>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();

    return {
      router,
    };
  },
};
</script>

<style lang="scss" scoped>
button {
  @apply w-full py-3;
}
</style>

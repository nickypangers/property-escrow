<template>
  <div>
    <div class="p-4 flex justify-end">
      <button
        @click="router.push('/app')"
        class="bg-blue-accent px-8 py-3 rounded-2xl font-bold text-black"
      >
        Enter App
      </button>
    </div>
    <div class="home">Property Escrow on Blockchain</div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
export default {
  name: "Home",
  setup() {
    const router = useRouter();
    return {
      router,
    };
  },
};
</script>

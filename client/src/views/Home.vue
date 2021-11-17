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
    <div class="home">
      <p class="text-2xl">Buy and Sell Property using Blockchain</p>
      <br />
      <div class="text-lg">
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

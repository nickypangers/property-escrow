<template>
  <div class="home">
    <div>
      <button @click="connect">Connect Account</button>
    </div>
    <div>
      <button @click="isVisible = !isVisible">Toggle Modal</button>
    </div>
    <modal :is-visible="isVisible" @cancel="isVisible = false">
      <template v-slot:title>Testing</template>
      <template v-slot:body>
        <p>Some body</p>
      </template>
    </modal>
  </div>
</template>

<script>
import { ref } from "vue";
import { initWeb3 } from "@/common/web3.js";
import { useRouter } from "vue-router";
import Modal from "@/components/util/Modal";

export default {
  name: "Home",
  components: {
    Modal,
  },
  setup() {
    const router = useRouter();

    const isConnected = ref(false);

    const isVisible = ref(false);

    const connect = async () => {
      try {
        await initWeb3();
        isConnected.value = true;
        router.push("/app");
      } catch (e) {
        console.debug("error", e);
        alert(e.message);
      }
    };

    return {
      connect,
      isVisible,
    };
  },
};
</script>

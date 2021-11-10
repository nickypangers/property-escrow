<template>
  <div class="home">
    <div>
      <button @click="connect">Connect Account</button>
    </div>
    <!-- <div>
      <button @click="isVisible = !isVisible">Toggle Modal</button>
    </div> -->
    <modal :is-visible="isVisible" @cancel="isVisible = false">
      <template v-slot:title>{{ modal.title }}</template>
      <template v-slot:body>
        <p>{{ modal.body }}</p>
      </template>
    </modal>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
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

    const modal = reactive({
      title: "",
      body: "",
    });

    const connect = async () => {
      try {
        await initWeb3();
        isConnected.value = true;
        router.push("/app");
      } catch (e) {
        // console.debug("error", e);
        modal.title = "Error";
        modal.body = e.message;
        isVisible.value = true;
        // alert(e);
      }
    };

    return {
      connect,
      isVisible,
      modal,
    };
  },
};
</script>

<template>
  <div>
    <!-- <div class="container mx-auto px-20"> -->
    <section id="actions">
      <div class="w-full flex justify-end items-center">
        <!-- <div>{{ store.state.accounts[0] }} : {{ balance }} ETH</div> -->
        <button
          class="bg-green-accent rounded-xl p-3 text-white"
          @click="router.push('/app/create')"
        >
          Create Listing
        </button>
      </div>
    </section>
    <section id="table">
      <template v-if="!isPropertyListLoaded">
        <div class="w-full flex justify-center">
          <loader />
        </div>
      </template>
      <template v-if="isPropertyListLoaded">
        <property-list-table
          :property-list="propertyList"
          @success="getPropertyList"
          @fail="setModal"
        />
      </template>
    </section>
    <modal :is-visible="isVisible" @cancel="closeModal" @confirm="goToDetail">
      <template v-slot:title>{{ modal.title }}</template>
      <template v-slot:body>
        <p>{{ modal.body }}</p>
      </template>
    </modal>
  </div>
</template>
<script>
import { ref, reactive, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import contract from "@/common/contract.js";
import { getBalance, formatEtherBalance } from "@/common/web3.js";
import PropertyListTable from "@/components/PropertyListTable";
import Loader from "@/components/util/Loader";
import Modal from "@/components/util/Modal";
export default {
  name: "AppHome",
  components: {
    PropertyListTable,
    Loader,
    Modal,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const propertyList = ref([]);
    const balance = computed(() => formatEtherBalance(store.state.balance, 5));

    const isPropertyListLoaded = ref(false);

    const isVisible = ref(false);
    const modal = reactive({
      title: "",
      body: "",
    });
    const closeModal = () => {
      isVisible.value = false;
    };
    const setModal = (title, body) => {
      modal.title = title;
      modal.body = body;
      isVisible.value = true;
    };
    const goToDetail = (id) => {
      router.push(`/app/detail/${id}`);
    };

    async function getPropertyList() {
      let list = await contract.getPropertyList();
      console.debug(list);
      propertyList.value = list;
    }

    const purchaseProperty = async (property) => {
      let transaction = await contract.purchaseProperty(property);
      console.log(transaction);
    };

    onMounted(() => {
      getBalance();
      contract.getPropertyList().then((list) => {
        propertyList.value = list;
        isPropertyListLoaded.value = true;
      });
    });

    return {
      store,
      propertyList,
      purchaseProperty,
      router,
      getPropertyList,
      balance,
      isPropertyListLoaded,
      closeModal,
      setModal,
      modal,
      goToDetail,
      isVisible,
    };
  },
};
</script>

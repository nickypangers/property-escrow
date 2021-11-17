<template>
  <div>
    <!-- <div class="container mx-auto px-20"> -->
    <div class="w-full flex justify-end items-center">
      <!-- <div>{{ store.state.accounts[0] }} : {{ balance }} ETH</div> -->
      <button class="green-button action-button" @click="toCreateListing">
        Create Listing
      </button>
    </div>
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
      propertyList.value = list.filter(
        (property) => property.isActive === true
      );
    }

    const purchaseProperty = async (property) => {
      let transaction = await contract.purchaseProperty(property);
      console.log(transaction);
    };

    const toCreateListing = () => {
      if (!store.state.isConnected) {
        setModal("Error", "Please connect to the network");
        return;
      }
      router.push("/app/create");
    };

    onMounted(async () => {
      getBalance();
      try {
        await getPropertyList();
      } catch (e) {
        alert(e.message);
      }
      isPropertyListLoaded.value = true;
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
      toCreateListing,
    };
  },
};
</script>

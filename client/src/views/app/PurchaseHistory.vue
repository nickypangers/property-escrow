<template>
  <div>
    <div>
      <div class="w-full flex justify-between items-center">
        <p class="text-xl font-bold">Purchase History</p>
      </div>
      <template v-if="!isPropertyListLoaded">
        <div class="w-full flex justify-center">
          <loader />
        </div>
      </template>
      <template v-if="isPropertyListLoaded">
        <property-list-table :property-list="propertyList" />
      </template>
    </div>
    <modal :is-visible="isVisible" @cancel="closeModal">
      <template v-slot:title>{{ modal.title }}</template>
      <template v-slot:body>
        <p>{{ modal.body }}</p>
      </template>
    </modal>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from "vue";
import Loader from "@/components/util/Loader";
import contract from "@/common/contract.js";
import { useStore } from "vuex";
import PropertyListTable from "@/components/PropertyListTable";
import Modal from "@/components/util/Modal";

export default {
  name: "ManageMyListings",
  components: {
    Loader,
    PropertyListTable,
    Modal,
  },
  setup() {
    const isPropertyListLoaded = ref(false);
    const propertyList = ref([]);
    const store = useStore();
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

    const setPropertyList = (list) => {
      propertyList.value = list;
      isPropertyListLoaded.value = true;
    };

    onMounted(async () => {
      try {
        let list = await contract.getPropertyListByAddressIsBuyer(
          store.state.accounts[0]
        );
        // console.log(list);
        setPropertyList(list);
      } catch (e) {
        setPropertyList([]);
        setModal("Error", e.message);
      }
    });

    return {
      isPropertyListLoaded,
      propertyList,
      closeModal,
      modal,
      isVisible,
    };
  },
};
</script>

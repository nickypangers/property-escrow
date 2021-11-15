<template>
  <div>
    <div class="w-full flex justify-between items-center">
      <p class="text-xl font-bold">Manage My Listings</p>
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
</template>

<script>
import { ref, onMounted } from "vue";
import Loader from "@/components/util/Loader";
import contract from "@/common/contract.js";
import { useStore } from "vuex";
import PropertyListTable from "@/components/PropertyListTable";
export default {
  name: "ManageMyListings",
  components: {
    Loader,
    PropertyListTable,
  },
  setup() {
    const isPropertyListLoaded = ref(false);
    const propertyList = ref([]);
    const store = useStore();

    const setPropertyList = (list) => {
      propertyList.value = list;
      isPropertyListLoaded.value = true;
    };

    onMounted(async () => {
      try {
        let list = await contract.getPropertyListByAddressIsOwner(
          store.state.accounts[0]
        );
        setPropertyList(list);
      } catch (e) {
        setPropertyList([]);
        alert(e.message);
      }
    });

    return {
      isPropertyListLoaded,
      propertyList,
    };
  },
};
</script>

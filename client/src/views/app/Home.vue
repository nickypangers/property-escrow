<template>
  <div class="container mx-auto px-20">
    <section id="actions">
      <div class="w-full flex justify-between items-center">
        <div>{{ store.state.accounts[0] }} : {{ balance }} ETH</div>
        <button
          class="bg-green-200 rounded-xl p-3"
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
          @refresh="getPropertyList"
        />
      </template>
    </section>
  </div>
</template>
<script>    
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import contract from "@/common/contract.js";
import { getBalance, formatEtherBalance } from "@/common/web3.js";
import PropertyListTable from "@/components/PropertyListTable";
import Loader from "@/components/util/Loader";
export default {
  name: "AppHome",
  components: {
    PropertyListTable,
    Loader,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const propertyList = ref([]);
    const balance = computed(() => formatEtherBalance(store.state.balance, 5));

    const isPropertyListLoaded = ref(false);

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
    };
  },
};
</script>

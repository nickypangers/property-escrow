<template>
  <section id="propertyDetail">
    <div v-if="property == null" class="w-full flex justify-center">
      <hollow-dots-spinner :dot-size="15" :dots-num="3" color="#3498db" />
    </div>
    <div
      v-if="property != null"
      class="flex flex-col align-center justify-center"
    >
      <!-- <pre>{{ property.isSold }}</pre> -->
      <table class="table-auto border-collapse border border-green-800">
        <tr>
          <th>Property Name</th>
          <td>{{ property.name }}</td>
        </tr>
        <tr>
          <th>Property Description</th>
          <td>{{ property.description }}</td>
        </tr>
        <tr>
          <th>Property Address 1</th>
          <td>{{ property.propertyAddress.address1 }}</td>
        </tr>
        <tr>
          <th>Property Address 2</th>
          <td>{{ property.propertyAddress.address2 }}</td>
        </tr>
        <tr>
          <th>Property City</th>
          <td>{{ property.propertyAddress.city }}</td>
        </tr>
        <tr>
          <th>Property Province</th>
          <td>{{ property.propertyAddress.province }}</td>
        </tr>
        <tr>
          <th>Property Postcode</th>
          <td>{{ property.propertyAddress.postcode }}</td>
        </tr>
        <tr>
          <th>Property Country</th>
          <td>{{ property.propertyAddress.country }}</td>
        </tr>
        <tr>
          <th>Seller</th>
          <td>
            <a
              :href="getEtherscanLink(property.owner)"
              target="_blank"
              rel="noopener noreferrer"
              >{{ property.owner }}</a
            >
          </td>
        </tr>
        <tr v-if="property.isSold">
          <th>Buyer</th>
          <td>
            <a
              :href="getEtherscanLink(property.buyer)"
              target="_blank"
              rel="noopener noreferrer"
              >{{ property.buyer }}</a
            >
          </td>
        </tr>
        <tr>
          <th>Listed Price</th>
          <td>{{ formatEtherBalance(property.price, 18) }} ETH</td>
        </tr>
      </table>
      <div class="mt-3 text-left">
        <button class="mr-3 p-3 rounded-xl bg-blue-200" v-if="!property.isSold">
          Purchase
        </button>
        <button class="p-3 rounded-xl bg-blue-200" v-if="isOwner">Edit</button>
      </div>
    </div>
  </section>
</template>
<script>
import { useRoute } from "vue-router";
import { ref, computed, onMounted } from "vue";
import contract from "@/common/contract.js";
import { HollowDotsSpinner } from "epic-spinners";
import { formatEtherBalance } from "@/common/web3.js";
import { useStore } from "vuex";

export default {
  name: "PropertyDetail",
  components: {
    HollowDotsSpinner,
  },
  setup() {
    const route = useRoute();
    const store = useStore();

    const property = ref(null);

    const isOwner = computed(() => {
      return store.state.accounts[0] === property.value.owner;
    });

    const getEtherscanLink = (address) => {
      return "https://ropsten.etherscan.io/address/" + address;
    };

    onMounted(() => {
      console.log(route.params.id);
      contract.getPropertyDetail(route.params.id).then((res) => {
        console.log(res);
        property.value = res;
      });
    });
    return {
      route,
      property,
      formatEtherBalance,
      getEtherscanLink,
      isOwner,
    };
  },
};
</script>
<style lang="scss" scoped>
th {
  @apply text-left;
}
td {
  @apply text-center;
}

th,
td {
  @apply p-3 border border-black;
}
</style>

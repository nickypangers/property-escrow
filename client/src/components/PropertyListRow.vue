<template>
  <tr>
    <td>{{ property.id }}</td>
    <td>{{ property.name }}</td>
    <td>{{ property.propertyAddress.country }}</td>
    <td>
      {{ concealAddress(property.owner) }}
    </td>

    <td>{{ formatEtherBalance(property.price, 18) }} ETH</td>
    <td>
      <button class="p-2 bg-blue-200 rounded-xl" @click="goToPropertyDetail">
        View More
      </button>
    </td>
    <td>
      <button class="p-2 bg-gray-200 rounded-xl" v-if="isPurchaseLoading">
        <hollow-dots-spinner :dot-size="10" :dots-num="3" color="#3498db" />
      </button>
      <div v-if="!isPurchaseLoading">
        <button
          class="p-2 bg-blue-200 rounded-xl"
          v-if="!property.isSold && !isOwner"
          @click="purchaseProperty(property)"
        >
          Purchase
        </button>
        <button
          class="p-2 bg-blue-200 rounded-xl"
          v-if="!property.isSold && isOwner"
          @click="goToEdit"
        >
          Edit
        </button>
        <button
          class="p-2 bg-gray-200 rounded-xl cursor-default"
          v-if="property.isSold"
        >
          Sold
        </button>
      </div>
    </td>
  </tr>
</template>
<script>
import { ref, computed } from "vue";
import { ethers } from "ethers";
import contract from "@/common/contract.js";
import { formatEtherBalance } from "@/common/web3.js";
import { HollowDotsSpinner } from "epic-spinners";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { concealAddress } from "@/common/strings.js";

export default {
  props: {
    property: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["success"],
  components: {
    HollowDotsSpinner,
  },
  setup(props, { emit }) {
    const router = useRouter();
    const store = useStore();

    const isPurchaseLoading = ref(false);

    const isOwner = computed(() => {
      return props.property.owner === store.state.accounts[0];
    });

    const getEtherscanLink = (address) => {
      return "https://ropsten.etherscan.io/address/" + address;
    };

    const goToEdit = () => {
      router.push({ name: "Edit", params: { id: props.property.id } });
    };

    const goToPropertyDetail = () => {
      router.push({
        name: "PropertyDetail",
        params: { id: props.property.id },
      });
    };

    const purchaseProperty = async (property) => {
      try {
        isPurchaseLoading.value = true;
        await contract.purchaseProperty(property);
        // console.log(transaction);
        emit("success");
        isPurchaseLoading.value = false;
      } catch (e) {
        isPurchaseLoading.value = false;
        alert(e);
      }
    };

    return {
      ethers,
      getEtherscanLink,
      purchaseProperty,
      isPurchaseLoading,
      goToPropertyDetail,
      isOwner,
      formatEtherBalance,
      concealAddress,
      goToEdit,
    };
  },
};
</script>

<template>
  <tr>
    <td>{{ property.id }}</td>
    <td>{{ property.name }}</td>
    <td>{{ property.propertyAddress.country }}</td>
    <td>
      <a
        :href="getEtherscanLink(property.owner)"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ property.owner }}
      </a>
    </td>

    <td>{{ ethers.utils.formatEther(property.price) }} ETH</td>
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
          v-if="!property.isSold"
          @click="purchaseProperty(property)"
        >
          Purchase
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
import { ref } from "vue";
import { ethers } from "ethers";
import contract from "@/common/contract.js";
import { HollowDotsSpinner } from "epic-spinners";
import { useRouter } from "vue-router";
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

    const isPurchaseLoading = ref(false);

    const getEtherscanLink = (address) => {
      return "https://ropsten.etherscan.io/address/" + address;
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
        let transaction = await contract.purchaseProperty(property);
        console.log(transaction);
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
    };
  },
};
</script>

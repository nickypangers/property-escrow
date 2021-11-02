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
      <button class="p-2 bg-blue-200 rounded-xl">View More</button>
    </td>
    <td>
      <button
        class="p-2 bg-blue-200 rounded-xl"
        v-if="!property.isSold"
        @click="purchaseProperty(property)"
      >
        Purchase
      </button>
      <button class="p-2 bg-red-200 rounded-xl" v-if="property.isSold">
        Sold
      </button>
    </td>
  </tr>
</template>
<script>
import { ethers } from "ethers";
import contract from "@/common/contract.js";
export default {
  props: {
    property: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["success"],
  setup(_, { emit }) {
    const getEtherscanLink = (address) => {
      return "https://ropsten.etherscan.io/address/" + address;
    };

    const purchaseProperty = async (property) => {
      let transaction = await contract.purchaseProperty(property);
      if (transaction == null) {
        return;
      }
      console.log(transaction);
      emit("success");
    };

    return {
      ethers,
      getEtherscanLink,
      purchaseProperty,
    };
  },
};
</script>

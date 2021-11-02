<template>
  <table class="w-full table-auto">
    <thead>
      <tr>
        <th>Listing ID</th>
        <th>Property Name</th>
        <th>Property Country</th>
        <th>Seller</th>
        <th>Price</th>
        <th></th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="property in propertyList" :key="'property-' + property.id">
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
    </tbody>
  </table>
</template>
<script>
import { ethers } from "ethers";
export default {
  props: {
    propertyList: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["purchase"],
  setup(props, { emit }) {
    const getEtherscanLink = (address) => {
      return "https://ropsten.etherscan.io/address/" + address;
    };

    const purchaseProperty = (property) => {
      emit("purchase", property);
    };

    return {
      ethers,
      getEtherscanLink,
      purchaseProperty,
    };
  },
};
</script>

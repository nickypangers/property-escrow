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
      <property-list-row
        v-for="property in propertyList"
        :key="'property-' + property.id"
        :property="property"
        @success="emit('refresh')"
      />
    </tbody>
  </table>
</template>
<script>
import { ethers } from "ethers";
import PropertyListRow from "@/components/PropertyListRow";
export default {
  props: {
    propertyList: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["refresh"],
  components: {
    PropertyListRow,
  },
  setup(props, { emit }) {
    return {
      ethers,
      emit,
    };
  },
};
</script>

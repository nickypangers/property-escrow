<template>
  <table class="w-full table-auto mt-2 bg-white rounded-xl">
    <thead>
      <tr class="border-b">
        <th>Listing ID</th>
        <th>Property Name</th>
        <th>Property Country</th>
        <th>Seller</th>
        <th>Price</th>
        <th></th>
        <th></th>
      </tr>
    </thead>
    <tbody class="divide-y">
      <property-list-row
        v-for="property in propertyList"
        :key="'property-' + property.id"
        :property="property"
        @success="emit('success')"
        @fail="fail"
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
  emits: ["success", "fail"],
  components: {
    PropertyListRow,
  },
  setup(props, { emit }) {
    const fail = (title, body) => {
      emit("fail", title, body);
    };

    return {
      ethers,
      emit,
      fail,
    };
  },
};
</script>

<style lang="scss" scoped>
th {
  @apply p-4;
}
</style>

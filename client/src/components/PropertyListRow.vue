<template>
  <tr>
    <td>{{ property.id }}</td>
    <td>{{ property.name }}</td>
    <td>{{ property.propertyAddress.country }}</td>
    <td>
      {{ concealAddress(property.owner) }}
    </td>

    <td>{{ formatEtherBalance(property.price, 2) }} ETH</td>
    <td>
      <button class="clickable" @click="goToPropertyDetail">View More</button>
    </td>
    <td>
      <button v-if="isPurchaseLoading" disabled>
        <hollow-dots-spinner :dot-size="10" :dots-num="3" color="#3498db" />
      </button>
      <div v-if="!isPurchaseLoading">
        <button
          class="clickable"
          v-if="!property.isSold && !isOwner"
          @click="purchaseProperty(property)"
        >
          Purchase
        </button>
        <button
          class="clickable"
          v-if="!property.isSold && isOwner"
          @click="goToEdit"
        >
          Edit
        </button>
        <button class="non-clickable" v-if="property.isSold">Sold</button>
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
  emits: ["success", "fail"],
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
        // alert(e);
        emit("fail", "Purchase Failed", e.message);
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

<style lang="scss" scoped>
td {
  @apply p-4;
}

button {
  @apply rounded-xl w-full p-2 text-black;
}

.clickable {
  @apply bg-green-accent text-white;
}

.non-clickable {
  @apply bg-gray-200 cursor-default;
}
</style>

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
      <button class="green-button action-button" @click="goToPropertyDetail">
        View More
      </button>
    </td>
    <td>
      <div v-if="isConnected">
        <button v-if="isPurchaseLoading" disabled>
          <hollow-dots-spinner :dot-size="10" :dots-num="3" color="#3498db" />
        </button>
        <div v-if="!isPurchaseLoading">
          <button
            class="green-button action-button"
            v-if="!property.isSold && !isOwner"
            @click="purchaseProperty(property)"
          >
            Purchase
          </button>
          <template v-if="property.isActive">
            <button
              class="green-button action-button"
              v-if="!property.isSold && isOwner"
              @click="goToEdit"
            >
              Edit
            </button>
          </template>
          <template v-if="!property.isActive">
            <button
              class="non-clickable action-button bg-gray-200"
              v-if="property.isSold"
            >
              Sold
            </button>
            <button
              class="non-clickable action-button bg-red-accent"
              v-if="!property.isSold"
            >
              <p class="text-white">Cancelled</p>
            </button>
          </template>
        </div>
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
    const isConnected = computed(() => store.state.isConnected);

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
        await contract.getTotalAmountTransacted();
        await contract.getTotalListingsSold();
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
      isConnected,
    };
  },
};
</script>

<style lang="scss" scoped>
td {
  @apply p-4;
}

button {
  @apply w-full;
}

.non-clickable {
  @apply cursor-default;
}
</style>

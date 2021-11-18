import store from "@/store/index.js";
import { ethers } from "ethers";
import { getBalance } from "./web3.js";
// import { getProvider, getBalance } from "./web3.js";
// import { formatEtherBalance } from "./web3.js";

// async function estimateGas() {
//   const provider = await getProvider();

// }

const options = {
  // gasPrice: 50000000000,
};

function getContract() {
  if (!store.state.isConnected) {
    return store.state.readOnlyContract;
  }
  return store.state.contract;
}

export default {
  async createListing(listing) {
    try {
      let contract = getContract();
      const txResponse = await contract.createListing(
        listing.propertyAddress.address1,
        listing.propertyAddress.address2,
        listing.propertyAddress.city,
        listing.propertyAddress.province,
        listing.propertyAddress.postcode,
        listing.propertyAddress.country,
        listing.name,
        listing.description,
        ethers.utils.parseEther(`${listing.price}`, "ether")
      );
      const txReceipt = await txResponse.wait();
      // console.debug("txReceipt", txReceipt);
      return { transaction: txReceipt.transactionHash };
    } catch (e) {
      // console.debug("error", e);
      alert(e.message);
    }
  },
  async getPropertyList() {
    try {
      let contract = getContract();
      const propertyList = await contract.getPropertyList();
      // console.log(propertyList);
      await getBalance();
      return propertyList;
    } catch (e) {
      console.log(e.message);
      throw e;
    }
  },
  async purchaseProperty(property) {
    // console.debug("property", property.price);
    let contract = getContract();
    const txResponse = await contract.payProperty(property.id, {
      from: store.state.accounts[0],
      value: property.price,
    });
    const txReceipt = await txResponse.wait();
    // console.debug("txReceipt", txReceipt);
    await getBalance();

    return { transaction: txReceipt.transactionHash };
  },
  async getPropertyDetail(id) {
    let contract = getContract();
    let property = {
      id: "",
      name: "",
      description: "",
      price: "",
      propertyAddress: {
        address1: "",
        address2: "",
        city: "",
        province: "",
        postcode: "",
        country: "",
      },
      owner: "",
      buyer: "",
      isActive: "",
      isSold: "",
    };
    var propertyDetail = await contract.getPropertyDetail(id);
    for (const [key] of Object.entries(property)) {
      for (const [pdKey, pdValue] of Object.entries(propertyDetail)) {
        if (key == pdKey) {
          property[key] = pdValue;
        }
      }
    }
    // property.price = formatEtherBalance(property.price, 18);
    // console.debug("property", property);
    await getBalance();

    return property;
  },
  async editProperty(property) {
    try {
      let contract = getContract();
      const txResponse = await contract.editProperty(
        property.id,
        property.name,
        property.description,
        ethers.utils.parseEther(`${property.price}`, "ether")
        // property.price
      );
      const txReceipt = await txResponse.wait();
      // console.debug("txReceipt", txReceipt);
      await getBalance();

      return { transaction: txReceipt.transactionHash };
    } catch (e) {
      console.debug("error", e);
      throw e;
    }
  },

  // async getPropertyListByAddressIsOwner(id) {
  //   try {
  //     let contract = getContract();
  //     const propertyList = await contract.getPropertyListByAddressIsOwner(id);
  //     await getBalance();
  //     return propertyList;
  //   } catch (e) {
  //     console.error(e);
  //   }
  // },

  async getPropertyListByAddressIsOwner(address) {
    try {
      let contract = getContract();
      console.log(contract);
      const propertyList = await contract.getPropertyListByAddressIsOwner(
        address,
        options
      );
      await getBalance();
      return propertyList;
    } catch (e) {
      console.log(e);
      throw e;
    }
  },

  async getPropertyListByAddressIsBuyer(address) {
    try {
      let contract = getContract();
      console.log(contract);

      const propertyList = await contract.getPropertyListByAddressIsBuyer(
        address,
        options
      );
      await getBalance();
      return propertyList;
    } catch (e) {
      console.log(e);
      throw e;
    }
  },

  async getTotalAmountTransacted() {
    try {
      let contract = getContract();
      let totalAmountTransacted = await contract.getTotalAmountTransacted();
      store.commit("setTotalAmountTransacted", totalAmountTransacted);
    } catch (e) {
      console.log(e);
      throw e;
    }
  },

  async getTotalListingsSold() {
    try {
      let contract = getContract();
      let totalListingsSold = await contract.getTotalListingsSold();
      store.commit("setTotalListingsSold", totalListingsSold);
    } catch (e) {
      console.log(e);
      throw e;
    }
  },

  async cancelListing(id) {
    try {
      let contract = getContract();
      const txResponse = await contract.cancelListing(id);
      const txReceipt = await txResponse.wait();
      // console.debug("txReceipt", txReceipt);
      await getBalance();
      return { transaction: txReceipt.transactionHash };
    } catch (e) {
      console.log(e);
      throw e;
    }
  },

  getPropertyStatus(property) {
    if (property.isActive) {
      return "Actve";
    }
    if (!property.isActive) {
      if (property.isSold) {
        return "Sold";
      }

      return "Cancelled";
    }

    return "";
  },
};

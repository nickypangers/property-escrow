import store from "@/store/index.js";
import { ethers } from "ethers";
import { formatEtherBalance } from "./web3.js";

export default {
  async createListing(listing) {
    try {
      let contract = store.state.contract;
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
      console.debug("txReceipt", txReceipt);
      return { transaction: txReceipt.transactionHash };
    } catch (e) {
      console.debug("error", e);
      alert(e.message);
    }
  },
  async getPropertyList() {
    let contract = store.state.contract;
    const propertyList = await contract.getPropertyList();
    return propertyList;
  },
  async purchaseProperty(property) {
    console.debug("property", property.price);
    try {
      let contract = store.state.contract;
      const txResponse = await contract.payProperty(property.id, {
        from: store.state.accounts[0],
        value: property.price,
      });
      const txReceipt = await txResponse.wait();
      console.debug("txReceipt", txReceipt);
      return { transaction: txReceipt.transactionHash };
    } catch (e) {
      console.debug("error", e);
      throw e;
    }
  },
  async getPropertyDetail(id) {
    let contract = store.state.contract;
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
    property.price = formatEtherBalance(property.price, 18);
    console.debug("property", property);
    return property;
  },
  async editProperty(property) {
    try {
      let contract = store.state.contract;
      const status = contract.editProperty(
        property.id,
        property.name,
        property.description,
        ethers.utils.parseEther(`${property.price}`, "ether")
      );
      return status;
    } catch (e) {
      console.debug("error", e);
      throw e;
    }
  },
};

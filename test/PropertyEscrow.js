const { expect } = require("chai");

describe("PropertyEscrow contract", function () {
  let Escrow;
  let propertyEscrow;

  beforeEach(async function () {
    Escrow = await ethers.getContractFactory("PropertyEscrow");
    propertyEscrow = await Escrow.deploy();
  });

  describe("View", function () {
    it("Deployment should assign properties length 0", async function () {
      const propertiesLength = await propertyEscrow.getPropertyLength();
      expect(propertiesLength).to.equal(0);
    });
  });

  describe("Admin", async function () {
    beforeEach(async function () {
      [owner, addr1] = await ethers.getSigners();
    });

    it("Get is owner a manager should return true", async function () {
      const isManager = await propertyEscrow.isManager(owner.address);
      expect(isManager).to.equal(true);
    });

    it("Get is addr1 a manager should return false", async function () {
      const isManager = await propertyEscrow.isManager(addr1.address);
      expect(isManager).to.equal(false);
    });

    it("Execute set manager from non-owner should revert", async function () {
      await expect(
        propertyEscrow.connect(addr1.address).setManager(addr1.address, true)
      ).to.be.reverted;
    });

    it("Add addr1 to manager and get should return true", async function () {
      const isManager = await propertyEscrow.isManager(addr1.address);
      expect(isManager).to.equal(false);

      await propertyEscrow.setManager(addr1.address, true);
      const newIsManager = await propertyEscrow.isManager(addr1.address);
      expect(newIsManager).to.equal(true);
    });
  });

  describe("Property", async function () {
    beforeEach(async function () {
      [owner, addr1] = await ethers.getSigners();

      const propertiesLength = await propertyEscrow
        .connect(owner)
        .getPropertyLength();
      expect(propertiesLength).to.equal(0);
      await propertyEscrow
        .connect(owner)
        .createListing(
          "123",
          "456",
          "789",
          "nt",
          "00000",
          "Russia",
          "Prop name",
          "Some description",
          1
        );
    });

    it("Create property should increase properties by 1", async function () {
      const newPropertiesLength = await propertyEscrow.getPropertyLength();
      expect(newPropertiesLength).to.equal(1);
    });

    it("Get property is active should return true", async function () {
      const propertyIsActive = await propertyEscrow.getPropertyIsActive(1);
      expect(propertyIsActive).to.equal(true);
    });

    it("Get property price should return 1", async function () {
      const price = await propertyEscrow.getPropertyPrice(1);
      expect(price).to.equal(1);
    });

    it("Incorrect property id should return revert Property not found", async function () {
      await expect(propertyEscrow.getPropertyIsActive(9)).to.be.revertedWith(
        "Property not found"
      );
    });

    it("Cancel listing then get property is active should return false", async function () {
      await propertyEscrow.cancelListing(1);
      const isActive = await propertyEscrow.getPropertyIsActive(1);
      expect(isActive).to.equal(false);
    });

    it("Cancel listing by non-property owner should revert", async function () {
      await expect(propertyEscrow.connect(addr1.address).cancelListing(1)).to.be
        .reverted;
    });

    it("Get property is sold of unsold property should return false", async function () {
      const isSold = await propertyEscrow.getPropertyIsSold(1);
      expect(isSold).to.be.equal(false);
    });

    it("Purchse own property should revert", async function () {
      await expect(
        propertyEscrow.payProperty(1, { from: owner.address, value: 1 })
      ).to.be.reverted;
    });

    it("Purchase property from non-property owner then get property is sold should return true", async function () {
      await propertyEscrow
        .connect(addr1)
        .payProperty(1, { from: addr1.address, value: 1 });
      const isSold = await propertyEscrow.getPropertyIsSold(1);
      expect(isSold).to.be.equal(true);
    });

    it("Purchase property from non-property owner then get property is active should return false", async function () {
      await propertyEscrow
        .connect(addr1)
        .payProperty(1, { from: addr1.address, value: 1 });
      const isSold = await propertyEscrow.getPropertyIsActive(1);
      expect(isSold).to.be.equal(false);
      const property = await propertyEscrow.getPropertyDetail(1);
      expect(property.buyer).to.equal(addr1.address);
    });

    it("Get property should return property", async function () {
      const property = await propertyEscrow.getPropertyDetail(1);
      //    "123",
      //     "456",
      //     "789",
      //     "nt",
      //     "00000",
      //     "Russia",
      //     "Prop name",
      //     "Some description",
      //     1
      expect(property.propertyAddress.address1).to.equal("123");
      expect(property.propertyAddress.address2).to.equal("456");
      expect(property.propertyAddress.city).to.equal("789");
      expect(property.propertyAddress.province).to.equal("nt");
      expect(property.propertyAddress.postcode).to.equal("00000");
      expect(property.propertyAddress.country).to.equal("Russia");
      expect(property.name).to.equal("Prop name");
      expect(property.description).to.equal("Some description");
      expect(property.price).to.equal(1);
    });

    it("Get property list should return list length of 1", async function () {
      const propertyList = await propertyEscrow.getPropertyList();
      expect(propertyList.length).to.equal(1);
    });

    it("Edit property should return property with new information", async function () {
      const property = await propertyEscrow.getPropertyDetail(1);
      expect(property.name).to.equal("Prop name");
      await propertyEscrow.editProperty(
        1,
        "Prop name Edit",
        "Some Description Edit",
        3
      );
      const newProperty = await propertyEscrow.getPropertyDetail(1);
      expect(newProperty.name).to.equal("Prop name Edit");
      expect(newProperty.description).to.equal("Some Description Edit");
      expect(newProperty.price).to.equal(3);
    });

    it("Get property list by address is owner should return list length of 1", async function () {
      // [owner, addr1] = await ethers.getSigners();

      await propertyEscrow
        .connect(addr1)
        .createListing(
          "123",
          "456",
          "789",
          "nt",
          "00000",
          "Russia",
          "Prop name",
          "Some description",
          1
        );

      const propertyList = await propertyEscrow.getPropertyList();
      expect(propertyList.length).to.equal(2);

      const propertyListByAddressIsOwner =
        await propertyEscrow.getPropertyListByAddressIsOwner(owner.address);

      expect(propertyListByAddressIsOwner.length).to.equal(1);
      expect(propertyListByAddressIsOwner[0].owner).to.equal(owner.address);
    });

    it("Get property list as address is buyer should return list of 1", async function () {
      await propertyEscrow
        .connect(addr1)
        .createListing(
          "123",
          "456",
          "789",
          "nt",
          "00000",
          "Russia",
          "Prop name",
          "Some description",
          1
        );

      const propertyList = await propertyEscrow.getPropertyList();
      expect(propertyList.length).to.equal(2);

      // console.log(propertyList[1]);

      await propertyEscrow
        .connect(addr1)
        .payProperty(1, { from: addr1.address, value: 1 });

      const propertyListByAddressIsBuyer =
        await propertyEscrow.getPropertyListByAddressIsBuyer(addr1.address);

      // console.log(propertyListByAddressIsBuyer);

      expect(propertyListByAddressIsBuyer.length).to.equal(1);
    });

    it("Get total listings sold should return 0", async function () {
      const totalListingsSold = await propertyEscrow.getTotalListingsSold();
      expect(totalListingsSold).to.equal(0);
    });

    it("Get total listings sold after purchase a listing should return 1", async function () {
      await propertyEscrow
        .connect(addr1)
        .payProperty(1, { from: addr1.address, value: 1 });

      const totalListingsSold = await propertyEscrow.getTotalListingsSold();

      expect(totalListingsSold).to.equal(1);
    });
  });
});

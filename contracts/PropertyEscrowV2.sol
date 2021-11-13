// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

contract PropertyEscrow {
    mapping(address => bool) managers;

    address _owner;

    struct Property {
        uint256 id;
        string name;
        string description;
        PropertyAddress propertyAddress;
        uint256 price;
        address owner;
        address buyer;
        bool isSold;
        bool onHold;
        bool isActive;
        bool isVerified;
    }

    struct PropertyAddress {
        string address1;
        string address2;
        string city;
        string province;
        string postcode;
        string country;
    }

    Property[] private properties;

    uint256 private id;

    

    constructor() {
        _owner = msg.sender;
        managers[_owner] = true;
        id = 1;
    }

    /**@dev Allows execution by managers only */
    modifier onlyManagers() {
        require(managers[msg.sender], "Only managers can execute");
        _;
    }

    /**@dev Allows execution by owner only */
    modifier onlyOwner() {
        require(msg.sender == _owner, "Only owner can execute");
        _;
    }

    modifier onlyPropertyOwner(uint256 _id) {
        Property memory property = getProperty(_id);
        require(
            msg.sender == property.owner,
            "Only property owner can execute"
        );
        _;
    }

    function setManager(address manager, bool state)
        public
        onlyOwner
        returns (bool)
    {
        managers[manager] = state;
        return true;
    }

    function isManager(address manager)
        public
        view
        onlyManagers
        returns (bool)
    {
        return managers[manager];
    }

    function createListing(
        string memory address1,
        string memory address2,
        string memory city,
        string memory province,
        string memory postcode,
        string memory country,
        string memory name,
        string memory description,
        uint256 price
    ) public returns (uint256) {
        PropertyAddress memory propertyAddress = PropertyAddress({
            address1: address1,
            address2: address2,
            city: city,
            province: province,
            postcode: postcode,
            country: country
        });
        Property memory property = Property({
            id: id,
            name: name,
            description: description,
            propertyAddress: propertyAddress,
            price: price,
            owner: msg.sender,
            buyer: address(0),
            isSold: false,
            onHold: false,
            isActive: true,
            isVerified: false
        });

        properties.push(property);

        id = id + 1;

        return property.id;
    }

    function editProperty(
        uint256 _id,
        string memory name,
        string memory description,
        uint256 price
    ) public onlyPropertyOwner(_id) returns (bool) {
        for (uint256 i = 0; i < properties.length; i = i + 1) {
            if (properties[i].id == _id) {
                require(
                    properties[i].isActive == true,
                    "Property is not active"
                );
                require(properties[i].isSold == false, "Property is sold");

                properties[i].name = name;
                properties[i].description = description;
                properties[i].price = price;
                return true;
            }
        }
        revert("Property not found");
    }

    function getPropertyPrice(uint256 _id) public view returns (uint256) {
        Property memory property = getProperty(_id);

        return property.price;
    }

    function getPropertyLength() public view returns (uint256) {
        return properties.length;
    }

    function getPropertyDetail(uint256 _id)
        public
        view
        returns (Property memory)
    {
        Property memory property = getProperty(_id);
        return property;
    }

    function cancelListing(uint256 _id)
        public
        onlyPropertyOwner(_id)
        returns (bool)
    {
        for (uint256 i = 0; i < properties.length; i = i + 1) {
            if (properties[i].id == _id) {
                properties[i].isActive = false;
                return true;
            }
        }

        revert("Property not found");
    }

    function getPropertyIsActive(uint256 _id) public view returns (bool) {
        Property memory property = getProperty(_id);
        return property.isActive;
    }

    function payProperty(uint256 _id) public payable returns (bool) {
        for (uint256 i = 0; i < properties.length; i = i + 1) {
            if (properties[i].id == _id) {
                require(
                    msg.sender != properties[i].owner,
                    "Cannot purchase own property"
                );

                require(
                    msg.value == properties[i].price,
                    "Transaction amount does not equal to asking amount"
                );

                properties[i].isSold = true;
                properties[i].isActive = false;
                properties[i].buyer = msg.sender;

                address seller = properties[i].owner;
                payable(seller).transfer(properties[i].price);

                return true;
            }
        }

        revert("Property not found");
    }

    function setPropertyIsVerified(uint256 _id, bool _isVerified)
        public
        onlyManagers
        returns (bool)
    {
        for (uint256 i = 0; i < properties.length; i = i + 1) {
            if (properties[i].id == _id) {
                properties[i].isVerified = _isVerified;
                return true;
            }
        }

        revert("Property not found");
    }

    function getPropertyIsSold(uint256 _id) public view returns (bool) {
        Property memory property = getProperty(_id);
        return property.isSold;
    }

    function getPropertyList() public view returns (Property[] memory) {
        return properties;
    }

    function getProperty(uint256 _id) private view returns (Property memory) {
        for (uint256 i = 0; i < properties.length; i = i + 1) {
            if (properties[i].id == _id) {
                return properties[i];
            }
        }

        revert("Property not found");
    }

    function getTotalAmountTransacted() public view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < properties.length; i = i + 1) {
            if (properties[i].isSold == true) {
                total = total + properties[i].price;
            }
        }

        return total;
    }
}

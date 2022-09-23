// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract BuyMeACoffee {
    //event to emit when a memo is created
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    // memo struct
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // address of contract deployer
    address payable owner;

    // list of all memos from friends
    Memo[] memos;

    // store the address of the deployer as a payable address
    constructor() {
        owner = payable(msg.sender);
    }

    /**
     * @dev retrieve all the memos received & stored on the blockchain
     */
    function getMemos() public view returns(Memo[] memory) {
            return memos;
    }

    /**
     * @dev buy a coffee for contract owner
     * @param _name name of coffee buyer
     * @param _message message from the coffee buyer
    */
    function buySmallCoffee(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "Can't buy a coffee with 0 ETH");

        // add the memo to storage
        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        //emit a log event when a new memo is created
        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );
    }

    function buyLargeCoffee(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "Can't buy a coffee with 0 ETH");

        // add the memo to storage
        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        //emit a log event when a new memo is created
        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );
    }

    /**
     * @dev send entire balance stored in this contract to owner
     */
    function withdrawTips() public {
            require(owner.send(address(this).balance));
    }

    

    

}
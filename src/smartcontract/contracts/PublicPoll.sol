// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import 'hardhat/console.sol';

contract PublicPoll {

    address public owner;
    // string[] public tickersArray = new string[](0);
    string[] public tickersArray;

    constructor(string[] memory _tickersArray) {        
        owner = msg.sender;
        tickersArray = _tickersArray;
        console.log('Owner (msg.sender) = ', msg.sender);
        // tickersArray = new string[](0);
    }

    struct ticker {
        // string pollId;
        bool exists;
        uint256 agree;
        uint256 disagree;
        mapping(address => bool) Voters;
    }

    event tickerupdated (
        uint256 agree,
        uint256 disagree,
        address voter,
        string ticker
    );

    mapping(string => ticker) public Tickers;

    // function getTickerById(string memory pollId) public view returns (ticker memory) {
    //     ticker storage newTicker = Tickers[_ticker];
    //     // return Tickers[pollId];
    //     // return ticker.pollId;
    // }

    // function getTickerById(string memory pollId) public view returns (ticker memory) {
    //     return Tickers[pollId];
    // }
    
    // Throws error
    // function getVoteByAddress(ticker _ticker, address _address) public view returns (bool) {
    //     // vote storage newVote = Voters[_address];
    //     // poll storage newPoll = poll.Tickers('poll1');
    //     ticker storage newVote = ticker;
    //     // .Voters(_address).push();
    //     return newVote.Voters(_address);
    // }

    // function getTickerById(string pollId) public view returns (ticker _ticker) {
    //     return (_ticker[pollId]);
    // }

        // function getPerson(address id) public returns (Person) {
        //     return people[id];
        // }

    // To-do: allow users to create polls
    function addTicker(string memory _ticker) public {
        require(msg.sender == owner, "Only the owner can create tickers");
        ticker storage newTicker = Tickers[_ticker];
        newTicker.exists = true;
        // newTicker.pollId = 'poll' + (tickersArray.length + 1).toString();
        // newTicker.pollId = `poll${(tickersArray.length + 1)}`;
        // newTicker.pollId = 'poll1';
        tickersArray.push(_ticker);        
    }

    function vote(string memory _ticker, bool _vote) public {
        require(Tickers[_ticker].exists, "Can't vote on this statement");
        require(!Tickers[_ticker].Voters[msg.sender], "You have already voted on this");
        
        ticker storage t = Tickers[_ticker];
        t.Voters[msg.sender] = true;

        if(_vote){
            t.agree++;
        } else {
            t.disagree++;
        }

        emit tickerupdated (t.agree,t.disagree,msg.sender,_ticker);
    }

    
    function getTickers() public view returns (string[] memory) {
        // console.log(_tickers); // TypeError: Member "log" not found or not visible after argument-dependent lookup in type(library console).
        return tickersArray;
    }   
    // function getTicker() public view returns (ticker memory) {
    //     return ticker;
    // }

    // function getTickersLength() public view returns (uint) {
    //     console.log('getTickersLength:', tickersArray.length);
    //     return tickersArray.length;        
    // }
    

    function getVotes(string memory _ticker) public view returns (
        uint256 agree,
        uint256 disagree
    ){
        require(Tickers[_ticker].exists, "No such Ticker Defined");
        ticker storage t = Tickers[_ticker];
        return(t.agree,t.disagree);
        
    }    
    
    function getVoter(string memory _ticker, address _address) public view returns (bool hasVoted) {
        require(Tickers[_ticker].exists, "No such Ticker Defined");
        ticker storage t = Tickers[_ticker];
        return(t.Voters[_address]);
    }
}
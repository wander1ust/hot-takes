const { expect } = require("chai");
const { ethers } = require("hardhat");

const contractInstance = async () => {
  const Poll = await ethers.getContractFactory("PublicPoll");
  const poll = await Poll.deploy([]);
  await poll.deployed();
  return poll;
}

describe("PublicPoll", async function () {
  it("Should create a new poll", async function () {
    poll = await contractInstance();
    let { getTickers } = poll; 
    expect (await getTickers()).to.have.lengthOf(0);

    const addPollTx = await poll.addTicker('poll1');

    // wait until the transaction is mined
    await addPollTx.wait();

    expect (await getTickers()).to.have.lengthOf(1);    
    expect ((await getTickers())[0]).to.equal('poll1');

    // check that poll1 has been added to Tickers
    expect ((await getTickers()).includes('poll1')).to.equal(true);
    
    console.log('tickers:', (await getTickers())[0]);
  });
});

describe("Vote", function () {
  it("Should cast a single vote on a poll by voter", async function () {
    let { getTickers } = poll;
    const doesPoll1Exist = (await getTickers()).includes('poll1');
    const doesPoll2Exist = (await getTickers()).includes('poll2');
    expect (doesPoll1Exist).to.equal(true);
    expect (!doesPoll2Exist).to.equal(true);

    const castVote = await poll.vote('poll1', doesPoll1Exist);
    await castVote.wait();
    expect ((await poll.Tickers('poll1')).exists).to.equal(true);

    // confirm that user (owner) has voted on poll
    expect (await poll.getVoter('poll1', process.env.CONTRACT_OWNER_ADDRESS)).to.equal(true);
  })

  it("Should not allow vote recast", async function () {
    await expect(poll.vote('poll1', false))
        .to.be.revertedWith('You have already voted on this');

    console.log(await poll.getTickers()); // string
    console.log(await poll.Tickers('poll1'));

    console.log('hasOwnerVoted: ', await poll.getVoter('poll1', '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'));    
})
})


// it("Should only allow owner to create a poll", async function () {

// })
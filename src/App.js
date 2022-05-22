import React, { useEffect, useState } from "react";
import "./App.css";
import { ConnectButton, Modal, Button } from "web3uikit";
import logo from "./assets/images/logo.svg";
import yesNo from "./assets/images/yes-no.svg";
// import vote from "./images/vote.svg";
import Poll from "./components/Poll";
import { comments } from "./comments";
import { useMoralisWeb3Api, useMoralis } from "react-moralis";
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from "@ethersproject/providers";
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { uauth } from './components/helpers/web3-react-connector.ts';
import UAuth from '@uauth/js'

/* TODO: refactor, allow users to create polls
show results after vote
*/
const App = () => {
  const [poll1, setPoll1] = useState(0);
  const [poll2, setPoll2] = useState(0);
  const [poll3, setPoll3] = useState(0);
  const [poll4, setPoll4] = useState(0);
  const [poll5, setPoll5] = useState(0);
  const [poll6, setPoll6] = useState(0);
  const [poll7, setPoll7] = useState(0);
  const [poll8, setPoll8] = useState(0);
  const [poll9, setPoll9] = useState(0);
  const [poll10, setPoll10] = useState(0);
  // const [modalPrice, setModalPrice] = useState();
  const Web3Api = useMoralisWeb3Api();
  const {Moralis, account, isInitialized } = useMoralis();
  const [visible, setVisible] = useState(false);
  const [modalPollId, setModalPollId] = useState();

  async function getRatio(tick, setPerc){

    const Votes = Moralis.Object.extend("Votes");
    const query = new Moralis.Query(Votes);
    query.equalTo("ticker", tick);
    query.descending("createdAt");
    await Moralis.start({serverUrl: process.env.REACT_APP_MORALIS_SERVER_URL, appId: process.env.REACT_APP_MORALIS_APP_ID});
    const results = await query.first();
    if (results) {
      let up = Number(results.attributes.agree);
      let down = Number(results.attributes.disagree);
      let ratio = Math.round(up/(up+down)*100);
      setPerc(ratio);
    }
  }

  // TODO: Refactor
  useEffect(() => {
    if(isInitialized){
      getRatio("Poll 1", setPoll1);
      getRatio("Poll 2", setPoll2);
      getRatio("Poll 3", setPoll3);
      getRatio("Poll 4", setPoll4);
      getRatio("Poll 5", setPoll5);
      getRatio("Poll 6", setPoll6);
      getRatio("Poll 7", setPoll7);

    async function createLiveQuery(){
      let query = new Moralis.Query('Votes');
      let subscription = await query.subscribe();
      subscription.on('update', (object) => {
        
        if(object.attributes.ticker === "poll1"){
          getRatio("Poll 1", setPoll1);
        }
        else if(object.attributes.ticker === "poll2"){
          getRatio("Poll 2", setPoll2);
        }
        else if(object.attributes.ticker === "poll3"){
          getRatio("Poll 3", setPoll3);
        }        
        else if(object.attributes.ticker === "poll3"){
          getRatio("Poll 4", setPoll4);
        }        
        else if(object.attributes.ticker === "poll3"){
          getRatio("Poll 5", setPoll5);
        }        
        else if(object.attributes.ticker === "poll3"){
          getRatio("Poll 6", setPoll6);
        }        
        else if(object.attributes.ticker === "poll3"){
          getRatio("Poll 7", setPoll7);
        }

      });
    }

    createLiveQuery();
    }

  }, [isInitialized]);

  /*
  useEffect(() => {

    // temp static
    async function getPollerAddress() {
      const options = {
        address:
          comments[comments.findIndex((x) => x.token === modalPollId)].address,
      };
      // const price = await Web3Api.token.getTokenPrice(options);
      // setModalPrice(price.usdPrice.toFixed(2));
    }

    if(modalPollId){
      getPollerAddress()
  }
    
  }, [modalPollId]);
  */
 
  const uauth = new UAuth({
    clientID: process.env.REACT_APP_UD_CLIENT_ID,
    redirectUri: process.env.REACT_APP_REDIRECT_URI,
  })  

  const login = async () => {
      try {
        const authorization = await uauth.loginWithPopup();
        console.log(authorization);
      } catch (error) {
        console.error(error);
      }
    }

  uauth.user()
    .then((user) => {
      // user exists
      console.log("UD user information:", user)
    })
    .catch(() => {
      // user does not exist
    })

  /* UD - Web3 React Login
     Unhandled Rejection (Error): Invariant failed: No <Web3ReactProvider ... /> found.
     Problem: https://github.com/NoahZinsmeister/web3-react/issues/233?ref=bestofreactjs.com
     Solution(?): https://gist.github.com/charlower/50ed5e2d5ed4f49d657cdcd2ba672386
  */
  const { activate } = useWeb3React()

  // On login button click...
  async function handleUAuthConnect() {
    // const {activate} = useWeb3React()

    await activate(uauth)
  }

  // const login2 = async () => {
  //   alert('login');
  //   // On login button click...
  //   const provider = await web3modal.connect()
  //   // Save provider in state
  // }

  return (
    <>
      <div className="header">
        <ConnectButton className="moralisLogin" /> <br />
        <div className="logo">
          {/* <img src={yesNo} alt="logo" height="50px" /> */}
          {/* TrueDat */}
          {/* 🤨 &nbsp; SayWut? */}
          {/* Controversy */}
           <span id='title'>♨️ Hot Takes</span>
          {/* AgreeToDisagree */}
        </div>

        {/* Login with Unstoppable Domains */}
        <Button
            className="udLogin"
            color="red"
            onClick={login /*handleUAuthConnect*/}
            text="Login with Unstoppable"
            theme="colored"
            type="button"
          />
      </div>
      <div className="instructions">
        {/* <img src={logo} alt="agree disagree icon" height="100px" /><br/> */}
        {/* 🤔<br/> */}
        <hr/>
        {/* Do you agree with these statements?<br /> */}
        Cast your vote! <img src={logo} alt="vote icon" height="30px" /><br />
        <span className='caption'> Or leave your own HOT take. 🔥</span>
        <hr /><br />
      </div>
      {/* Filter by: Controversial, Popular */}
      <div className="list">
        <Poll statement={"Pineapples belong on pizza."} perc={poll1} setPerc={setPoll1} pollId={"poll1"} setModalPollId={setModalPollId} setVisible={setVisible}/>
        <Poll statement={"Toilet paper should always be over."} perc={poll2} setPerc={setPoll2} pollId={"poll2"} setModalPollId={setModalPollId} setVisible={setVisible}/>
        <Poll statement={"Abortion should be legal."} perc={poll3} setPerc={setPoll3} pollId={"poll3"} setModalPollId={setModalPollId} setVisible={setVisible}/>
        <Poll statement={"React is better than Angular."} perc={poll4} setPerc={setPoll4} pollId={"poll4"} setModalPollId={setModalPollId} setVisible={setVisible}/>
        <Poll statement={"All PoW blockchains should move to PoS."} perc={poll5} setPerc={setPoll5} pollId={"poll5"} setModalPollId={setModalPollId} setVisible={setVisible}/>
        <Poll statement={"Crypto needs to be regulated."} perc={poll6} setPerc={setPoll6} pollId={"poll6"} setModalPollId={setModalPollId} setVisible={setVisible}/>
        <Poll statement={"When it comes to mainstream adoption, decentralized ownership is a bug, not a feature. Most people will choose convenience, comfort, simplicity, and 'free' services over privacy, complexity, and high transaction fees."} perc={poll7} setPerc={setPoll7} pollId={"poll7"} setModalPollId={setModalPollId} setVisible={setVisible}/>
        <Poll statement={"Unlimited PTO is not a perk."} perc={poll8} setPerc={setPoll8} pollId={"poll8"} setModalPollId={setModalPollId} setVisible={setVisible}/>
        <Poll statement={"Cold beverages are best in every season."} perc={poll10} setPerc={setPoll10} pollId={"poll10"} setModalPollId={setModalPollId} setVisible={setVisible}/>
        <Poll statement={"Pour (non-dairy) milk first, THEN add cereal. In batches so that the cereal stays crunchy and flavorful & the milk doesn't turn sugary! Or eat and drink separately."} style={{padding: '0 1em', width:'20%!important'}} perc={poll9} setPerc={setPoll9} pollId={"poll9"} setModalPollId={setModalPollId} setVisible={setVisible}/>
      </div>

      <Modal
        isVisible={visible}
        onCloseButtonPressed={() => setVisible(false)}
        hasFooter={false}
        title={setModalPollId}
      >
        {/* <div>
          <span style={{ color: "white" }}>{`Price: `}</span>
          {modalPrice}$
        </div> */}


         <div>
          <span style={{ color: "white" }}>{`About`}</span>
        </div>
        <div>
          {modalPollId &&
            comments[comments.findIndex((x) => x.pollId === modalPollId)].comment}
        </div>
       
      </Modal>
    </>
  );
};

export default App;

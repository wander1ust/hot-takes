import React, { useEffect, useState } from "react";
import "./Poll.css";
import { Button } from "web3uikit";
import { useWeb3ExecuteFunction, useMoralis } from "react-moralis";

function Poll({ statement, perc, setPerc, pollId, setModalPollId, setVisible }) {
  const [color, setColor] = useState();
  const contractProcessor = useWeb3ExecuteFunction();
  const { isAuthenticated} = useMoralis();

  useEffect(() => {
    if (perc < 50) {
      setColor("#c43d08");
    } else {
      setColor("green");
    }
  }, [perc]);


  async function vote(upDown){

    let options = {
      contractAddress: "0xe91c69b3D09D6abF839Ce34F36Af2c3e2EE3A730",
      functionName: "vote",
      abi: [
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_ticker",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "_vote",
              "type": "bool"
            }
          ],
          "name": "vote",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ],
      params: {
        _ticker: pollId,
        _vote: upDown,
      },
    }


    await contractProcessor.fetch({
      params: options,
      onSuccess: () => {
        console.log("Vote casted!");
      },
      onError: (error) => {
        alert(error.data.message)
      }
    });

  }

  // ToCheck: Insufficient funds or variable misnomer?
  return (
    <>
      <div className="poll">
        <div className="statement">{statement}</div>

        <div className="votes">
          <Button 
            onClick={() => {
              if(isAuthenticated){
                vote(true)
              }else{
                alert("Login to vote")
              }}} 
            text="Agree 👍" 
            theme="primary" 
            type="button" 
          />

          <Button
            color="red"
            onClick={() => {
              if(isAuthenticated){
                vote(false)
              }else{
                alert("Login to vote")
              }}}
            text="Disagree 👎"
            theme="colored"
            type="button"
          />
        </div>
        <div className="votes">
            <Button
            // color="blue"
            onClick={()=>{
              setModalPollId(pollId)
              setVisible(true);
            }}
            text="Comments 💬"
            theme="translucent"
            type="button"
          />
        </div>
      </div>
    </>
  );
}

export default Poll;
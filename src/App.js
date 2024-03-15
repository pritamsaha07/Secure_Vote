import { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, Link } from "react-router-dom";
import { Client } from '@hashgraph/sdk';
import Abi from './Abi.json';
import AddVoter from './components/addvoter';
import AddCandidate from './components/addcandidate';
import AddVote from './components/vote';
import Result from './components/result';

const ethers = require("ethers");

function App() {
 
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
    hcsClient: null,
  })
  const [isConnected, setIsconnected] = useState(false)

  const connectWallet = async () => {
    const contractAddress = "0x1eD8f60D247CC2f7b4aD17676CbB390b957af618";
    const contractAbi=Abi;
    
    try {
      const { ethereum } = window;
      if (ethereum) {
        await ethereum.request({ method: "eth_requestAccounts" });
        const hcsClient = Client.forTestnet(); 
        hcsClient.setOperator('0xBCA5e3BC558200A0173426735Cd8509733276A20', '95dd060235727792d6a78e83d118dc7e968abd2395ef1faa3afd410f12c7d4ca'); 

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractAbi, signer);
        setIsconnected(true);

        setState({ provider, signer, contract });
      }
    } catch (error) {
      console.error(error);
    }
  };

 useEffect(() => {
    const chatbotConfig = {
      chatbotId: "9hFXWvCFFdLCDJDLqmkzQ",
      domain: "www.chatbase.co"
    };

   
    const script = document.createElement('script');
    script.src = "https://www.chatbase.co/embed.min.js";

   
    script.setAttribute('chatbotId', chatbotConfig.chatbotId);
    script.setAttribute('domain', chatbotConfig.domain);
    script.defer = true;

   
    document.body.appendChild(script);

    
    return () => {
      document.body.removeChild(script);
    };
  }, []);


  return (
    <div className="App">
      {isConnected ? (
        <>
          <div className="navbar">
            <div className="navbar-brand">
              SecureVote
            </div>
            <div className="nav-links">
              <Link to="/addcandidate" className="nav-link">Candidate Registration</Link>
              <Link to="/addvoter" className="nav-link">Voter Registration</Link>
              <Link to="/addvote" className="nav-link">Vote</Link>
              <Link to="/result" className="nav-link">Result</Link>
              
            </div>
          </div>
          <Routes>
            <Route path="addcandidate" element={<AddCandidate state={state}></AddCandidate>} />
            <Route path="addvoter" element={<AddVoter state={state}></AddVoter>} />
            <Route path="addvote" element={<AddVote state={state}></AddVote>}/>
            <Route path="result" element={<Result state={state}></Result>}/>
          </Routes>
        
        </>
      ) : (
        <button className="connect-button" onClick={connectWallet}>Connect to metamask</button>
        
      )}

    </div>
  );
}

export default App;

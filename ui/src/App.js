import './App.css';
import NavBar from './components/NavBar';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers'
import { Banner } from './components/Banner';
import { networks } from './networks';
import Home from './components/Home';

function App() {
  const [defaulterrorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState('Connect Wallet')
  const [isConnected, setIsConnected] = useState(false)
  const [accountName, setAccountName] = useState(null);
  const [networkName, setNetworkName] = useState(null)
  let nftContract;
  let isinitialzer=false;
  const ConnWalletHandler = () => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' }).then(result => {
        accountChangeHandler(result[0])
        setConnButtonText("Wallet Connected")
        setIsConnected(true);
        /*const web3=new Web3(result);
        let idNetwork = web3.eth.net.getId()
        console.log(NFTContractBuild.abi)
        console.log(NFTContractBuild)
        console.log(NFTContractBuild.networks[idNetwork].address)
         nftContract = new web3.eth.Contract(NFTContractBuild.abi, NFTContractBuild.networks[idNetwork].address);
        isinitialzer=true;*/
      })
    }
    else {
      const confirmDownload = window.confirm("You need to install MetaMask to use this wallet. Do you want to download it now?");
      if (confirmDownload) {
        window.location.href = "https://metamask.io/download.html";
      }
    }
  }
  /*const minToken = async  ()=> {
    if (!isinitialzer){
      await ConnWalletHandler()
    }
    console.log(nftContract)
  }*/

  const accountChangeHandler = (newAccount) => {
    getNetworkId()
    setDefaultAccount(newAccount);
    getUserBalance(newAccount.toString())
  }

  const getNetworkId = () => {
    window.ethereum.request({ method: 'net_version' }).then(async id => {
      console.log(id)
      setNetworkName(networks[id] || "ganache");
    });
  }

  const getUserBalance = (address) => {
    window.ethereum.request({ method: 'eth_getBalance', params: [address, 'latest'] }).then(balance => {
      setUserBalance(ethers.utils.formatEther(balance));
    })
  }

  const chainChangeHandler = () => {
    window.location.reload();
  }

  window.ethereum.on('accountsChanged', accountChangeHandler);
  window.ethereum.on('chainChanged', chainChangeHandler);

  
  return (
    <div className="App">
      <NavBar connectHandler={ConnWalletHandler} connButtonText={connButtonText} />
      {isConnected ? <Home connectHandler={ConnWalletHandler} userBalance={userBalance} userAddress={defaultAccount} networkname={networkName} /> : <Banner />}
    </div>
  );
}

export default App;

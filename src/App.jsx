import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Web3Modal from "web3modal" 
import { ethers, providers } from "ethers";
// import { connectWallet, address } from './ConnectWallet'
// import { ethers, providers } from "ethers" 

function App() {
  const [count, setCount] = useState(0)
  const [walletConnected, setWalletConnected] = useState(false) 
  const web3ModalRef = useRef(); 
  const [ens, setEns] = useState(""); 
  const [addressMain, setAddressMain] = useState(""); 

  const connectWallet = (web3modalRef) => {
    getProviderOrSigner(web3modalRef); 
    setWalletConnected(true); 
  }

  const getProviderOrSigner = async (web3modal) => {
    const provider = await web3modal.current.connect(); 
    const web3Provider = new providers.Web3Provider(provider); 

    const { chainId } = await web3Provider.getNetwork(); 
    console.log('Chain ID: ', chainId); 

    if (chainId != 5){
      const { ethereum } = window;   
      try {
          await ethereum.request({
              method: "wallet_switchEthereumChain", 
              params: [{ chainId: "0x5" }], 
          })
      } catch (error) {
          console.error(error)
      }
    }

    const signer = web3Provider.getSigner(); 
    const address = await signer.getAddress(); 
    setENSorAddress(address, web3Provider); 
    console.log("Address: ", address); 
  }
   
  const setENSorAddress = async (address, web3Provider) => {
    let ens = await web3Provider.lookupAddress(address); 

    if (ens){
      console.log('ENS: ', ens)
      setEns(ens)
    } else {
      console.log('Address: ', address)
      setAddressMain(address)
    }
  }
  

  useEffect(() => {
    web3ModalRef.current = new Web3Modal({
      network: "goerli", 
      providerOptions: {}, 
      disableInjectedProvider: false
    }); 
  })

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>ENS NAME</h1>
      <p>Connect your wallet to see your ENS name</p>
      <div className="card">
        <button onClick={ () => connectWallet(web3ModalRef)}>
          Connect wallet
        </button>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App

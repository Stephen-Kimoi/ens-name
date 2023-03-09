import { ethers, providers } from "ethers";
// import Web3Modal from "web3modal"

export let address; 

export const connectWallet = (web3modalRef) => {
    getProviderOrSigner(web3modalRef); 
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
  address = await signer.getAddress(); 
  console.log("Address: ", address); 
}
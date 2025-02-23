import { ethers } from 'ethers';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../constants/contract';

export async function mintNFT(tokenURI) {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    const tx = await contract.mint(tokenURI);
    await tx.wait();

    return {
      success: true,
      message: `NFT minted successfully! Transaction: ${tx.hash}`
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

// Add this temporary test function
export async function testContractConnection() {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    const name = await contract.name();
    console.log('Contract connection successful. Name:', name);
    return true;
  } catch (error) {
    console.error('Contract connection failed:', error);
    return false;
  }
} 
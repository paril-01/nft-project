import NFTCollection from '../artifacts/NFTCollection.json';

export const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
export const CONTRACT_ABI = NFTCollection.abi;
export const MUMBAI_RPC_URL = process.env.REACT_APP_MUMBAI_RPC_URL;
export const CHAIN_ID = 11155111; // Sepolia chain ID instead of Mumbai 
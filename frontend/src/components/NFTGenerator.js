import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from './Button';
import axios from 'axios';
import backgroundVideo from '../assets/background.mp4';
import { uploadToIPFS } from '../utils/ipfs';
import { mintNFT } from '../utils/mintNFT';
import { ethers } from 'ethers';
import { CHAIN_ID } from '../constants/contract';
import { testIPFSConnection, testContractConnection } from '../utils/ipfs';

const VideoBackground = styled.video`
  position: fixed;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: -1;
  object-fit: cover;
  opacity: 1;
  filter: brightness(0.9);
`;

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  padding: 2rem;
  gap: 2rem;
  position: relative;
  z-index: 1;
  background: transparent;
  
  @media (max-width: 1200px) {
    padding: 1.5rem;
    gap: 1.5rem;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  left: 100px;
  

  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
    padding: 0;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  padding: 2rem;
  background: rgba(26, 29, 38, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  position: relative;
  z-index: 1;
  max-width: 900px;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-top: -50px;
  }
`;

const Title = styled.h1`
  font-size: 7vw;
  margin-bottom: 1rem;
  position: relative;
  font-family: 'Arial', sans-serif;
  font-weight: 900;
  line-height: 1.1;
  top: -100px;
  left: 0;
  color:white;
  background: linear-gradient(30deg, 
    rgb(80, 231, 255) 0%,
    rgb(250, 16, 191) 50%,
    rgb(157, 0, 255) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 
    0 0 8px rgba(80, 231, 255, 0.4),
    0 0 16px rgba(157, 0, 255, 0.4);
  letter-spacing: -0.02em;
  text-transform: none;
  filter: brightness(1.4);

  @media (max-width: 1200px) {
    font-size: 4.5rem;
  }
  
  @media (max-width: 768px) {
    font-size: 3.5rem;
    text-align: center;
    margin-top: 2rem;
  }

  span {
    display: block;
    &:last-child {
      margin-top: -1.5rem;
    }
  }
`;

const Subtitle = styled.p`
  font-size: 2rem;
  color:rgb(235, 237, 241);
  max-width: 400px;
  line-height: 1.4;
  margin-top: 1rem;
  position: relative;
  top: -100px;
  @media (max-width: 768px) {
    font-size: 1.2rem;
    text-align: center;
    left: 0;
    margin: 1rem auto;
    max-width: 90%;
  }
`;

const Input = styled.input`
  width: 100%;
  top:100px;
  position: relative;
  max-width: 600px;
  padding: 1.2rem;
  margin: 2rem 0 1rem;
  background: rgba(46, 50, 62, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  top:100px;
  position: relative;
  max-width: 600px;
  padding: 1.2rem;
  margin-bottom: 1.5rem;
  background: rgba(42, 45, 54, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
`;

const ResultImage = styled.img`
  width: 100%;
  height: auto;
  max-width: 600px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  margin: 1rem 0;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 2rem;
  width: 100%;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const ActionButton = styled(Button)`
  padding: 2rem 03rem;
  border-radius: 30px;
  font-size: 2.2rem;
  font-weight: bolder;
  transition: all 0.3s ease;
  background: ${props => props.color ? 
    `linear-gradient(135deg, ${props.color} 0%, ${props.color}00 100%)` : 
    'linear-gradient(135deg,rgb(0, 255, 255) 0%,rgb(255, 0, 204) 50%,rgb(150, 0, 204) 100%)'};
  border: 2px solid rgba(255, 255, 255, 0.1);
  width: 320px;
  
  position: relative;
  top:100px;
  border: 2px solid white;
  
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    background: linear-gradient(135deg, #606060 0%, #383838 100%);
  }
`;
const Logo = styled.div`
  position: fixed;
  top: 40px;
  left: 40px;
  z-index: 100;
  font-size: 2.5rem;
  font-weight: 900;
  font-family: 'Arial', sans-serif;
  background: linear-gradient(30deg, 
    rgb(255, 0, 106) 0%,
    rgb(255, 0, 106) 30%,
    rgb(0, 255, 132) 50%,
    rgb(0, 255, 123) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 
    0 0 8px rgba(0, 190, 219, 0.4),
    0 0 16px rgba(78, 14, 118, 0.4);
  filter: brightness(2.2);
  pointer-events: none;
`;

const WalletButton = styled(Button)`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  background: ${props => props.connected ? 
    'linear-gradient(135deg, #00ffa3 0%,rgb(0, 51, 204) 100%)' : 
    'linear-gradient(135deg,rgb(71, 224, 229) 0%,rgb(143, 45, 195) 100%)'};
  border: 2px solid rgb(255, 255, 255);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }
`;

const StatusMessage = styled.p`
  color: ${props => props.error ? '#ff6b6b' : '#00ffa3'};
  text-align: center;
  margin: 1rem 0;
  font-size: 0.9rem;
`;

const GeneratedImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

const NFTGenerator = () => {
  const [nftName, setNftName] = useState('');
  const [nftDescription, setNftDescription] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintingStatus, setMintingStatus] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/generate', {
        prompt: `${nftName}. ${nftDescription}`,
      });
      
      setGeneratedImage(response.data.image_url);
      setIsGenerated(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate NFT');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const base64Data = generatedImage.split(',')[1];
    
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${nftName || 'generated-nft'}.png`;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setIsGenerated(false);
    setGeneratedImage('');
    setNftName('');
    setNftDescription('');
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask!');
        return;
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Check if we're on the correct network
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      
      if (network.chainId !== CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
          });
        } catch (error) {
          alert('Please switch to the Polygon Mumbai testnet');
          return;
        }
      }
      
      setWalletConnected(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet');
    }
  };

  const handleMintNFT = async () => {
    if (!walletConnected) {
      await connectWallet();
      if (!walletConnected) return;
    }

    setIsMinting(true);
    setMintingStatus('Preparing to mint...');

    try {
      // Convert base64 image to blob
      const base64Data = generatedImage.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });

      // Upload image to IPFS
      setMintingStatus('Uploading image to IPFS...');
      console.log('Starting image upload to IPFS...');
      const ipfsUrl = await uploadToIPFS(blob);
      console.log('Image uploaded to IPFS:', ipfsUrl);

      // Create metadata
      const metadata = {
        name: nftName,
        description: nftDescription,
        image: ipfsUrl
      };

      // Upload metadata to IPFS
      setMintingStatus('Uploading metadata to IPFS...');
      console.log('Starting metadata upload to IPFS...');
      const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
      const metadataUrl = await uploadToIPFS(metadataBlob);
      console.log('Metadata uploaded to IPFS:', metadataUrl);

      // Mint NFT
      setMintingStatus('Minting NFT...');
      const result = await mintNFT(metadataUrl);

      if (result.success) {
        setMintingStatus('NFT minted successfully!');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Minting error:', error);
      setMintingStatus(`Minting failed: ${error.message}`);
    } finally {
      setIsMinting(false);
    }
  };

  useEffect(() => {
    const testConnections = async () => {
      const ipfsWorking = await testIPFSConnection();
      console.log('IPFS Connection Test:', ipfsWorking ? 'Success' : 'Failed');
    };
    testConnections();
  }, []);

  return (
    <>
      <VideoBackground autoPlay muted loop playsInline>
        <source src={backgroundVideo} type="video/mp4" />
      </VideoBackground>
      <Logo>MetaMINT</Logo>
      <WalletButton 
        onClick={connectWallet} 
        connected={walletConnected}
      >
        {walletConnected ? 'Wallet Connected' : 'Connect Wallet'}
      </WalletButton>
      <Container>
        <LeftPanel>
          <Title>
            <span>NFT</span>
            <span>Generator</span>
          </Title>
          <Subtitle>Create unique NFTs with AI-powered suggestions</Subtitle>
        </LeftPanel>
        
        <RightPanel>
          <h2 style={{ color: 'white', textAlign: 'center', fontSize: '2rem' }}>
            Create Your NFT
          </h2>
          
          {!isGenerated ? (
            <>
              <Input
                placeholder="NFT Name"
                value={nftName}
                onChange={(e) => setNftName(e.target.value)}
              />
              <TextArea
                placeholder="Describe your NFT concept..."
                value={nftDescription}
                onChange={(e) => setNftDescription(e.target.value)}
              />
              <ActionButton onClick={handleGenerate} disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate NFT'}
              </ActionButton>
            </>
          ) : (
            <GeneratedImageContainer>
              <ResultImage src={generatedImage} alt="Generated NFT" />
              <ButtonGroup>
                <ActionButton 
                  onClick={handleDownload}
                  color="#00ffa3"
                >
                  Download NFT
                </ActionButton>
                <ActionButton 
                  onClick={handleReset}
                  color="#ff6b6b"
                >
                  Generate Another
                </ActionButton>
                <ActionButton 
                  onClick={handleMintNFT}
                  disabled={isMinting || !walletConnected}
                  color="#8247e5"
                >
                  {isMinting ? 'Minting...' : 'Mint NFT'}
                </ActionButton>
              </ButtonGroup>
              {mintingStatus && (
                <StatusMessage error={mintingStatus.includes('failed')}>
                  {mintingStatus}
                </StatusMessage>
              )}
            </GeneratedImageContainer>
          )}
          
          {error && <StatusMessage error>{error}</StatusMessage>}
        </RightPanel>
      </Container>
    </>
  );
};

export default NFTGenerator;
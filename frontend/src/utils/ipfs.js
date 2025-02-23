import axios from 'axios';

const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.REACT_APP_PINATA_SECRET_KEY;

export async function uploadToIPFS(file) {
    try {
        // Create form data
        const formData = new FormData();
        formData.append('file', file);

        // Upload to Pinata
        const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_SECRET_KEY
            }
        });

        return `ipfs://${response.data.IpfsHash}`;
    } catch (error) {
        console.error('IPFS upload error:', error);
        throw new Error(`Failed to upload to IPFS: ${error.message}`);
    }
}

// Test function
export async function testIPFSConnection() {
    try {
        const testBlob = new Blob(['test'], { type: 'text/plain' });
        const result = await uploadToIPFS(testBlob);
        console.log('IPFS Connection successful:', result);
        return true;
    } catch (error) {
        console.error('IPFS Connection failed:', error);
        return false;
    }
}
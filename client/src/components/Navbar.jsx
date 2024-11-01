import React, { useContext } from "react";
import { MetaMaskContext } from "../MetaMaskContext";
import { User } from 'lucide-react';

const Navbar = () => {
  const { account, connectToMetaMask } = useContext(MetaMaskContext);

  const handleAddNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x5afd',
            chainName: 'Sapphire Local Testnet',
            rpcUrls: ['http://localhost:8545'],
            nativeCurrency: {
              name: 'TEST',
              symbol: 'TEST',
              decimals: 18,
            },
            blockExplorerUrls: ['http://localhost:80'],
          },
        ],
      });
    } catch (error) {
      console.error("Failed to add network:", error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-black to-gray-900 h-16 w-full flex items-center px-6 shadow-md">
      <div className="flex items-center gap-3">
        <img src="/logo.svg" alt="On-Chain Future" className="w-10 h-10" />
        <h1 className="text-2xl font-semibold text-white tracking-wide">On-Chain Future</h1>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <button
          onClick={handleAddNetwork}
          className="bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-2 px-5 rounded-full shadow-lg transition-transform transform hover:scale-105 focus:outline-none"
        >
          Connect Network
        </button>

        <button
          onClick={connectToMetaMask}
          className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-white font-bold py-2 px-5 rounded-full shadow-lg transition-transform transform hover:scale-105 focus:outline-none"
        >
          {account ? (
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="font-medium">{`${account.slice(0, 6)}...${account.slice(-4)}`}</span>
            </div>
          ) : (
            "Connect Wallet"
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
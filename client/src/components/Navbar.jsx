// import React, { useState, useEffect } from "react";
// import { User, TrendingUp, TrendingDown } from 'lucide-react';
// import web3 from '../backend/contracts/web3';
// import futures from '../backend/contracts/futures';

// const Navbar = () => {
//   const [account, setAccount ] = useState(null);
//   const [profitLoss, setProfitLoss] = useState(null);

//   const connectToMetaMask = async () => {
//     if (window.ethereum) {
//       try {
//         const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//         setAccount(accounts[0]);
//         console.log('Connected to MetaMask account:', accounts[0]);
//       } catch (error) {
//         console.error('Error connecting to MetaMask:', error);
//       }
//     } else {
//       alert('MetaMask is not installed. Please install MetaMask!');
//     }
//   };

//   const handleAddNetwork = async () => {
//     try {
//       await window.ethereum.request({
//         method: 'wallet_addEthereumChain',
//         params: [
//           {
//             chainId: '0x5afd',
//             chainName: 'Sapphire Local Testnet',
//             rpcUrls: ['http://localhost:8545'],
//             nativeCurrency: {
//               name: 'TEST',
//               symbol: 'TEST',
//               decimals: 18,
//             },
//             blockExplorerUrls: ['http://localhost:80'],
//           },
//         ],
//       });
//     } catch (error) {
//       console.error("Failed to add network:", error);
//     }
//   };


//   const fetchProfitLoss = async () => {
//     const accounts = await web3.eth.getAccounts();
//     var totalPnl = await futures.methods.getnetPnl(accounts[0]).call();
//     totalPnl = Number(totalPnl)/1e18;
//     setProfitLoss(totalPnl.toFixed(2));
//   };

//   useEffect(() => {
//     if (account) {
//       fetchProfitLoss();
//       const intervalId = setInterval(fetchProfitLoss, 2000);

//       return () => clearInterval(intervalId);
//     } else {
//       setProfitLoss(null);
//     }
//   }, [account]);

//   return (
//     <nav className="bg-gradient-to-r from-gray-900 via-black to-gray-900 h-16 w-full flex items-center px-6 shadow-md">
//       <div className="flex items-center gap-3">
//         <img src="/logo.svg" alt="On-Chain Future" className="w-10 h-10" />
//         <h1 className="text-2xl font-semibold text-white tracking-wide">On-Chain Future</h1>
//       </div>

//       <div className="ml-auto flex items-center gap-4">
//       {profitLoss !== null && (
//           <div
//             className={`flex items-center gap-2 px-4 py-2 rounded-full ${
//               profitLoss >= 0
//                 ? 'bg-green-600/20 text-green-400'
//                 : 'bg-red-600/20 text-red-400'
//             }`}
//           >
//             {profitLoss >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
//             <span className="font-medium">${Math.abs(profitLoss).toFixed(2)}</span>
//           </div>
//         )}
//         <button
//           onClick={handleAddNetwork}
//           className="bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-2 px-5 rounded-full shadow-lg transition-transform transform hover:scale-105 focus:outline-none"
//         >
//           Connect Network
//         </button>

//         <button
//           onClick={connectToMetaMask}
//           className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-white font-bold py-2 px-5 rounded-full shadow-lg transition-transform transform hover:scale-105 focus:outline-none"
//         >
//           {account ? (
//             <div className="flex items-center gap-2">
//               <User className="w-5 h-5" />
//               <span className="font-medium">{`${account.slice(0, 6)}...${account.slice(-4)}`}</span>
//             </div>
//           ) : (
//             "Connect Wallet"
//           )}
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState, useEffect } from "react";
import { User, TrendingUp, TrendingDown } from 'lucide-react';
import web3 from '../backend/contracts/web3';
import futures from '../backend/contracts/futures';

const Navbar = () => {
  const [account, setAccount] = useState(null);
  const [profitLoss, setProfitLoss] = useState(null);

  const formatToIndianNumbering = (value) => {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(value);
  };

  const connectToMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        console.log('Connected to MetaMask account:', accounts[0]);
      } catch (error) {
        console.error('Error connecting to MetaMask:', error.message || error);
        alert(`Error connecting to MetaMask: ${error.message || error}`);
      }      
    } else {
      alert('MetaMask is not installed. Please install MetaMask!');
    }
  };

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

  const fetchProfitLoss = async () => {
    const accounts = await web3.eth.getAccounts();
    var totalPnl = await futures.methods.getnetPnl(accounts[0]).call();
    totalPnl = Number(totalPnl)/1e18;
    setProfitLoss(totalPnl.toFixed(2));
  };

  useEffect(() => {
    if (account) {
      fetchProfitLoss();
      const intervalId = setInterval(fetchProfitLoss, 2000);

      return () => clearInterval(intervalId);
    } else {
      setProfitLoss(null);
    }
  }, [account]);

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-black to-gray-900 h-16 w-full flex items-center px-6 shadow-md">
      <div className="flex items-center gap-3">
        <img src="/logo.svg" alt="On-Chain Future" className="w-10 h-10" />
        <h1 className="text-2xl font-semibold text-white tracking-wide">On-Chain Future</h1>
      </div>

      <div className="ml-auto flex items-center gap-4">
      {profitLoss !== null && (
          <div 
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              profitLoss >= 0 
                ? 'bg-green-600/20 text-green-400' 
                : 'bg-red-600/20 text-red-400'
            }`}
          >
            {profitLoss >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            <span className="font-medium">${formatToIndianNumbering(Math.abs(profitLoss).toFixed(2))}</span>
          </div>
        )}
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
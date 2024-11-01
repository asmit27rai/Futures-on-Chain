import React, { useState } from "react";
import web3 from "../backend/contracts/web3";
import futures from "../backend/contracts/futures";
import token from "../backend/contracts/token";

const BuySell = () => {
  const [leverage, setLeverage] = useState(1);
  const [tokenAmount, setTokenAmount] = useState(null);
  const [selectedAction, setSelectedAction] = useState("Buy");
  const [loading, setLoading] = useState(false);

  const handleTokenAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setTokenAmount(value);
    }
  };

  const handleExecute = async () => {
    if (!tokenAmount || parseFloat(tokenAmount) <= 0) {
      alert("Please enter a valid token amount");
      return;
    }

    try {
      setLoading(true);
      const accounts = await web3.eth.getAccounts();
      if (!accounts.length) {
        alert("No accounts found. Please connect your wallet.");
        return;
      }

      await token.methods
      .approve(
        futures.options.address,
        web3.utils.toWei(tokenAmount, "ether") * 1.05
      )
      .send({ from: accounts[0],
        gasPrice: web3.utils.toWei("200","gwei"),  // do 150 gwei for fast testing
        gas : 300000});

  await futures.methods
    .openPosition(leverage, web3.utils.toWei(tokenAmount, "ether"), selectedAction=="Buy")
    .send({
      from: accounts[0],
      gasPrice: web3.utils.toWei("200","gwei"),  // do 150 gwei for fast testing
      gas : 1000000 // do 150 gwei for fast testing
  });

      alert(`${selectedAction} position opened successfully!`);
      setTokenAmount("");
    } catch (error) {
      console.error("Error executing trade:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 p-8 flex flex-col text-white rounded-lg shadow-2xl space-y-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Buy/Sell Futures</h2>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setSelectedAction("Buy")}
          className={`px-6 py-2 rounded-full font-bold transition-all border-2 ${
            selectedAction === "Buy"
              ? "border-green-500 text-white bg-green-500/20"
              : "border-green-300 text-green-300"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setSelectedAction("Sell")}
          className={`px-6 py-2 rounded-full font-bold transition-all border-2 ${
            selectedAction === "Sell"
              ? "border-red-500 text-white bg-red-500/20"
              : "border-red-300 text-red-300"
          }`}
        >
          Sell
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2" htmlFor="leverage">
          Leverage: <span className="font-bold">{leverage}x</span>
        </label>
        <input
          type="range"
          id="leverage"
          value={leverage}
          onChange={(e) => setLeverage(parseInt(e.target.value))}
          min="1"
          max="100"
          className="w-full h-2 bg-blue-500 rounded-lg cursor-pointer transition-all accent-blue-600"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2" htmlFor="tokenAmount">
          Token Amount:
        </label>
        <input
          type="number"
          id="tokenAmount"
          value={tokenAmount}
          onChange={handleTokenAmountChange}
          placeholder="Enter token amount"
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <button
        onClick={handleExecute}
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : `Execute ${selectedAction}`}
      </button>

      <style jsx>{`
        /* Custom style to remove arrows on number input */
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield; /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default BuySell;
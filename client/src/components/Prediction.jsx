import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Bot } from 'lucide-react';
import web3 from "../backend/contracts/web3";
import futures from "../backend/contracts/futures";

const Prediction = () => {
  const [signal, setSignal] = useState("Neutral");
  const [signalChangeAnimation, setSignalChangeAnimation] = useState(false);
  const [recentSignals, setRecentSignals] = useState([]); // Track last signals

  const getSignalMessage = (signal) => {
    if (recentSignals.slice(-3).every(sig => sig === 'Buy')) {
      return "STRONG BUY SIGNAL DETECTED";
    }
    if (recentSignals.slice(-3).every(sig => sig === 'Sell')) {
      return "STRONG SELL SIGNAL DETECTED";
    }
    return signal === 'Buy' ? "BUY SIGNAL DETECTED" : signal === 'Sell' ? "SELL SIGNAL DETECTED" : "Neutral";
  };

  const getSignalDescription = (signal) => {
    switch (signal) {
      case 'Buy':
        return "Market momentum is bullish";
      case 'Sell':
        return "Market momentum is bearish";
      default:
        return "Analyzing market patterns";
    }
  };

  const fetchSignalData = async () => {
    const newSignal = Number(await futures.methods.modelSignal().call());
    console.log(newSignal);
    if (newSignal !== signal) {
      setSignalChangeAnimation(true);
      setTimeout(() => setSignalChangeAnimation(false), 300);
    }

    setSignal(newSignal);

    // Update recent signals list with the latest signal, keeping only last 4 signals
    setRecentSignals(prevSignals => {
      const updatedSignals = [...prevSignals.slice(-3), newSignal];
      return updatedSignals;
    });
  };

  useEffect(() => {
    fetchSignalData();
    const interval = setInterval(fetchSignalData, 90000);
    return () => clearInterval(interval);
  }, [signal]);

  const SignalIndicator = ({ signal }) => {
    let colorClass = 'text-gray-400';
    let IconComponent = AlertTriangle;

    if (signal === 'Buy') {
      colorClass = 'text-green-500';
      IconComponent = TrendingUp;
    } else if (signal === 'Sell') {
      colorClass = 'text-red-500';
      IconComponent = TrendingDown;
    }

    return (
      <div className={`rounded-full p-2 ${signal === 'Buy' ? 'bg-green-500/10' : signal === 'Sell' ? 'bg-red-500/10' : 'bg-gray-500/10'}`}>
        <IconComponent className={`w-6 h-6 ${colorClass}`} />
      </div>
    );
  };

  return (
    <section className="bg-gray-800/90 backdrop-blur-sm h-16 px-4 w-full border-b border-gray-700 m-4 border rounded">
      <div className="h-full max-w-screen-xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-400" />
          <span className="text-xs font-semibold text-blue-400">Trading Bot Analysis</span>
        </div>

        <div className="flex items-center gap-4">
          <SignalIndicator signal={signal} />
          <div className={`flex flex-col ${signalChangeAnimation ? 'animate-fade-in' : ''}`}>
            <span
              className={`text-sm font-bold ${
                signal === 'Buy' ? 'text-green-500' :
                signal === 'Sell' ? 'text-red-500' :
                'text-gray-400'
              }`}
            >
              {getSignalMessage(signal)}
            </span>
            <span className="text-[10px] text-gray-400">
              {getSignalDescription(signal)}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(2px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Prediction;
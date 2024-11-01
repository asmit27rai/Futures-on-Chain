import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

const Prediction = () => {
  const [predictedPrice, setPredictedPrice] = useState("0.00");
  const [signal, setSignal] = useState("Neutral");
  const [confidenceLevel, setConfidenceLevel] = useState("0%");
  const [predictionChangeAnimation, setPredictionChangeAnimation] = useState(false);

  const fetchDummyPredictionData = () => {
    const newPredictedPrice = (Math.random() * 100).toFixed(2);
    const newSignal = Math.random() > 0.5 ? "Buy" : "Sell";
    const newConfidenceLevel = `${(Math.random() * 100).toFixed(1)}%`;

    if (newSignal !== signal) {
      setPredictionChangeAnimation(true);
      setTimeout(() => setPredictionChangeAnimation(false), 300);
    }

    setPredictedPrice(newPredictedPrice);
    setSignal(newSignal);
    setConfidenceLevel(newConfidenceLevel);
  };

  useEffect(() => {
    fetchDummyPredictionData();
    const interval = setInterval(fetchDummyPredictionData, 2000);
    return () => clearInterval(interval);
  }, [signal]);

  const SignalIndicator = ({ signal }) => {
    let colorClass = 'text-gray-500';
    let IconComponent = AlertTriangle;

    if (signal === 'Buy') {
      colorClass = 'text-green-500';
      IconComponent = TrendingUp;
    } else if (signal === 'Sell') {
      colorClass = 'text-red-500';
      IconComponent = TrendingDown;
    }

    return <IconComponent className={`w-5 h-5 ${colorClass}`} />;
  };

  return (
    <section className="bg-gray-800/90 backdrop-blur-sm h-12 px-3 w-full border-b border-gray-700 m-4 border rounded">
      <div className="h-full max-w-screen-xl mx-auto flex items-center justify-between gap-4">

        {/* Predicted Price */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-medium text-gray-600 uppercase">Predicted Price</span>
          <span className={`text-sm font-bold text-blue-500 tabular-nums ${predictionChangeAnimation ? 'animate-pulse' : ''}`}>
            ${predictedPrice}
          </span>
        </div>

        {/* Trading Bot Signal */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            <SignalIndicator signal={signal} />
            <span className="text-[8px] font-medium text-gray-600 uppercase">Signal</span>
          </div>
          <span className={`text-sm font-bold ${signal === 'Buy' ? 'text-green-500' : 'text-red-500'} tabular-nums`}>
            {signal}
          </span>
        </div>

        {/* Confidence Level */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-medium text-gray-600 uppercase">Confidence Level</span>
          <span className="text-sm font-bold text-yellow-500 tabular-nums">
            {confidenceLevel}
          </span>
        </div>
      </div>

      <style>{`
        .animate-pulse {
          animation: pulse 0.3s ease-in-out;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </section>
  );
};

export default Prediction;
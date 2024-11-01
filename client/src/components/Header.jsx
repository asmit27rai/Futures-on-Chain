import React, { useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import futures from "../backend/contracts/futures";

const Header = () => {
  const [marketPrice, setMarketPrice] = useState("0.00");
  const [previousPrice, setPreviousPrice] = useState("0.00");
  const [dailyHigh, setDailyHigh] = useState("0.00");
  const [dailyLow, setDailyLow] = useState("0.00");
  const [indexPrice, setIndexPrice] = useState("0.00");
  const [priceDirection, setPriceDirection] = useState(null);
  const [dailyExchangeVolume, setDailyExchangeVolume] = useState("0.00");
  const [isLoading, setIsLoading] = useState(true);
  const [priceChangeAnimation, setPriceChangeAnimation] = useState(false);

  const formatInternationalNumber = (number) => {
    return Number(number).toLocaleString("en-US");
  };

  const fetchMarketData = useCallback(async () => {
    try {
      const [marketPrice, high, low, index, volume] = await Promise.all([
        futures.methods.currentMarketPrice().call(),
        futures.methods.dailyHigh().call(),
        futures.methods.dailyLow().call(),
        futures.methods.indexPrice().call(),
        futures.methods.dailyExchangeVolume().call(),
      ]);

      const newMarketPrice = (Number(marketPrice) / 1_000_000).toFixed(2);

      if (Number(newMarketPrice) > Number(previousPrice)) {
        setPriceDirection("up");
      } else if (Number(newMarketPrice) < Number(previousPrice)) {
        setPriceDirection("down");
      }

      if (newMarketPrice !== marketPrice) {
        setPriceChangeAnimation(true);
        setTimeout(() => setPriceChangeAnimation(false), 300);
      }

      setPreviousPrice(newMarketPrice);
      setMarketPrice(newMarketPrice);
      setDailyHigh((Number(high) / 1_000_000).toFixed(2));
      setDailyLow((Number(low) / 1_000_000).toFixed(2));
      setIndexPrice((Number(index) / 1_000_000).toFixed(2));
      // Convert volume to billions for Indian representation
      setDailyExchangeVolume((Number(volume) / 1_000_000_000).toFixed(2));
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching market data:", error);
      setIsLoading(false);
    }
  }, [previousPrice, marketPrice]);

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 1000);
    return () => clearInterval(interval);
  }, [fetchMarketData]);

  const PriceItem = ({ title, value, icon: Icon, color, suffix }) => (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-1">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-[8px] font-medium text-gray-600 uppercase">
          {title}
        </span>
      </div>
      <span className={`text-sm font-bold ${color} tabular-nums`}>
        ${formatInternationalNumber(value)}
        {suffix}
      </span>
    </div>
  );

  if (isLoading) {
    return (
      <div className="h-12 w-full flex items-center justify-center bg-gray-800/90 m-4 border rounded">
        <Activity className="w-5 h-5 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <header className="bg-gray-800/90 backdrop-blur-sm h-16 px-3 w-full border-b border-gray-700 m-4 border rounded">
      <div className="h-full max-w-screen-xl mx-auto flex items-center justify-between gap-3">
        <PriceItem
          title="Market Price"
          value={marketPrice}
          icon={priceDirection === "up" ? TrendingUp : TrendingDown}
          color={
            priceChangeAnimation
              ? priceDirection === "up"
                ? "animate-green"
                : "animate-red"
              : "text-gray-500"
          }
        />

        <PriceItem
          title="Daily High"
          value={dailyHigh}
          icon={ArrowUp}
          color="text-blue-500"
        />

        <PriceItem
          title="Daily Low"
          value={dailyLow}
          icon={ArrowDown}
          color="text-red-500"
        />

        <PriceItem
          title="Index Price"
          value={indexPrice}
          icon={Activity}
          color="text-yellow-500"
        />

        <PriceItem
          title="Daily Exchange Volume"
          value={dailyExchangeVolume}
          icon={Activity}
          color="text-yellow-500"
          suffix="M"
        />
      </div>

      <style jsx>{`
        .animate-green {
          color: #22c55e;
          animation: pulseGreen 0.3s ease-in-out;
        }

        .animate-red {
          color: #ef4444;
          animation: pulseRed 0.3s ease-in-out;
        }

        @keyframes pulseGreen {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
            color: #22c55e;
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes pulseRed {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
            color: #ef4444;
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </header>
  );
};

export default Header;

// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9 <=0.8.24;

import {Subcall} from "@oasisprotocol/sapphire-contracts/contracts/Subcall.sol";

interface IMintableERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function mint(address to, uint256 amount) external;
}
contract Oracle {
    IMintableERC20 public token;

    // Configuration
    uint8 public threshold;
    bytes21 public roflAppID;
    uint256 public openCalls = 0;
    uint256 public calls = 0;
    uint128 public currentMarketPrice=0;
    uint128 public dailyExchangeVolume=0;
    uint128 public dailyHigh=0;
    uint128 public dailyLow=0;
    uint128 public indexPrice=0;
    int128 public modelSignal=0;

    // OHLCV Data Structure
    struct OHLCV {
        uint128 open;
        uint128 high;
        uint128 low;
        uint128 close;
        uint128 volume;
        uint256 blockNumber;
    }

    struct FuturesContract {
        uint128 leverage;
        uint128 entryPrice;
        uint128 tokenUnits;
        uint128 collateral;
        uint256 timestamp;
        bool isBuy; // true for Buy, false for Sell
    }

    // Orderbook structure
    struct Orderbook {
        uint128 bidPrice;
        uint128 bidVolume;
        uint128 askPrice;
        uint128 askVolume;
        uint256 blockNumber;
    }

    Orderbook[30] public orderbookHistory;
    uint public orderbookIndex = 0;

     function submitOrderbookData(
        uint128 bidPrice,
        uint128 bidVolume,
        uint128 askPrice,
        uint128 askVolume
    ) external {
        Subcall.roflEnsureAuthorizedOrigin(roflAppID); // Ensures authorized access

        // Update orderbook history array with new data
        orderbookHistory[orderbookIndex] = Orderbook({
            bidPrice: bidPrice,
            bidVolume: bidVolume,
            askPrice: askPrice,
            askVolume: askVolume,
            blockNumber: block.number
        });

        // Increment index for circular buffer effect
        orderbookIndex = (orderbookIndex + 1) % orderbookHistory.length;
    }

    // Function to retrieve the entire orderbook history
    function getOrderbookHistory() external view returns (Orderbook[30] memory) {
        return orderbookHistory;
    }






    mapping(address => FuturesContract[]) public openPositions;
    mapping(address => FuturesContract[]) public settledPositions;
    mapping(address => uint256[2]) public positionsCount; // [0] = open, [1] = settled
    mapping(address => int128[]) public pnlHistory;
    mapping(address => int128) public netPnl;

    OHLCV[30] public ohlcvHistory;
    uint256 public historyIndex = 0;

    constructor(bytes21 _roflAppID, uint8 _threshold, address _token) {
        require(_threshold > 0, "Invalid threshold");
        roflAppID = _roflAppID;
        threshold = _threshold;
        token = IMintableERC20(_token);
        for(uint i = 0;i<30;i++){ //shift the array
            ohlcvHistory[i]=OHLCV({
            open: 0,
            high: 0,
            low: 0,
            close: 0,
            volume: 0,
            blockNumber: block.number
        });
        }
    }
    function updateModelSignal(
        int128 newModelSignal
    )  external
    {
        Subcall.roflEnsureAuthorizedOrigin(roflAppID);
        modelSignal = newModelSignal;
    }
     // Submit OHLCV observation via authorized ROFL runtime
    function submitOHLCVObservation(
        uint128 open,
        uint128 high,
        uint128 low,
        uint128 close,
        uint128 volume
    ) external {
        Subcall.roflEnsureAuthorizedOrigin(roflAppID); // Ensure only authorized origin
        bool diffenentData = false;
        if(ohlcvHistory[29].open!=open || ohlcvHistory[29].high!=high || ohlcvHistory[29].low!=low || ohlcvHistory[29].close!=close || ohlcvHistory[29].volume!=volume){
            diffenentData = true;
        }
        if(!diffenentData){
            return;
        }
        for (uint i = 0; i < 29; i++) {
            ohlcvHistory[i] = ohlcvHistory[i + 1];
        }
        // Add the new observation
        ohlcvHistory[29] = OHLCV({
            open: open,
            high: high,
            low: low,
            close: close,
            volume: volume,
            blockNumber: block.number
        });
    }

    // Submit market price observation via authorized ROFL runtime
    function submitMarketObservations(
        uint128 _marketPrice,
        uint128 _dailyExchangeVolume,
        uint128 _dailyHigh,
        uint128 _dailyLow
    ) external {
        Subcall.roflEnsureAuthorizedOrigin(roflAppID);
        dailyExchangeVolume = _dailyExchangeVolume;
        indexPrice = (_marketPrice +currentMarketPrice)/2; // by defination works like average
        currentMarketPrice = _marketPrice;
        dailyHigh = _dailyHigh;
        dailyLow = _dailyLow;
    }

    function getOHLCVHistory() external view returns (OHLCV[30] memory) {
        return ohlcvHistory;
    }

    function openPosition(uint128 _leverage, uint128 tokenAmount, bool _isBuy) external {
        require(_leverage >= 1 && _leverage <= 100, "Invalid leverage");
        //
        require(token.balanceOf(msg.sender) >= tokenAmount, "Insufficient token balance");
        token.transferFrom(msg.sender, address(this), tokenAmount);
        //
        openPositions[msg.sender].push(FuturesContract({
            leverage: _leverage,
            entryPrice: currentMarketPrice,
            tokenUnits: tokenAmount,
            collateral: tokenAmount,
            timestamp: block.timestamp,
            isBuy: _isBuy
        }));

        positionsCount[msg.sender][0]++;
    }

    function closePosition(uint256 positionIndex) external {
        require(positionIndex < openPositions[msg.sender].length, "Invalid position index");

        FuturesContract memory position = openPositions[msg.sender][positionIndex];
        int128 pnl = calculatePnL(msg.sender, positionIndex);
        settledPositions[msg.sender].push(position);
        pnlHistory[msg.sender].push(pnl);
        if(settledPositions[msg.sender].length==0&& openPositions[msg.sender].length==0)
        {
            netPnl[msg.sender] = 0;
        }
        if (pnl < 0) {
            uint128 loss = uint128(-pnl);
            if (loss >= position.collateral) {
                _removePosition(msg.sender, positionIndex); // Liquidate position
            } else {
                netPnl[msg.sender] -= int128(loss)*int128(position.entryPrice);
                _removePosition(msg.sender, positionIndex); // Return remaining collateral
                token.transfer(msg.sender, position.collateral - loss); // Return remaining collateral after loss
            }
        } else {
            uint128 profit = uint128(pnl);
            netPnl[msg.sender] += int128(profit)*int128(position.entryPrice);
            _removePosition(msg.sender, positionIndex); // Transfer profit + collateral
            token.transfer(msg.sender, position.collateral + profit); // Return remaining collateral after loss
        }

        positionsCount[msg.sender][0]--;
        positionsCount[msg.sender][1]++;
    }

    function calculatePnL(address user, uint256 positionIndex) public view returns (int128) {
        FuturesContract memory position = openPositions[user][positionIndex];
        int128 priceDiff;

        if (position.isBuy) {
            priceDiff = int128(currentMarketPrice) - int128(position.entryPrice);
        } else {
            priceDiff = int128(position.entryPrice) - int128(currentMarketPrice);
        }

        return (priceDiff * int128(position.tokenUnits) * int128(position.leverage)) / int128(position.entryPrice);
    }

    // Internal function to remove a position without leaving a gap
    function _removePosition(address user, uint256 index) internal {
        uint256 length = openPositions[user].length;
        if (index < length - 1) {
            openPositions[user][index] = openPositions[user][length - 1];
        }
        openPositions[user].pop();
    }

    function getnetPnl(address user) external view returns(int128) {
        return netPnl[user];
    }
}
// npx hardhat compile
// export PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
// npx hardhat deploy rofl1qqn9xndja7e2pnxhttktmecvwzz0yqwxsquqyxdf --network sapphire-localnet
# Futures on Chain: A Secure and Confidential On-Chain Futures Trading Platform

This project introduces an innovative on-chain futures trading solution built on the Oasis Sapphire blockchain and using ROFL (Runtime OffChain Logic). This combination creates a secure, confidential, and tamper-proof trading environment. Traders can engage in futures contracts for a custom ERC-20 token, which dynamically mirrors a real-world currency like ETH. Through real-time price updates, a machine-learning-powered trading bot, and privacy-preserving execution, this platform enables reliable trading experiences, balancing both data security and transparency.

Video explaination: https://youtu.be/nJHYSz8WUD0

# System Design

<p align="center">
  <img src="./public/System_Design.png" alt="Futures on Chain Logo" width="800">
</p>

## Key Features

### 1. On-Chain Futures Trading

- **Capability**: Users can execute futures contracts on-chain for a custom ERC-20 token, pegged to a real-world currency.
- **Transparency**: The platform handles gains and losses by adjusting the trader's balance, enabling transparent and auditable on-chain transactions.
<p align="center">
  <img src="./public/futuresonchain.png" alt="Futures on Chain Logo">
</p>

### 2. Simulated Price Fluctuations with Tamper-Proof Oracle Integration

- **External Price Linkage**: The ERC-20 token's value reflects live market prices through ROFL, simulating real-time conditions.
- **Tamper-Resistance**: ROFL ensures securely fetched and unmanipulated price updates, empowering traders to make informed futures decisions with trustworthy data.

### 3. AI-Powered Trading Bot with LSTM Model for Market Predictions

- **Predictive Modeling**: A trading bot powered by an LSTM (Long Short-Term Memory) model analyzes historical data and suggests “Buy,” “Strongly Buy,” “Sell,” or “Strongly Sell” actions.
- **Data-Driven Insights**: This recommendation engine, combined with ROFL's trusted data, provides strategic market insights for traders.

<p align="center">
  <img src="./public/header.png" alt="Header">
</p>

### 4. Automated Profit and Loss Management

- **Profit Management**: In profitable trades, the platform mints new tokens for payout, allowing traders to realize their gains instantly.
- **Loss Management**: For losses, the platform deducts the trader's posted collateral, ensuring fair trade handling and funds availability.
<p align="center">
  <img src="./public/live.png" alt="Header">
</p>

### 5. Privacy-Preserving Execution with Trusted Execution Environments (TEEs)

- **Confidentiality**: Using Oasis’s Sapphire blockchain and TEEs, trade activities remain private while ensuring on-chain verification.
- **Security and Transparency**: TEEs allow secure, auditable trade execution without compromising trader data confidentiality.

### 6. Trade History and Performance Tracking

- **Comprehensive Record Keeping**: Traders can access transaction history and performance metrics directly through their wallets.
- **Immutable Storage**: On-chain storage of trade records ensures data reliability and helps traders optimize strategies over time.
<p align="center">
  <img src="./public/close.png" alt="Header">
</p>

## Why ROFL?

ROFL is essential to the platform’s success due to its tamper-resistant price data capabilities:

- **Data Integrity**: Ensures price data authenticity, guarding against manipulation and fraud in decentralized environments.
- **AI Integration**: Supports the LSTM-based trading bot, providing reliable price trend predictions based on secure data feeds, essential for a trustworthy trading experience.

## Why Oasis Sapphire?

Oasis Sapphire offers privacy and scalability ideal for a futures trading platform:

- **Privacy**: Trusted Execution Environments (TEEs) on Sapphire keep sensitive trading data confidential.
- **Scalability**: Low latency and high transaction handling support efficient trading, even under heavy load.
- **Reliability**: Sapphire’s security ensures that the platform remains robust, making it an ideal choice for this privacy-focused, on-chain trading solution.

# Local Setup

This guide provides a step-by-step setup procedure to deploy and test a Futures dApp on the Oasis Sapphire local network using ROFL. **Note**: SGX-related requirements are excluded for this local testing setup.

---

## Step 1: Start the Localnet with ROFL

1. **Ensure Prerequisites**: Complete all ROFL prerequisites except for SGX-related ones.
2. **Build the Oracle**: Navigate to `rofl-oracle/` and build the oracle:

```bash
 oasis rofl build sgx --mode unsafe
```

> If the build fails, try updating Cargo:

```bash
 cargo update
```

3. **Start the Sapphire Localnet**: From the base git directory, run the following command to launch the Sapphire local network with ROFL:

```bash
 sudo docker run -it -p8545:8545 -p8546:8546 -v ./rofl-oracle:/rofls ghcr.io/oasisprotocol/sapphire-localnet
```

---

## Step 2: Deploy the Contract and Obtain Test Currency

4. **Navigate to the `rofl-oracle` Directory**: In a new terminal, move to the oracle directory to deploy the updated Futures contract:

```bash
 cd rofl-oracle/oracle
```

5. **Install Dependencies**: Run the following to install required packages:

```bash
 npm install
```

6. **Compile the ROFL Contract**:

```bash
 npx hardhat compile
```

7. **Deploy the Futures Contract**: Set up your private key and deploy the Futures contract on the Sapphire localnet:

```bash
 export PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
 npx hardhat deploy rofl1qqn9xndja7e2pnxhttktmecvwzz0yqwxsquqyxdf --network sapphire-localnet
```

8. **Transfer Test Currency**: Fund your MetaMask account with test native currency and ERC-20 tokens:

```bash
 npx hardhat transfer-native-token --account <your_metamask_testing_account> --amount 100
 npx hardhat mint --account <your_metamask_testing_account>
```

---

## Step 3: Deploy and Interact with the Futures dApp

9. **Start the Client**: From the base directory, navigate to the client directory and start the app:

```bash
 npm run dev
```

Open the app in your browser at the localhost URL provided.

10. **Configure MetaMask**:
    - Add the Sapphire local testnet using the **Add Network** button on the upper right corner.
    - Connect your MetaMask wallet by selecting **Connect**.

---

With these steps, you’re ready to interact with your Futures on Chain dApp on the Oasis Sapphire local network!

# Futures on Chain: A Secure and Confidential On-Chain Futures Trading Platform

This project presents an innovative on-chain futures trading solution, leveraging the power of the Oasis Sapphire blockchain and ROFL (Runtime OffChain Logiv) to create a secure, confidential, and tamper-proof trading environment. Designed for enhanced privacy and integrity, this platform allows users to trade futures contracts for a custom ERC-20 token whose value dynamically mirrors a real-world currency, such as the USD. Through real-time price updates, a trading bot powered by machine learning, and privacy-preserving execution, our solution empowers traders with accurate market simulations, ensuring reliable trading experiences without compromising data security or transparency.

## Key Features

### 1. On-Chain Futures Trading
Our platform provides users the capability to execute futures contracts on-chain for a custom ERC-20 token. This token, pegged to a real-world currency, reflects live market fluctuations, allowing users to engage in futures trading as they would in traditional financial markets. The platform handles both gains and losses by adjusting the trader's balance accordingly, enabling transparent and auditable transactions on-chain.

### 2. Simulated Price Fluctuations with Tamper-Proof Oracle Integration
Using the Runtime OffChain Logiv (ROFL), the ERC-20 token price is linked to an external real-world currency. ROFL ensures that price updates are securely fetched and delivered without manipulation, thereby simulating real-time market conditions in a decentralized and tamper-resistant manner. This allows traders to make informed decisions on futures contracts based on accurate and unbiased price feeds.

### 3. AI-Powered Trading Bot with LSTM Model for Market Predictions
A unique feature of this platform is a trading bot, powered by an LSTM (Long Short-Term Memory) model, which runs on the ROFL framework. This bot analyzes historical price data to provide predictive market suggestions, advising users to “Buy,” “Strongly Buy,” “Sell,” or “Strongly Sell” based on the current and forecasted trends. This recommendation engine adds a data-driven layer to the trading experience, helping traders make strategic decisions by combining machine learning insights with ROFL's trusted price data.

### 4. Automated Profit and Loss Management
- **Profit**: If a trade results in a net profit, the platform automatically mints new tokens to be distributed as the payout, ensuring traders can seamlessly realize their gains.
- **Loss**: When a trade results in a net loss, the platform deducts collateral (margin) posted by the trader to cover losses. This secure process ensures all positions are managed fairly and that the system retains the necessary funds to balance all trades.

### 5. Privacy-Preserving Execution with Trusted Execution Environments (TEEs)
Using Oasis’s Sapphire blockchain and TEEs, the platform maintains strict data confidentiality. All trading activities are executed within TEEs, ensuring sensitive trade information remains private while still being verifiable. This setup allows for transparent, auditable trade execution on-chain without exposing traders' data, combining the best of both security and transparency.

### 6. Trade History and Performance Tracking
Traders can access their transaction history, view current positions, and assess their performance directly through their wallets. Each transaction is securely recorded on-chain, enabling traders to monitor their historical data, refine strategies, and make better-informed trading decisions. On-chain storage further reinforces the immutability and reliability of the trade records.

## Why ROFL?
ROFL provides critical functionality for this platform by delivering accurate, tamper-resistant price data. In decentralized environments, data reliability is often compromised by manipulation, affecting the validity of price feeds and consequently, the trading outcomes. ROFL mitigates this risk by sourcing and verifying price data from trusted sources, ensuring each update is authentic and resistant to manipulation. ROFL also enables the integration of complex AI models, like our LSTM-based trading bot, which can analyze and predict market trends based on secure and trusted data feeds. This guarantees that our futures trading platform offers users a reliable trading experience, mirroring real-world price dynamics without risk of fraud or manipulation.

## Why Oasis Sapphire?
Oasis Sapphire is uniquely suited for this project due to its robust combination of privacy and scalability. By leveraging Trusted Execution Environments (TEEs), Sapphire allows for secure execution of contracts where sensitive data remains confidential, an essential feature for a futures trading platform where privacy is paramount. In addition, Oasis Sapphire's capacity to handle high transaction volumes with low latency supports a fluid and efficient trading experience, ensuring the platform can scale to meet demand without compromising on security or privacy. This fusion of features makes Oasis Sapphire an ideal choice for deploying a secure, privacy-first, on-chain futures trading solution.

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
    - Add the Sapphire local testnet using the **Add Network** button.
    - Connect your MetaMask wallet by selecting **Connect**.

---

With these steps, you’re ready to interact with your Futures dApp on the Oasis Sapphire local network!

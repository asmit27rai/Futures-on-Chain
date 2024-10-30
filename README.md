# Futures dApp Setup Procedure on Oasis

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
   npx hardhat transfer-native-token --account 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --amount 100
   npx hardhat mint --account 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
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

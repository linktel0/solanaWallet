The Solana Wallet is an essential bridge connecting DeFi developers and the Solana blockchain. With Solana's quick and low-cost transactions.

Solana Wallet uses the Solana-Web3.js library aims to provide complete coverage of Solana. @solana/spl-token,the Solana Program Library (SPL) defines a common implementation for Fungible and Non Fungible tokens. @project-serum/anchor,Anchor is a framework for Solana's Sealevel runtime providing several convenient developer tools for writing smart contracts.

Features
Create/Backup wallet with mnemonic phrase
Save and load mnemonics from local securely store on the device.
Multiple wallet accounts add,delete,refresh.
Account handling
SOL balance,SPL-token balances
SOL diposit,SPL-token diposits
SOL transfers,SPL-token transfers
Camera support with QR code scanning for token diposit,airdrop,transfer,exchange

Airdrop Sol in devnet and testnet
Airdrop USDC in devnet and testnet
Mint new token in devnet and testnet

SafeTransfer
    Build the "Safe Token Transfer app", that prevents funds from being lost.
    When someone wants to transfer tokens to a particular user, they do it in 2 steps to enforce safety. First, they deposit those tokens into an escrow token account that is controlled by our program. Second, the final receiver of the tokens confirms the withdrawal and receives the funds from the escrow.
    If they fat-fingered receiver's address, or if receiver cannot find his keys anymore, they can safely pull back his Safe Payment before the transfer is complete.

SafeExchange
    introduce a third party C which both A and B trust. A or B can go first and send their token to C. C then waits for the other party to send their token and only then does C release both token.
    The blockchain way is to replace the trusted third party C with code on a blockchain, specifically a smart contract that verifiably acts the same way a trusted third party would.
    

This is a Solana Wallet Cross-Platform App built with Expo, Web3, React Native,Typescript, tailwindcss and react native paper to learn about web3 with mobile app.
@Solana-Web3.js,@solana/spl-token,@project-serum/anchor are not for react-native Libraries. So if you want to develop solana mobile app, you must face many problems.
You can contact me, I will help you solve the problem. 




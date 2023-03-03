# Solana Wallet Cross-Platform App with Expo, Web3 & React Native

This is a simple Solana Wallet Cross-Platform App built with Expo, Web3 & React Native to learn about web3 and smart contract. The Solana Wallet is an essential bridge connecting DeFi developers and the Solana blockchain. With Solana's quick and low-cost transactions.

## Screens and Features

### Welcome

These screens show using the Biometric Prompt (Android) or FaceID and TouchID (iOS) to authenticate the user with a fingerprint or face scan. Later,automatically create mnemonic phrase or recovery wallet with mnemonic phrase. Save and load mnemonics from local securely store on the device.

<div align="center">
<img src="https://github.com/linktel0/image/raw/master/wallet/authenticate.gif" width=20% height=20%> 
&nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp 
<img src="https://github.com/linktel0/image/raw/master/wallet/auto_set_seed.gif" width=20% height=20%> 
&nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp 
<img src="https://github.com/linktel0/image/raw/master/wallet/recovery_seed.gif" width=20% height=20%>  
</div>
  
### Dashboard

These screens shows the accounts SOL/SPL-token balances,SOL/SPL-token deposits, SOL/SPL-token transfers. Camera support with QR code scanning for Sol/SPL-token deposit, transfer. Multiple wallet accounts add,delete,refresh.

<div align="center">
<img src="https://github.com/linktel0/image/raw/master/wallet/dashboard.gif" width=20% height=20%> 
&nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp 
<img src="https://github.com/linktel0/image/raw/master/wallet/mutil_accounts.gif" width=20% height=20%> 
&nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp 
<img src="https://github.com/linktel0/image/raw/master/wallet/send.gif" width=20% height=20%>  
</div>

### Airdrop and Mint

These screens show minting new tokens, airdropping Sol/Usdc. Convenient for developers

<div align="center">
<img src="https://github.com/linktel0/image/raw/master/wallet/mint.gif" width=20% height=20%> 
&nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp 
<img src="https://github.com/linktel0/image/raw/master/wallet/airdrop.gif" width=20% height=20%> 
&nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp 
<img src="https://github.com/linktel0/image/raw/master/wallet/airdrop_usdc.gif" width=20% height=20%>  
</div>



### SafeTransfer
    Build the "Safe Token Transfer app", that prevents funds from being lost.
    When someone wants to transfer tokens to a particular user, they do it in 2 steps to enforce safety. First, they deposit those tokens into an escrow token account that is controlled by our program. Second, the final receiver of the tokens confirms the withdrawal and receives the funds from the escrow.
    If they fat-fingered receiver's address, or if receiver cannot find his keys anymore, they can safely pull back his Safe Payment before the transfer is complete.This smart contract repository:https://github.com/linktel0/safe-transfer.git 

<div align="center">
<img src="https://github.com/linktel0/image/raw/master/wallet/safe_transfer.gif" width=20% height=20%> 
&nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp 
<img src="https://github.com/linktel0/image/raw/master/wallet/safe_transfer_comfirm.gif" width=20% height=20%>  
</div>


### SafeTransfer
    Introduce a third party C which both A and B trust. 
    A or B can go first and send their token to C. C then waits for 
    the other party to send their token and only then does C release both token.
    The blockchain way is to replace the trusted third party C with code on a 
    blockchain, specifically a smart contract that verifiably acts the same way a
    trusted third party would. 
    This smart contract repository:
    https://github.com/linktel0/safe_exchange.git 

<div align="center">
<img src="https://github.com/linktel0/image/raw/master/wallet/safe_exchange.gif" width=20% height=20%> 
&nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp 
<img src="https://github.com/linktel0/image/raw/master/wallet/safe_exchange_comfirm.gif" width=20% height=20%>  
</div>
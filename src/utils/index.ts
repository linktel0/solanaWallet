/* eslint-disable no-case-declarations */
import * as solanaWeb3 from "@solana/web3.js";
import * as TokenReg from '@solana/spl-token-registry'
import * as solanaToken from "@solana/spl-token";
import * as Random from "expo-random";

import { ethers } from "ethers";
//import { Buffer } from "safe-buffer";
import * as ed25519 from "ed25519-hd-key";
import nacl from "tweetnacl";
import * as anchor from '../dist/cjs'
import NodeWallet from "../dist/cjs/nodewallet";
import utf8 from "../dist/cjs/utils/bytes/utf8";
import idl from './spl_token_faucet.json';
import { IToken } from "../wallet";
import { createAccount, TOKEN_PROGRAM_ID } from "@solana/spl-token";
const bs58 = require('bs58');

const UsadcAddress = 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr';

export enum net{
  devnet  = "devnet",
  testnet = "testnet",
  mainnet = "mainnet-beta",
}

export enum web{
  Solana_Beach  = "Solana Beach",
  Solscan = "Solscan",
  Solana_Explorer = "Solana Explorer",
  SolanaFM = "SolanaFM",
}

export const urlMap = new Map([
  [web.SolanaFM, 'https://solana.fm/tx/'],
  [web.Solana_Beach, 'https://solanabeach.io/transaction/'],
  [web.Solana_Explorer,'https://explorer.solana.com/tx/'],
  [web.Solscan, 'https://solscan.io/tx/'],
]);

export interface ITokenPair{
  publickey:string,
  mintkey:string
} 

export const DERIVATION_PATH = {
  bip44Change: "bip44Change",
};

enum Commitment  {
  processed="processed",
  finalized= "finalized",
  recent= "recent",
  single= "single",
  singleGossip="singleGossip",
  root="root",
  max="max",
}

export const opts = {
  preflightCommitment: Commitment.processed,
};

export const generateMnemonic = async () => {
  const randomBytes = await Random.getRandomBytesAsync(32);
  const mnemonic = ethers.utils.entropyToMnemonic(randomBytes);
  return mnemonic;
};

export const Mnemonic24To12 = (words:string) =>{
  let pos = 0;
    for(let i=0; i<12; i++){
      pos = words.indexOf(' ', ++pos);
    }
  return words.slice(0,pos);
}

export const mnemonicToSeed = async (mnemonic: string) => {
  const bip39 = await import("bip39");
  const seed = await bip39.mnemonicToSeed(mnemonic);
  return Buffer.from(seed).toString("hex");
};

const deriveSeed = (
  seed: string,
  walletIndex: number,
): Buffer | undefined => {
  const path44Change = `m/44'/501'/${walletIndex}'/0'`;
  var Buffer = require('buffer').Buffer
  return ed25519.derivePath(path44Change, Buffer.from(seed,"hex")).key;
};

export const accountFromSeed = (
  seed: string,
  walletIndex: number,
) => {
  const derivedSeed = deriveSeed(
    seed,
    walletIndex,
  );
  let acc = null;
  if (derivedSeed) {
    const keyPair = nacl.sign.keyPair.fromSeed(derivedSeed);
    acc = new solanaWeb3.Keypair(keyPair);
  }
  return acc;
};

const maskedAddress = (address: string) => {
  if (!address) return;
  return `${address.slice(0, 8)}...${address.slice(address.length - 8)}`;
};

export const createConnection = (cluster:solanaWeb3.Cluster) => {
  return new solanaWeb3.Connection(solanaWeb3.clusterApiUrl(cluster),'confirmed');
};


export const getTokenPairs = async (cluster:solanaWeb3.Cluster,publicKey:string) => {

  const connection = createConnection(cluster);

  const tokenAccounts = await connection.getTokenAccountsByOwner(
    new solanaWeb3.PublicKey(publicKey),
    {
      programId: solanaToken.TOKEN_PROGRAM_ID,
    }
  );

  let tokens:IToken[] = [];
  
  tokenAccounts.value.forEach((tokenAccount) => {  
    const accountData = solanaToken.AccountLayout.decode(tokenAccount.account.data);
    tokens.push({
      publicKey:tokenAccount.pubkey.toString(),
      mintKey:accountData.mint.toString(),
    });
  })
  return tokens;

};

export const getTokenInfo = async() => {
  let tokenList:any[] = [];
  await new TokenReg.TokenListProvider().resolve().then((tokens) => {
    tokenList = tokens.filterByClusterSlug(net.devnet).getList();
  });
  return tokenList;
}


export const publicKeyFromString = (publicKeyString: string) => {
  return new solanaWeb3.PublicKey(publicKeyString);
};

async function getNumberDecimals(
  connection:solanaWeb3.Connection,
  mintPubkey: solanaWeb3.PublicKey):Promise<number> {
  const info = await connection.getParsedAccountInfo(mintPubkey);
  const result = (info.value?.data as solanaWeb3.ParsedAccountData).parsed.info.decimals as number;
  return result;
}

export const SendSol = async (
  cluster:solanaWeb3.Cluster,
  from:solanaWeb3.Keypair,
  to:string,
  amount:number,
  ) => {
  console.log("Executing Sol transaction...",amount);

  const transaction = new solanaWeb3.Transaction().add(
    solanaWeb3.SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: publicKeyFromString(to.toString()),
      lamports: amount * solanaWeb3.LAMPORTS_PER_SOL,
    })
  );

  // Sign transaction, broadcast, and confirm
  const connection = createConnection(cluster);
  
  let bal = await getBalance(cluster,from.publicKey.toString());
  console.log(bal,amount)

  const signature = await solanaWeb3.sendAndConfirmTransaction(
    connection,
    transaction,
    [from]
  );
  console.log("SIGNATURE", signature);
};

export const sendToken = async (
    cluster:solanaWeb3.Cluster,
    fromKeypair:solanaWeb3.Keypair,
    toAddress:string,
    mintAddress:string,
    amount:number,
  ) => {
    console.log("Executing Token transaction...", amount);
    const connection = createConnection(cluster);
    const _mintAddress = publicKeyFromString(mintAddress);
    const _toAddress   = publicKeyFromString(toAddress);
    const numberDecimals = await getNumberDecimals(connection,_mintAddress);
    const sourceAccount = await solanaToken.getOrCreateAssociatedTokenAccount(
      connection,
      fromKeypair,
      _mintAddress,
      fromKeypair.publicKey,
    );

    console.log(Number(sourceAccount.amount), amount * Math.pow(10, numberDecimals));

    const destinationAccount = await solanaToken.getOrCreateAssociatedTokenAccount(
      connection,
      fromKeypair,
      _mintAddress,
      _toAddress,
    );

    const transaction = new solanaWeb3.Transaction().add(
      solanaToken.createTransferInstruction(
        sourceAccount.address,
        destinationAccount.address,
        fromKeypair.publicKey,
        amount * Math.pow(10, numberDecimals)
    ));

    const latestBlockHash = await connection.getRecentBlockhash('confirmed');
    transaction.recentBlockhash = await latestBlockHash.blockhash;
    const signature = await solanaWeb3.sendAndConfirmTransaction(
      connection,
      transaction,
      [fromKeypair]
    );
    console.log("SIGNATURE", signature);
};


export const airdropSol = async (
  cluster: solanaWeb3.Cluster, 
  address: string,
  amount : number,
  ) => {
    console.log('Airdeop ' + amount +' Sol to',address);
    const connection = createConnection(cluster);
    const airdropSignature = await connection.requestAirdrop(
      publicKeyFromString(address),
      amount * solanaWeb3.LAMPORTS_PER_SOL,
    );
    console.log('airdropSignature:',airdropSignature);
    const signature = await connection.confirmTransaction(airdropSignature);
    console.log(signature);
};


export const airdropSplTokens = async(
  cluster:solanaWeb3.Cluster, 
  account:solanaWeb3.Keypair,
  address:string,
  amount:number,
  )=>{
  
    console.log('Airdrop ' + amount +' USDC-Dev to', address);
  const programID = new solanaWeb3.PublicKey('4sN8PnN2ki2W4TFXAfzR645FWs8nimmsYeNtxM8RBK6A');
  const mintPda = new solanaWeb3.PublicKey(UsadcAddress);
  const mintPdaBump = 255;

  const wallet = await new NodeWallet(account);
  const connection = createConnection(cluster)
  const provider = new anchor.AnchorProvider(connection,wallet,opts);
  const program = new anchor.Program(idl, programID, provider);
  //const receiver = wallet.publicKey;
  const receiver = publicKeyFromString(address);
  let amountToAirdrop = new anchor.BN(amount * 1000000);

  const associatedTokenAccount = await solanaToken.getOrCreateAssociatedTokenAccount(
    connection,
    account,
    mintPda,
    receiver,
  );

  const signature = await program.rpc.airdrop(
    mintPdaBump,
    amountToAirdrop,
    {
      accounts: {
        mint: mintPda,
        destination: associatedTokenAccount.address,
        payer: wallet.publicKey,
        receiver: receiver, 
        systemProgram: solanaWeb3.SystemProgram.programId,
        tokenProgram: solanaToken.TOKEN_PROGRAM_ID,
        associatedTokenProgram: solanaToken.ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY
      },
      signers: [],
    }
  );
  console.log('airdropSignature:',signature);
  await connection.confirmTransaction(signature, 'processed');

}

export interface ITransaction {
  date:number,
  signature:string,
  balances:Array<IBalance>,
  publicKey:string,
}

export interface IBalance {
  address:string|undefined;
  mint:string|undefined;
  preBalance:number,
  postBalance:number,
  decimals:number,
}

export const getHistory = async (
  cluster:solanaWeb3.Cluster,
  publicKeyString: string,
  options = { limit: 20 }) => {
    const connection = createConnection(cluster);
    const signatures = await connection.getSignaturesForAddress(
      publicKeyFromString(publicKeyString),
      options
    );

    const getTransactions = async () =>{
      let transactions:ITransaction[] = Array();
      for (const signature of signatures) {
        let transaction:ITransaction = {date:0,signature:'',balances:Array(),publicKey:publicKeyString};//{date:new Date(0),signature:'',balances:Array()};
        if (signature.blockTime!=null && signature.blockTime!=undefined)
          transaction.date = signature.blockTime; // new Date(1000*signature.blockTime);
          transaction.signature = signature.signature;
          const rawTransaction = await connection.getTransaction(signature.signature);
          const addressList = rawTransaction?.transaction.message.accountKeys;
          const preBalances = rawTransaction?.meta?.preBalances;
          const postBalances = rawTransaction?.meta?.postBalances;

          if (addressList!=undefined && preBalances!=undefined && postBalances!=undefined){
            for(let i=0;i<addressList.length;i++){
              if (postBalances[i]-preBalances[i]!=0){
                const balance:IBalance = {
                  address:addressList[i].toString(),
                  preBalance:preBalances[i],
                  postBalance:postBalances[i],
                  mint:'So11111111111111111111111111111111111111112',
                  decimals:9,
                }
                transaction.balances.push(balance);
                //console.log(transactions);
              }
            }
          }

          const preTokenBalances = rawTransaction?.meta?.preTokenBalances;
          const postTokenBalances = rawTransaction?.meta?.postTokenBalances;

          if (preTokenBalances!=undefined && preTokenBalances!=null
              && postTokenBalances!=undefined && postTokenBalances!=null){
              for(let i=0;i<preTokenBalances.length;i++){
                if (Number(postTokenBalances[i].uiTokenAmount.amount)-
                    Number(preTokenBalances[i].uiTokenAmount.amount) != 0){
                      const takenbalance:IBalance = {
                        mint:preTokenBalances[i].mint,
                        address:preTokenBalances[i].owner,
                        preBalance:Number(preTokenBalances[i].uiTokenAmount.amount),
                        postBalance:Number(postTokenBalances[i].uiTokenAmount.amount),
                        decimals:Number(postTokenBalances[i].uiTokenAmount.decimals),
                      }
                      transaction.balances.push(takenbalance);
                      //console.log(transactions);
                }
              }
          }
          transactions.push(transaction)
      };
      return transactions;
    }

    return await getTransactions();
    //console.log(transactions);
    //return signatures;
};  

   
export const getBalance = async (cluster:solanaWeb3.Cluster,publicKey:string) => {
  const connection = createConnection(cluster); 
  const _publicKey = publicKeyFromString(publicKey);

  const lamports = await connection.getBalance(_publicKey).catch((err) => {
    console.error(`Error: ${err}`);
  });

  return lamports? lamports / solanaWeb3.LAMPORTS_PER_SOL: 0
};

export const getTokenBalance = async (cluster:solanaWeb3.Cluster,publicKey: string) => {
  const connection = createConnection(cluster);
  try {
    const balance = await connection.getTokenAccountBalance(
      publicKeyFromString(publicKey)
    );
    return balance.value.uiAmount?balance.value.uiAmount:0;
  } catch (e) {
    return 0;
  }
};


const generateKeyPair = async() => {
  const mnemonic = await generateMnemonic();
  const seed = await mnemonicToSeed(mnemonic);
  let keyPair = accountFromSeed(seed,0);
  if (keyPair == null) return undefined;
  return keyPair;
}

export const mintNewToken = async(
  cluster:solanaWeb3.Cluster, 
  account:solanaWeb3.Keypair,
  amount:number,
  decimals:number,
  )=>{

  const keyPair = await generateKeyPair();
  const connection = createConnection(cluster);
  const mintAddress = await solanaToken.createMint(
      connection,
      account, // payer
      account.publicKey, // who has permission to mint?
      account.publicKey, // who has permission to freeze?
      decimals, // decimals (0 = whole numbers)
      keyPair,
   )
    
  console.log("Token created:", mintAddress.toString())

  const ATAddress = await solanaToken.createAssociatedTokenAccount(
    connection,
    account, // payer
    mintAddress, // token
    account.publicKey, // who to create an account for
  )
  console.log("Token account created:", ATAddress.toString())

  await solanaToken.mintToChecked(
    connection,
    account, // payer
    mintAddress, // token
    ATAddress, // recipient
    account, // authority to mint
    amount, // amount
    decimals, //decimals
  )
  console.log('Minted ' + amount.toString() + ' coupons to the shop account')
  
  const balance = await getTokenBalance(cluster, ATAddress.toString());
  console.log({
    mintAddress: mintAddress.toString(),
    ATAddress  : ATAddress.toString(),
    balance: balance,
    decimals: decimals,
  })

}

export const getMint = async(cluster:solanaWeb3.Cluster, pubKey: solanaWeb3.PublicKey) => {
  const connection = createConnection(cluster);
  const tokenAccount = await solanaToken.getAccount(connection, pubKey);
  return tokenAccount.mint
}

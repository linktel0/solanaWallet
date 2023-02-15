import { Cluster} from '@solana/web3.js';
import * as asyncModel from '../storage/asyncStore'
import * as keyModel from '../storage/keystore'
import * as utils from "../utils";


export interface IEnv {
  cluster: Cluster;
  wallet: number;
}

export interface ITokenInfo {
  name:string,
  symbol:string,
  logo:string,
  decimals:number
}

export interface IToken {
  publicKey:string,
  mintKey:string,
}

export interface ITokens {
  master:IToken,
  mainnet:IToken[],
  devnet:IToken[],
  testnet:IToken[],
}

export interface IAccount {
  index: number;
  title: string;
  tokens: ITokens;
  default:boolean;
  derivationPath: string;
}

export interface IWallet {
  pin: string;
  seed: string;
  mnemonic: string;
}

export const newMnemonic = async() => {
  return utils.Mnemonic24To12(await utils.generateMnemonic());
}

export const seedFrom = async(mnemonic:string) => {
  return await utils.mnemonicToSeed(mnemonic);
}

export const getSeed = async()=>{
  const wallet = JSON.parse(await keyModel.getWallet());
  return wallet.seed;
}

export const getTheme = async()=>{
  return await asyncModel.getTheme();
}

export const setTheme = async(theme:string)=>{
  return await asyncModel.setTheme(theme);
}

export const setWallet = async(wallet:IWallet)=>{
  await keyModel.setWallet(JSON.stringify(wallet));
}

export const getWallet = async()=>{
  try{
    return JSON.parse(await keyModel.getWallet());
  }
  catch{
    let wallet = {
      pin:'',
      seed:'',
      mnemonic:'',
    }
    return wallet;
  }
}

export const removeWallet = async()=>{
  await keyModel.removeWallet()
}

export const getAccounts = async():Promise<IAccount[]> => {
  try {
    return JSON.parse(await asyncModel.getAccounts());
  }
  catch {
    return [];
  }
}

export const setAccounts = async(accounts:IAccount[]) =>{
  await asyncModel.setAccounts(JSON.stringify(accounts));
}

export const getAccountIndex = (accounts:IAccount[]) =>{
  let index = accounts.length;
  for (let i=0; i < accounts.length;i++){
    if (accounts[i].index != i) {
      index = i;
      break;
    }
  }
  return index;
}

export const addAccount = async(index:number)=>{
  let account:IAccount = {
    index:index,
    default:false,
    title: 'Wallet_' + (index + 1),
    derivationPath:"bip44Change",
    tokens:{
      master:{
        publicKey:'',
        mintKey:'So11111111111111111111111111111111111111112',
      },
      devnet:[],
      testnet:[],
      mainnet:[],
    }
  };
  const _wallet = await getWallet();
  if (_wallet){
    const keyPair = utils.accountFromSeed(
      _wallet.seed,
      account.index,
    )
    if (keyPair){
      account.tokens.master.publicKey = keyPair.publicKey.toString();
    }
  }
  return account;
}

export const addSubTokens = async(account:IAccount) => {
  const publicKey = account.tokens.master.publicKey;
  const clusters:Cluster[] = [utils.net.devnet,utils.net.mainnet,utils.net.testnet]; 
  for(const cluster of clusters) {
    const newtokens = await utils.getTokenPairs(cluster,publicKey);
    let subTokens = getTokens(cluster,account);
    for(const item of newtokens){
      subTokens.push(item);
    }
  }
  return account;
}  

export const loadAccounts = async():Promise<IAccount[]> => {
  let _accounts = await getAccounts();
  if( _accounts.length==0){
    const account = await addAccount(0);
    _accounts.push(account);
    await setAccounts(_accounts);
    updateTokensInfo(_accounts)
  }
  return _accounts;
}

export const removeAccounts = async()=>{
  await asyncModel.removeAccounts()
}


export const setCluster = async(cluster:string)=>{
  await asyncModel.setCluster(cluster);
}

export const getCluster = async()=>{
  const cluster = await asyncModel.getCluster();
  const net = utils.net;
  return (
    cluster===net.mainnet
    ?net.mainnet
    :cluster===net.testnet
      ?net.testnet
      :net.devnet
  )
}

export const setExplorer = async(explorer:string)=>{
  await asyncModel.setExplorer(explorer);
}

export const getExplorer = async()=>{
  const explorer = await asyncModel.getExplorer();
  const web = utils.web;
  return (
    explorer===web.SolanaFM
    ?web.SolanaFM
    :explorer===web.Solana_Beach
      ?web.Solana_Beach
      :explorer===web.Solana_Explorer
        ?web.Solana_Explorer
        :web.Solscan
  )
}


export const setTokenMap = async(tokenMap:Map<string,ITokenInfo>)=>{
  const objFromMap = Object.fromEntries(tokenMap);
  await asyncModel.setTokenMap(JSON.stringify(objFromMap));
}

export const getTokenMap = async()=>{
  let tokenMap = new Map<string,ITokenInfo>();
  try {
    const obj = JSON.parse(await asyncModel.getTokenMap());
    tokenMap = new Map<string,ITokenInfo>(Object.entries(obj));
  }
  catch {}
  return tokenMap;
}


export const setDefaultAccount = async(account:IAccount)=>{
  await asyncModel.setDefaultAccount(account.index.toString());
}

export const getDefaultAccount = async(accounts:IAccount[])=>{
  let account = accounts[0];
  let index = 0;
  try{
    index = parseInt(await asyncModel.getDefaultAccount());
  }
  catch {}
  
  for(let i=0; i<accounts.length;i++){
    if (accounts[i].index === index){
      account = accounts[i];
      break;
    } 
  }
  return account;
}

export const getTokens =  (cluster:Cluster,account:IAccount) => {
  return (
    cluster===utils.net.mainnet
    ?account.tokens.mainnet 
    :cluster===utils.net.devnet
      ?account.tokens.devnet
      :account.tokens.testnet
  )
}

export const updateTokensInfo = async(accounts:IAccount[]) =>{
  const solKey = 'So11111111111111111111111111111111111111112';
  let newMints = Array();
  let tokenMap:Map<string,ITokenInfo> =  await getTokenMap();

  if (!tokenMap.has(solKey)){
    tokenMap.set(solKey,
      {
        name:'Solana',
        symbol:'Sol',
        decimals:9,
        logo:'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
      });
    await setTokenMap(tokenMap);
  };

  const clusters:Cluster[] = [utils.net.devnet,utils.net.mainnet,utils.net.testnet]; 
  for (const account of accounts){
    for(const cluster of clusters) {
      let subTokens = getTokens(cluster,account);
      for(const token of subTokens){
        if(!tokenMap.has(token.mintKey)) {
          newMints.push(token.mintKey);
        }
      }
    }
  }

  if (newMints.length>0){
    const tokenInfos = await utils.getTokenInfo();
    for (const mint of newMints) {
      if(!tokenMap.has(mint)){
        let info = {
          name: 'Coupon',   
          symbol: 'Coupon',
          decimals:0,
          logo: 'https://github.com/linktel0/image/blob/master/image/coupon.jpeg?raw=true',
        };

        for (const tokenInfo of tokenInfos) {
          if (tokenInfo.address.indexOf(mint)>=0){
            info.name   = tokenInfo.name;
            info.symbol = tokenInfo.symbol;
            info.decimals = tokenInfo.decimals;
            info.logo   = tokenInfo.logoURI;
            break;
          }
        }
        tokenMap.set(mint,info);
      }
    }
    await setTokenMap(tokenMap);
  }
  return tokenMap;
}

export const getKeyPair = async(account:IAccount) => {
  let keyPair = null;
  const _wallet = await getWallet();
  if(_wallet){
    keyPair = utils.accountFromSeed(
      _wallet.seed,
      account.index,
    )
  }
  return keyPair;
}






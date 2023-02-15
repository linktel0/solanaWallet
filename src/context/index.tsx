
import React, {
    createContext,
    ReactNode,
    useContext,
    useState,
  } from "react";
import { IAccount, ITokenInfo} from "../wallet";
import { net,web } from "../utils";
import * as solanaWeb3 from "@solana/web3.js";
//import { Wallet } from "../dist/cjs";
//import { IToken } from "../../storage/asyncStore";
//import {useColorScheme } from "nativewind";


interface ProviderProps {
  children: ReactNode;
}

export interface IContext {
  account: IAccount,
  setAccount: React.Dispatch<React.SetStateAction<IAccount>>,
  accounts: IAccount[],
  setAccounts: React.Dispatch<React.SetStateAction<IAccount[]>>,
  cluster: solanaWeb3.Cluster,
  setCluster: React.Dispatch<React.SetStateAction<solanaWeb3.Cluster>>,
  local: string|undefined,
  setLocal: React.Dispatch<React.SetStateAction<string|undefined>>,
  update: number,
  setUpdate: React.Dispatch<React.SetStateAction<number>>,
  explorer: web,
  setExplorer: React.Dispatch<React.SetStateAction<web>>,
  tokenMap: Map<string,ITokenInfo>,
  setTokenMap: React.Dispatch<React.SetStateAction<Map<string,ITokenInfo>>>,
  //visible: boolean,
  //setVisible: React.Dispatch<React.SetStateAction<boolean>>,
//  colorScheme: string,
//  toggleColorScheme: React.Dispatch<React.SetStateAction<string>>,

}

const Context = createContext<IContext>({} as IContext);

export function ContextProvider({ children }: ProviderProps): JSX.Element {
//  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [cluster,setCluster] = useState<solanaWeb3.Cluster>(net.devnet);
  const [explorer,setExplorer] = useState<web>(web.Solana_Beach);
  const [tokenMap,setTokenMap] = useState<Map<string,ITokenInfo>>(new Map<string,ITokenInfo>());
  const [local,setLocal] = useState<string>();
  const [update,setUpdate] = useState(0);
  //const [visible,setVisible] = useState(true);
  const [accounts,setAccounts] = useState<IAccount[]>([]);
  const [account,setAccount] = useState<IAccount>(
    {
      index:0,
      default:false,
      title:'',
      derivationPath:"bip44Change",
      tokens:{
        master:{
          publicKey:'',
          mintKey:'',
        },
        devnet:[],
        testnet:[],
        mainnet:[]},
    }
  );

  const ctx:IContext = {
    account: account,
    setAccount:setAccount,
    accounts: accounts,
    setAccounts:setAccounts,
    cluster: cluster,
    setCluster:setCluster,
    local: local,
    setLocal:setLocal,
    update: update,
    setUpdate : setUpdate,
    explorer : explorer,
    setExplorer : setExplorer,
    tokenMap : tokenMap,
    setTokenMap : setTokenMap,

    //visible: visible,
    //setVisible: setVisible,
 //   colorScheme: colorScheme,
 //   toggleColorScheme:toggleColorScheme,
  }

   return (
      <Context.Provider
        value={{...ctx}}
      >
        {children}
      </Context.Provider>
      );
    }

export function useAccounts(): IContext {
    const context = useContext(Context);
    return context;
}
import AsyncStorage from "@react-native-async-storage/async-storage";

export const setItem = async (key: string, value: string) => await AsyncStorage.setItem(key, value);
export const getItem = async (key: string) => {
    const item = await AsyncStorage.getItem(key);
    return item?item:''
}
export const removeItem = async (key: string) => await AsyncStorage.removeItem(key);

export const getTheme = async (): Promise<string> => await getItem("theme")
export const setTheme = async (theme: string) => await setItem("theme", theme)
export const getLocal = async (): Promise<string> => await getItem("local")
export const setLocal = async (local: string) => await setItem("local", local) 
export const getCluster = async (): Promise<string> => await getItem("cluster")
export const setCluster = async (cluster: string) => await setItem("cluster", cluster)
export const getExplorer = async (): Promise<string> => await getItem("explorer")
export const setExplorer = async (explorer: string) => await setItem("explorer", explorer)
export const setTokenMap = async (TokenMap: string) => await setItem("TokenMap", TokenMap)
export const getTokenMap = async (): Promise<string> => await getItem("TokenMap")
export const getDefaultAccount = async (): Promise<string> => await getItem("index")
export const setDefaultAccount = async (index: string) => await setItem("index", index)
export const setAccounts = async (accounts: string) => await setItem("account", accounts)
export const getAccounts = async (): Promise<string> => await getItem("account")
export const removeAccounts = async () => await removeItem("account")

  
  
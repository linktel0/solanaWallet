import * as SecureStore from 'expo-secure-store';

export const getItem = async (key: string) => {
  const item = await SecureStore.getItemAsync(key);
  return item?item:'';
}
export const setItem = async (key: string, value: string) => await SecureStore.setItemAsync(key, value);
export const removeItem = async (key: string) => await SecureStore.deleteItemAsync(key);

export const  setWallet = async (wallet: string) => await setItem("wallet", wallet)
export const  getWallet = async (): Promise<string> =>await getItem("wallet");
export const  removeWallet = async () => await removeItem("wallet")



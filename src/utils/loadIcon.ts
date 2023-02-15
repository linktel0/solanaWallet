import {Image} from 'react-native';
import * as MediaLibrary from 'expo-media-library'
import * as FileSystem from 'expo-file-system'
const coupon = require('../assets/images/coupon.jpeg');

const fileExist = async(fileUri:string) =>{
    const fileInfo = await FileSystem.getInfoAsync
                    (FileSystem.documentDirectory + fileUri);
    return fileInfo.exists;
  }

const savePhoneImage = async(_url:string,file:string)=>{
    if (await fileExist(file)) return;
    const url = (file==='coupon.jpeg')
                 ?Image.resolveAssetSource(coupon).toString()
                 :_url

    await FileSystem.downloadAsync(
        url,
        FileSystem.documentDirectory + file
      ).catch((e) =>
        console.log('Download failed', JSON.stringify(e), url)
      )

    const permission = await MediaLibrary.requestPermissionsAsync()
    if (permission.granted) {
        try {
        const asset = await MediaLibrary.createAssetAsync(url)
        MediaLibrary.createAlbumAsync('Images', asset, false)
            .then(() => {
            console.log('File Saved Successfully!')
            })
            .catch(() => {
            console.log('Error In Saving File!')
            })
        } catch (error) {
        console.log(error)
        }
    } else {
        console.log('Need Storage permission to save file')
    }
}
 
const loadPhoneImage = (file:string)=>{
    return (file==='coupon.jpeg')
             ?Image.resolveAssetSource(coupon).uri
             :FileSystem.documentDirectory + file
}

export {fileExist,savePhoneImage,loadPhoneImage};
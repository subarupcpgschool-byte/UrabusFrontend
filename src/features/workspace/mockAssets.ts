import { Asset } from 'expo-asset';
export async function resolveMockAsset(uri:string):Promise<string>{
 const asset=Asset.fromModule(uri==='mock:video'?require('../../../assets/mock/office-demo.mp4'):require('../../../assets/mock/office-demo.png'));
 await asset.downloadAsync();return asset.localUri||asset.uri;
}

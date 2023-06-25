import { NFTStorage } from 'nft.storage'
import { NFT_STORAGE_API_KEY } from '../constants'

export const nftStorageClient = new NFTStorage({ token: NFT_STORAGE_API_KEY })

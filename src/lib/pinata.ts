import { PinataSDK } from 'pinata'
import { PINATA_JWT, PINATA_GATEWAY } from '../constants'

export const pinataClient = new PinataSDK({
  pinataJwt: PINATA_JWT,
  pinataGateway: PINATA_GATEWAY,
})

export function makeIPFSURLFromHash(ipfsHash: string) {
  return `https://beige-used-egret-296.mypinata.cloud/ipfs/${ipfsHash}`
}

export async function uploadFileToIPFS(file: File): Promise<string> {
  // const file = new File([blob], fileName, { type: "text/plain"})
  const upload = await pinataClient.upload.file(file)
  return upload.IpfsHash
}

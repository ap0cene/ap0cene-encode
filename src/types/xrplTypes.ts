export type XrplNft = {
  flags: number
  is_burned: boolean
  issuer: string
  ledger_index: number
  nft_id: string
  nft_serial: number
  nft_taxon: number
  owner: string
  transfer_fee: number
  uri: string // Hex-encoded URI
}

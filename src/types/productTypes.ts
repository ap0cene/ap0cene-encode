import {
  AccessoriesSubtype,
  ActivewearSubtype,
  BagsSubtype,
  Color,
  DressesSubtype,
  Gender,
  IntimatesSwimSubtype,
  JewelrySubtype,
  OnePiecesSubtype,
  OuterwearSubtype,
  PantsSubtype,
  ProductType,
  ShoesSubtype,
  SkirtsSubtype,
  SuitSetSubtype,
  TopsSubtype,
} from './productEnums'

export type Product = {
  id: string
  title: string
  images: string[]
  vendorId: string
  gender: Gender[]
  type: ProductType
  topsSubtype: TopsSubtype[]
  dressesSubtype: DressesSubtype[]
  onePiecesSubtype: OnePiecesSubtype[]
  pantsSubtype: PantsSubtype[]
  skirtsSubtype: SkirtsSubtype[]
  intimatesSwimSubtype: IntimatesSwimSubtype[]
  activewearSubtype: ActivewearSubtype[]
  outerwearSubtype: OuterwearSubtype[]
  bagsSubtype: BagsSubtype[]
  accessoriesSubtype: AccessoriesSubtype[]
  shoesSubtype: ShoesSubtype[]
  jewlerySubtype: JewelrySubtype[]
  suitSetSubtype: SuitSetSubtype[]
  copy: string
  itemWeight: number
}

export type Variant = {
  id: string
  productId: string
  vendorId: string
  itemWeight: number
  color: Color
  customColor?: string
  depth?: number
  width?: number
  inseam?: number
  height?: number
  sleeve?: number
  chest?: number
  shoulder?: number
  length?: number
  price: number
}

export type Stock = {
  id: string
  vendorId: string
  variantId: string
  locationId: string
  dispatchTime: string
  amountAvailable: number
  madeToOrder: boolean
}

// Represents the structure of the product metadata stored on IPFS
export type ProductMetadata = {
  chipPublicKey: string
  title: string
  brand: string
  images: string[]
  gender: Gender[]
  type: ProductType
  bagsSubtype?: BagsSubtype[]
  topsSubtype?: TopsSubtype[]
  dressesSubtype?: DressesSubtype[]
  onePiecesSubtype?: OnePiecesSubtype[]
  pantsSubtype?: PantsSubtype[]
  skirtsSubtype?: SkirtsSubtype[]
  intimatesSwimSubtype?: IntimatesSwimSubtype[]
  activewearSubtype?: ActivewearSubtype[]
  outerwearSubtype?: OuterwearSubtype[]
  accessoriesSubtype?: AccessoriesSubtype[]
  shoesSubtype?: ShoesSubtype[]
  jewlerySubtype?: JewelrySubtype[]
  suitSetSubtype?: SuitSetSubtype[]
  copy?: string
  itemWeight?: string
  color?: Color
  customColor?: string
  depth?: string
  width?: string
  inseam?: string
  waist?: string
  sleeve?: string
  chest?: string
  shoulder?: string
  length?: string
}

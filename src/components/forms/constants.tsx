import _ from 'lodash'
import { Box, Text } from 'grommet'
import React from 'react'
import { mapEnumToOptions } from '../autoform/utils'
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
} from '../../types/productEnums'

const productTypesFormSchema = [
  {
    id: 'type',
    name: 'Product Type',
    type: 'select',
    options: mapEnumToOptions(ProductType),
    required: false,
  },
  {
    id: 'topsSubtype',
    name: 'Sub-Type, Tops',
    type: 'checkboxgroup',
    options: mapEnumToOptions(TopsSubtype),
    condition: (formState: any) => formState.type === 'Tops',
    required: false,
  },
  {
    id: 'dressesSubtype',
    name: 'Sub-Type, Dresses',
    type: 'checkboxgroup',
    options: mapEnumToOptions(DressesSubtype),
    condition: (formState: any) => formState.type === 'Dresses',
    required: false,
  },
  {
    id: 'onePiecesSubtype',
    name: 'Sub-Type, One-Pieces',
    type: 'checkboxgroup',
    options: mapEnumToOptions(OnePiecesSubtype),
    condition: (formState: any) => formState.type === 'One-Pieces',
    required: false,
  },
  {
    id: 'pantsSubtype',
    name: 'Sub-Type, Pants',
    type: 'checkboxgroup',
    options: mapEnumToOptions(PantsSubtype),
    condition: (formState: any) => formState.type === 'Pants',
    required: false,
  },
  {
    id: 'skirtsSubtype',
    name: 'Sub-Type, Skirts',
    type: 'checkboxgroup',
    options: mapEnumToOptions(SkirtsSubtype),
    condition: (formState: any) => formState.type === 'Skirts',
    required: false,
  },
  {
    id: 'intimatesSwimSubtype',
    name: 'Sub-Type, Intimates + Swim',
    type: 'checkboxgroup',
    options: mapEnumToOptions(IntimatesSwimSubtype),
    condition: (formState: any) => formState.type === 'Intimates + Swim',
    required: false,
  },
  {
    id: 'activewearSubtype',
    name: 'Sub-Type, Activewear',
    type: 'checkboxgroup',
    options: mapEnumToOptions(ActivewearSubtype),
    condition: (formState: any) => formState.type === 'Activewear',
    required: false,
  },
  {
    id: 'outerwearSubtype',
    name: 'Sub-Type, Outerwear',
    type: 'checkboxgroup',
    options: mapEnumToOptions(OuterwearSubtype),
    condition: (formState: any) => formState.type === 'Outerwear',
    required: false,
  },
  {
    id: 'bagsSubtype',
    name: 'Sub-Type, Bags',
    type: 'checkboxgroup',
    options: mapEnumToOptions(BagsSubtype),
    condition: (formState: any) => formState.type === 'Bags',
    required: false,
  },
  {
    id: 'accessoriesSubtype',
    name: 'Sub-Type, Accessories',
    type: 'checkboxgroup',
    options: mapEnumToOptions(AccessoriesSubtype),
    condition: (formState: any) => formState.type === 'Accessories',
    required: false,
  },
  {
    id: 'shoesSubtype',
    name: 'Sub-Type, Shoes',
    type: 'checkboxgroup',
    options: mapEnumToOptions(ShoesSubtype),
    condition: (formState: any) => formState.type === 'Shoes',
    required: false,
  },
  {
    id: 'jewlerySubtype',
    name: 'Sub-Type, Jewelry',
    type: 'checkboxgroup',
    options: mapEnumToOptions(JewelrySubtype),
    condition: (formState: any) => formState.type === 'Jewelry',
    required: false,
  },
  {
    id: 'suitSetSubtype',
    name: 'Is this a part of a suit or set?',
    type: 'checkboxgroup',
    options: mapEnumToOptions(SuitSetSubtype),
    condition: (formState: any) => {
      return _.includes(['Skirts', 'Pants', 'One-Pieces', 'Dresses', 'Tops', 'Outerwear'], formState.type)
    },
    required: false,
  },
]

const physicalProductFormSchema = [
  {
    id: `itemWeight`,
    name: `Item Weight`,
    type: 'number',
    required: false,
    help: 'Weight in Lbs',
  },
  {
    id: `color`,
    name: `Color`,
    type: 'select',
    search: false,
    options: mapEnumToOptions(Color),
    required: false,
  },
  {
    id: `customColor`,
    name: `Custom Color or Print Name`,
    type: 'text',
    required: false,
    help: (
      <Box>
        <Text size="xsmall">
          If there are color variants please write out each variant in the Color or Print Name field separated by a
          comma <br />
          ex: Blue, Red, Orange <br />
          or Pink Paisley, Red Jacquard, Grey Houndstooth
        </Text>
      </Box>
    ),
  },
  {
    id: 'depth',
    type: 'number',
    name: 'Depth',
    condition: (formState: any) => {
      return _.includes(['Bags'], formState.type)
    },
    required: false,
    help: 'Depth in inches',
  },
  {
    id: 'width',
    type: 'number',
    name: 'Width',
    condition: (formState: any) => {
      return _.includes(['Jewelry', 'Bags'], formState.type)
    },
    required: false,
    help: 'Width in inches',
  },
  {
    id: 'inseam',
    type: 'number',
    name: 'Inseam',
    condition: (formState: any) => {
      return _.includes(['One-Pieces', 'Pants', 'Intimates + Swim', 'Activewear'], formState.type)
    },
    required: false,
    help: 'Inseam in inches',
  },
  {
    id: 'waist',
    type: 'number',
    name: 'Waist',
    condition: (formState: any) => {
      return _.includes(['Pants'], formState.type)
    },
    required: false,
    help: 'Waist in inches',
  },
  {
    id: 'sleeve',
    type: 'number',
    name: 'Sleeve',
    condition: (formState: any) => {
      return _.includes(
        ['Tops', 'Dresses', 'Intimates + Swim', 'One-Pieces', 'Outerwear', 'Activewear'],
        formState.type,
      )
    },
    required: false,
    help: 'Sleeve in inches',
  },
  {
    id: 'chest',
    type: 'number',
    name: 'Chest',
    condition: (formState: any) => {
      return _.includes(
        ['Intimates + Swim', 'Tops', 'Dresses', 'One-Pieces', 'Outerwear', 'Activewear'],
        formState.type,
      )
    },
    required: false,
    help: 'Chest in inches',
  },
  {
    id: 'shoulder',
    type: 'number',
    name: 'Shoulder',
    condition: (formState: any) => {
      return _.includes(['Tops', 'Dresses', 'One-Pieces', 'Activewear', 'Outerwear'], formState.type)
    },
    required: false,
    help: 'Shoulder in inches',
  },
  {
    id: 'length',
    type: 'number',
    name: 'Length',
    condition: (formState: any) => {
      return _.includes(
        [
          'Tops',
          'One-Pieces',
          'Dresses',
          'Pants',
          'Skirts',
          'Intimates + Swim',
          'Outerwear',
          'Activewear',
          'Bags',
          'Shoes',
          'Jewelry',
        ],
        formState.type,
      )
    },
    required: false,
    help: 'Length in inches',
  },
]
export const productFormSchema = [
  {
    id: 'chipPublicKey',
    name: 'Chip Public Key',
    type: 'text',
    required: true,
    disabled: true,
    readOnlyValueFormatter: (value: string) => _.truncate(value, { length: 40, omission: '...' }),
  },
  {
    id: 'title',
    name: 'Title',
    type: 'text',
    required: true,
  },
  {
    id: 'brand',
    name: 'Brand',
    type: 'text',
    required: true,
  },
  {
    id: 'images',
    name: 'Product Images',
    type: 'images',
    required: true,
  },
  {
    id: 'gender',
    name: 'Gender',
    type: 'checkboxgroup',
    options: mapEnumToOptions(Gender),
    required: false,
  },
  ...productTypesFormSchema,
  {
    id: 'copy',
    name: 'Product Description',
    type: 'textarea',
    required: false,
  },
  {
    formContent: (
      <Box>
        <Text size="small" margin={{ vertical: 'small' }}>
          Suggestions for What to Include in the Product Description:
          <ul>
            <li> Mention sustainability where applicable</li>
            <li> An in-depth look at the materials used</li>
            <li> Where and how it's made</li>
            <li> Any interesting facts or anecdotes</li>
            <li> Styling tips</li>
            <li> A good pun!</li>
          </ul>
        </Text>
      </Box>
    ),
  },
  {
    formContent: (
      <Box>
        <Text size="xlarge" weight="bold">
          Product Variant Defaults
        </Text>
        <Text size="small" margin={{ vertical: 'small' }}>
          The fields below will be used as the default values for all variants. You will have the opportunity to
          override any of these values when you define the variants.
        </Text>
      </Box>
    ),
    condition: (formState: any) => {
      return formState.hasProductVariants
    },
  },
  ...physicalProductFormSchema,
]

export const newProductFormDefaults = {
  title: '',
  brand: '',
  images: [],
  gender: [],
  type: '',
  topsSubtype: [],
  dressesSubtype: [],
  onePiecesSubtype: [],
  pantsSubtype: [],
  skirtsSubtype: [],
  intimatesSwimSubtype: [],
  activewearSubtype: [],
  outerwearSubtype: [],
  bagsSubtype: [],
  accessoriesSubtype: [],
  shoesSubtype: [],
  jewlerySubtype: [],
  suitSetSubtype: [],
}

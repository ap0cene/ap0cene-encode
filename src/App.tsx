import React from 'react'
import { Grommet } from 'grommet'
import { Subtract, Add } from 'grommet-icons'
import { hpe } from 'grommet-theme-hpe'
import { deepMerge } from 'grommet/utils'
import PageHeader from './components/PageHeader'
import NavBody from './components/NavBody'

const customTheme = {
  global: {
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    },
  },
  accordion: {
    heading: {
      margin: { vertical: '20px', horizontal: '24px' },
    },
    icons: {
      collapse: Subtract,
      expand: Add,
    },
    border: undefined,
  },
}

const theme = deepMerge(hpe, customTheme)

function App() {
  return (
    <Grommet theme={theme}>
      <PageHeader />
      <NavBody />
    </Grommet>
  )
}

export default App

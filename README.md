# Ap0cene Authentication Frontend

## Overview

This is a React-based frontend application for Ap0cene Authentication, built with TypeScript.

## 🧬 NFC to NFT Data Flow

```mermaid
flowchart TD
    Start["User Scans NFC Chip"] --> VerifyChip["Verify Chip Signature<br/>(pk2, rnd, rndsig)"]
    VerifyChip --> ChipValid{Chip Valid?}

    ChipValid -- No --> Error["Display Error"]
    ChipValid -- Yes --> ComputeTaxon["Generate NFTokenTaxon<br/>from Public Key Hash"]

    ComputeTaxon --> SearchNFT["Search NFTs Across<br/>Authority Accounts"]
    SearchNFT --> NFTExists{NFT Registered?}

    %% YES PATH - Verification Flow
    NFTExists -- Yes --> ExtractURI

    subgraph consumer["Consumer Experience"]
        ExtractURI["Extract IPFS Hash<br/>from NFT URI"]
        ExtractURI --> LoadIPFS["Load Product Metadata<br/>from IPFS"]
        LoadIPFS --> VerifyMatch["Compare Chip Public Key<br/>with IPFS Metadata"]
        VerifyMatch --> DisplayProduct["Display Product Info<br/>& Verification Status"]
    end

    %% NO PATH - Registration Flow
    NFTExists -- No --> ShowWallets["Show Wallet Options<br/>(Gem, Xaman, Crossmark)"]
    ShowWallets --> ConnectWallet["User Connects Wallet"]
    ConnectWallet --> CheckAuth{Wallet Address<br/>Authorized?}

    CheckAuth -- No --> AuthError["Display Authorization Error<br/>'Contact phygital@ap0cene.com'"]
    CheckAuth -- Yes --> FillMetadata["Fill Product Metadata Form<br/>(includes chip public key)"]

    FillMetadata --> UploadIPFS["Upload Metadata to IPFS<br/>via Pinata"]
    UploadIPFS --> CreateURI["Generate NFT URI:<br/>ipfs://[hash]:[chipPublicKey]"]
    CreateURI --> MintNFT["Mint NFT on XRPL<br/>with Taxon & URI"]
    MintNFT --> Success["Display Success<br/>Transaction Hash"]

    %% Styling
    classDef scan fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef decision fill:#fff3e0,stroke:#e65100,stroke-width:2px;
    classDef verification fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px;
    classDef registration fill:#f3e5f5,stroke:#4a148c,stroke-width:2px;
    classDef error fill:#ffebee,stroke:#b71c1c,stroke-width:2px;
    classDef success fill:#e0f2f1,stroke:#004d40,stroke-width:2px;

    style consumer fill:#f0f9ff,stroke:#0369a1,stroke-width:3px,rx:10,ry:10

    class Start,VerifyChip,ComputeTaxon,SearchNFT scan;
    class ChipValid,NFTExists,CheckAuth decision;
    class ExtractURI,LoadIPFS,VerifyMatch,DisplayProduct verification;
    class ShowWallets,ConnectWallet,FillMetadata,UploadIPFS,CreateURI,MintNFT registration;
    class Error,AuthError error;
    class Success success;
```

## Tech Stack

- React 18.2.0
- TypeScript 4.4.2
- Grommet UI Framework 2.25.0
- XRPL SDK 2.8.1
- React Router DOM 6.14.0
- React Hook Form 7.48.2
- Yup for form validation

## Key Dependencies

- **Wallet Integration**:
  - @crossmarkio/sdk
  - @gemwallet/api
  - xumm
  - xrpl
- **UI Components**:
  - grommet
  - grommet-icons
  - grommet-theme-hpe
  - styled-components
- **Form Handling**:
  - react-hook-form
  - @hookform/resolvers
  - yup
- **HTTP Client**:
  - axios
- **Development Tools**:
  - react-app-rewired
  - eslint
  - prettier
  - typescript

## Application Structure

```
src/
├── components/
│   ├── autoform/      # Form components
│   ├── forms/         # Form-related components
│   ├── home/          # Home page components
│   ├── NavBody.tsx    # Main navigation component
│   └── PageHeader.tsx # Page header component
├── walletUtils/       # Wallet integration utilities
│   ├── crossmark.ts   # Crossmark wallet integration
│   ├── gem.ts         # Gem wallet integration
│   ├── index.ts       # Main wallet utilities
│   └── xaman.ts       # Xaman wallet integration
├── types/             # TypeScript type definitions
├── state/             # State management
├── lib/               # Utility libraries
├── App.tsx            # Main application component
└── index.tsx          # Application entry point
```

## Key Features

1. **Multi-Wallet Support**:

   - Integration with Crossmark
   - Integration with Gem Wallet
   - Integration with Xaman
   - XRPL functionality

2. **UI Framework**:

   - Uses Grommet UI framework
   - Custom theme based on HPE theme
   - Responsive design

3. **Form Handling**:

   - Advanced form validation with Yup
   - React Hook Form integration
   - Autoform components for dynamic forms

4. **Navigation**:
   - React Router DOM for routing
   - Main navigation through NavBody component
   - Page header with consistent layout

## Development

- Development server runs on port 3001
- Uses react-app-rewired for configuration
- Includes ESLint and Prettier for code quality
- TypeScript for type safety

## Build and Deployment

```bash
# Start development server
yarn start

# Build for production
yarn build

# Deploy to Firebase
yarn deploy
```

## Environment

- Node.js environment
- Browser-based crypto operations
- Firebase hosting for deployment

## Security Considerations

- Browser-based crypto operations
- Wallet integration security
- Form validation and sanitization
- Secure API communication

## Future Reference

This documentation serves as a quick reference for understanding the application's structure, dependencies, and key features. For detailed implementation, refer to the specific component files and their documentation.

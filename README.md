# Ap0cene Phygital NFTs

> **Phygital Authentication Platform** - Bridging the gap between physical products and digital ownership through NFC-enabled blockchain authentication.

## What is Ap0cene?

[Ap0cene](https://apocene.co/) is revolutionizing fashion and product authentication by combining **encrypted NFC chips** with **XRPL blockchain technology**. This frontend application powers the encoding platform where brands and creators can:

- **Register products** by minting NFTs linked to NFC chips
- **Verify authenticity** when consumers scan products
- **Create phygital experiences** that blend physical and digital ownership

Whether you're a luxury brand or an independent creator, our platform makes blockchain-based product authentication accessible to everyone—no coding required, just a smartphone.

## 🔐 How It Works: Authentication Flow

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

    CheckAuth -- No --> AuthError["Display Authorization Error"]
    CheckAuth -- Yes --> FillMetadata["Fill Product Metadata Form"]

    FillMetadata --> UploadIPFS["Upload Metadata + <br> Chip Public Key to IPFS"]
    UploadIPFS --> CreateURI["Generate NFT URI:<br/>ipfs://[hash]:[chipPublicKey]"]
    CreateURI --> MintNFT["Mint NFT on XRPL<br/>with Taxon & URI"]
    MintNFT --> Success["Display Success<br/>Transaction Hash"]

    %% Complete the loop - after registration, user can scan again
    Success -.->|"Scan chip again"| Start

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

## Core Features

- **🔗 Multi-Wallet Integration**: Seamless connection with Crossmark, Gem Wallet, and Xaman
- **📱 NFC Chip Authentication**: Cryptographic verification of product authenticity
- **🌐 XRPL Blockchain**: Decentralized NFT minting and verification on XRP Ledger
- **📄 IPFS Metadata Storage**: Distributed storage for product information and media
- **✨ No-Code Experience**: Intuitive interface for creators without technical expertise

## Tech Stack

Built with modern web technologies for reliability and performance:

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Grommet with custom theming
- **Blockchain**: XRPL SDK for NFT operations
- **Wallets**: Crossmark, Gem Wallet, Xaman integrations
- **Forms**: Custom form library
- **Storage**: IPFS for decentralized metadata

## Project Structure

```
src/
├── components/
│   ├── autoform/      # Dynamic form components
│   ├── forms/         # Product registration forms
│   ├── home/          # Landing and verification pages
│   └── NavBody.tsx    # Main navigation
├── walletUtils/       # Wallet integration utilities
│   ├── crossmark.ts   # Crossmark wallet
│   ├── gem.ts         # Gem wallet
│   └── xaman.ts       # Xaman wallet
├── types/             # TypeScript definitions
├── state/             # Application state management
└── lib/               # Utility functions
```

## Getting Started

```bash
# Install dependencies
yarn install

# Start development server (runs on port 3001)
yarn start

# Build for production
yarn build

# Deploy to Firebase
yarn deploy
```

## Learn More

- 🌐 **Platform**: [apocene.co](https://apocene.co/)
- 🎥 **How-to Video**: [Watch the tutorial](https://www.youtube.com/watch?v=58755dOkFrA)

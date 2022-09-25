# Headen-Finance : The Next Generation Lending Protocol

## Coming Soon to Polygon, Bsc, Arbitrum, Eth, Optimism and Solana

## A Credit based MultiChain lending protocol

Headen Finance intends to bring you a multichain lending and borrowing protocol where you can deposit/borrow funds on a chain and
can borrow across any chain Headen Finance is present in.

### A full rundown of the features Headen Finance gives you are

- Credit-based lending: You can borrow multiple time without collaterals up to 70% of your total staked assets value aggregated across chains.
- Staking of Liquidity tokens and earn interest to cover your impermanent loss
- Multi-chain lending: You do not need to move your liquidity from any chain to tyour needed. You ust stake and have access to lending on any chain without withdrawing and bridging
- Credit score for users and a user with >80% credit score can borrow up to 90% the total staked assets instead of 70%.
- Some Popular and Verified NFTs collections can be used collateral
- Mobile focused easy to use application: You do not need to use a complex UX designed application to borrow or lend :) Desktop version is also available for the degens.
- Semi-fixed interest rate with fixed band of variations
- Higher APYs than competitions

This current repository is for the EthGlobal Online Hackathon where it is deployed on Mumbai, Optimism and Arbitrium Testnets. Unfortunately some third party dependents used do not offer
stable services in testnets. This might affect the behaviours. You can always use the alpha mainnet contracts.
Please note that The contracts have not yet been audited and some features are intentionally not added yet for the purpose of the hackathon.

### Third Party services Used

- DeBridge: For Liquidity Balancing of contracts on different chains: ETH (1000 USD) & MATIC(500 USD) <-> ETH(750USD) & MATIC(750USD) on request
- MultiChain
- HyperLane(Abacus): Cross Chain Communication of contracts to allow other contracts on their chain record the new user details
- Moralis Cloud FUnction: Cross Chain Communication
- ChainLink Keepers & OpenZeppelin Relayers: For automating some functions (rates and usd updates) as relayers
- ChainLink USDC Data Feed
- Polygon Chain: Parent Chain
- Eth, Arbitrum, Optimism: Child Chains

### Tests Contracts

- Mumbai (Parent) - 0xc6151C174EA7F9a3013BBAF5bb3185BFc49324B6
- Arbitrum (Child) - 0xc6151C174EA7F9a3013BBAF5bb3185BFc49324B6
- Polygon (Parent) - 0x76A1ee1738818566D6663db22b0061ae0A57C9fd
- Arbitrium (Child) -

### Protoypes

- [Design Prototype](https://www.figma.com/proto/6twO6s4wxXVkgROXhY5hjz/ETHGlobal-Hackathon?page-id=252%3A1124&node-id=342%3A1950&viewport=207%2C-1450%2C0.24&scaling=min-zoom&starting-point-node-id=342%3A1950)

- [Website Page](https://headen-finance-w8hk.vercel.app/)

## Disclaimer

Headen FInance will not be held responsible for any loss of funds as you have been informed that these contracts are unaudited and have incomplete features as these were deployed for EthOnline Hackathon Purposes. Please test with very minute amount of token which you can afford to lose.

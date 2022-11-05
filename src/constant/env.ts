import { AddressZero } from "@ethersproject/constants";

export const isProd = process.env.NODE_ENV === "production";
export const isLocal = process.env.NODE_ENV === "development";
import { Address, chain } from "wagmi";

export const showLogger = isLocal
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === "true" ?? false;

export const alchemyKey =
  process.env.NEXT_PUBLIC_DEV_ALCHEMY_ID ?? "frRKl_kbOik5UzWIaoc7PCHSmORRQDzi";

export const HASH_SALT = "asd";

export type ChainConfig = {
  contractAddress: Address;
  routerAddress: Address;
  usdcAddress: Address;
  maticAddress: Address;
  daiAddress: Address;
  chainlinkUsdcFeed: Address;
};

export const CHAIN_CONFIG: { [p: number]: ChainConfig } = {
  [-1]: {
    contractAddress: "0xc6151C174EA7F9a3013BBAF5bb3185BFc49324B6",
    maticAddress: AddressZero,
    usdcAddress: AddressZero,
    daiAddress: AddressZero,
    routerAddress: AddressZero,
    chainlinkUsdcFeed: AddressZero,
  }, //no connected wallet
  [chain.mainnet.id]: {
    contractAddress: AddressZero,
    maticAddress: AddressZero,
    usdcAddress: AddressZero,
    daiAddress: AddressZero,
    routerAddress: AddressZero,
    chainlinkUsdcFeed: AddressZero,
  },
  [chain.polygon.id]: {
    contractAddress: "0x76A1ee1738818566D6663db22b0061ae0A57C9fd",
    maticAddress: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    usdcAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    daiAddress: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    routerAddress: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
    chainlinkUsdcFeed: "0xfe4a8cc5b5b2366c1b58bea3858e81843581b2f7",
  }, //no c
  [chain.arbitrum.id]: {
    contractAddress: AddressZero,
    maticAddress: AddressZero,
    usdcAddress: AddressZero,
    daiAddress: AddressZero,
    routerAddress: AddressZero,
    chainlinkUsdcFeed: AddressZero,
  },
  //testnets
  [chain.arbitrumGoerli.id]: {
    contractAddress: "0xc6151C174EA7F9a3013BBAF5bb3185BFc49324B6",
    maticAddress: AddressZero,
    usdcAddress: AddressZero,
    daiAddress: AddressZero,
    routerAddress: AddressZero,
    chainlinkUsdcFeed: AddressZero,
  },
  [chain.polygonMumbai.id]: {
    contractAddress: "0xc6151C174EA7F9a3013BBAF5bb3185BFc49324B6", //"0x686C74f85dd4E33B76A4e8a882f09266f51cE657",
    maticAddress: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
    usdcAddress: "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747",
    daiAddress: "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F",
    routerAddress: "0x8954AfA98594b838bda56FE4C12a09D7739D179b",
    chainlinkUsdcFeed: "0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0",
  },
  [chain.goerli.id]: {
    contractAddress: "0xc6151C174EA7F9a3013BBAF5bb3185BFc49324B6",
    maticAddress: AddressZero,
    usdcAddress: AddressZero,
    daiAddress: AddressZero,
    routerAddress: AddressZero,
    chainlinkUsdcFeed: AddressZero,
  },
};

export const headenFinanceAbi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_interval",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_multichainRouter",
        type: "address",
      },
      {
        internalType: "string",
        name: "_hashSalt",
        type: "string",
      },
      {
        internalType: "address",
        name: "_swapRouter",
        type: "address",
      },
      {
        internalType: "address",
        name: "_usdc",
        type: "address",
      },
      {
        internalType: "address",
        name: "_dai",
        type: "address",
      },
      {
        internalType: "address",
        name: "_matic",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "_abacusManager",
            type: "address",
          },
          {
            internalType: "address",
            name: "_abacusPay",
            type: "address",
          },
        ],
        internalType: "struct HeadenFinanceChild.Abacus",
        name: "_abacus",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "address",
            name: "_parentAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_parentChainId",
            type: "uint256",
          },
          {
            internalType: "uint32",
            name: "_hlParentId",
            type: "uint32",
          },
        ],
        internalType: "struct HeadenFinanceChild.Parent",
        name: "_parent",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "_chainId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint64",
            name: "supplyKink",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "supplyPerYearInterestRateSlopeLow",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "supplyPerYearInterestRateSlopeHigh",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "supplyPerYearInterestRateBase",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "borrowKink",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "borrowPerYearInterestRateSlopeLow",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "borrowPerYearInterestRateSlopeHigh",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "borrowPerYearInterestRateBase",
            type: "uint64",
          },
        ],
        internalType: "struct HeadenUtils.Configuration",
        name: "config",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "abacusConnectionManager",
        type: "address",
      },
    ],
    name: "AbacusConnectionManagerSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "Borrowed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "ChainSyncRequired",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "FullChainSyncRequired",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "interchainGasPaymaster",
        type: "address",
      },
    ],
    name: "InterchainGasPaymasterSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "LockUntilUpdateFromParentChain",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint32",
        name: "domain",
        type: "uint32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "router",
        type: "bytes32",
      },
    ],
    name: "RemoteRouterEnrolled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "Staked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "userAddress",
            type: "address",
          },
          {
            internalType: "bool",
            name: "available",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "totalAmountBorrowed",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalAmountStaked",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "ltv",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "lock",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "lastAPRUpdated",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct HeadenFinanceChild.User",
        name: "user",
        type: "tuple",
      },
    ],
    name: "UpdateParentChain",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "Withdrawn",
    type: "event",
  },
  {
    inputs: [],
    name: "SECONDS_PER_YEAR",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "abacusConnectionManager",
    outputs: [
      {
        internalType: "contract IAbacusConnectionManager",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint128",
        name: "_id",
        type: "uint128",
      },
    ],
    name: "borrowInterestRates",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "borrowKink",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "borrowPerSecondInterestRateBase",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "borrowPerSecondInterestRateSlopeHigh",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "borrowPerSecondInterestRateSlopeLow",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amountToBorrow",
        type: "uint256",
      },
    ],
    name: "borrowToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amountToBorrow",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_collateralAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_collateralAmount",
        type: "uint256",
      },
    ],
    name: "borrowTokenWithCollateral",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "chainId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "checkUpkeep",
    outputs: [
      {
        internalType: "bool",
        name: "upkeepNeeded",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    name: "createMarket",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "createMarketPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "dai",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "_domain",
        type: "uint32",
      },
      {
        internalType: "bytes32",
        name: "_router",
        type: "bytes32",
      },
    ],
    name: "enrollRemoteRouter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getRiskLevel",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "_origin",
        type: "uint32",
      },
      {
        internalType: "bytes32",
        name: "_sender",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "_message",
        type: "bytes",
      },
    ],
    name: "handle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "hlParentId",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "interchainGasPaymaster",
    outputs: [
      {
        internalType: "contract IInterchainGasPaymaster",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "interval",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastAPRUpdate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastTimeStamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "lockThisUserUntilParentUpdate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "marketTokens",
    outputs: [
      {
        internalType: "bool",
        name: "available",
        type: "bool",
      },
      {
        internalType: "uint128",
        name: "_id",
        type: "uint128",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "market_pools",
    outputs: [
      {
        internalType: "uint128",
        name: "",
        type: "uint128",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint128",
        name: "",
        type: "uint128",
      },
    ],
    name: "markets",
    outputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "bool",
        name: "available",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "amountStaked",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountBorrowed",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timeLastBorrowed",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timeLastStaked",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "borrowRate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "supplyRate",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "matic",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxLTV",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "multichainRouter",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "parentAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "parentChainId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "per_amount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "performUpkeep",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "totalStakes",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalBorrows",
            type: "uint256",
          },
        ],
        internalType: "struct HeadenFinanceChild.FullUpdateData[]",
        name: "usersData",
        type: "tuple[]",
      },
    ],
    name: "receiveFullUpdateFromParentChain",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "totalStakes",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalBorrows",
        type: "uint256",
      },
    ],
    name: "receiveUpdateFromParentChain",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "relayers",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "repayLoan",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    name: "routers",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_abacusConnectionManager",
        type: "address",
      },
    ],
    name: "setAbacusConnectionManager",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_interchainGasPaymaster",
        type: "address",
      },
    ],
    name: "setInterchainGasPaymaster",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amountToStake",
        type: "uint256",
      },
    ],
    name: "stakeToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint128",
        name: "_id",
        type: "uint128",
      },
    ],
    name: "supplyInterestRates",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "supplyKink",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "supplyPerSecondInterestRateBase",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "supplyPerSecondInterestRateSlopeHigh",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "supplyPerSecondInterestRateSlopeLow",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tax",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint64",
            name: "supplyKink",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "supplyPerYearInterestRateSlopeLow",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "supplyPerYearInterestRateSlopeHigh",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "supplyPerYearInterestRateBase",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "borrowKink",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "borrowPerYearInterestRateSlopeLow",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "borrowPerYearInterestRateSlopeHigh",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "borrowPerYearInterestRateBase",
            type: "uint64",
          },
        ],
        internalType: "struct HeadenUtils.Configuration",
        name: "config",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "_relayer",
        type: "address",
      },
    ],
    name: "updateSettings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "usdc",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "userAddresses",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "users",
    outputs: [
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        internalType: "bool",
        name: "available",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "totalAmountBorrowed",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalAmountStaked",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "ltv",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "lock",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "lastAPRUpdated",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "usersborrows",
    outputs: [
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "bool",
        name: "available",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "amountBorrowed",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "userstakes",
    outputs: [
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "bool",
        name: "available",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "amountStaked",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "validateUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "validateUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "validateUsers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amountToWithdraw",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_chainId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
    ],
    name: "withdrawToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

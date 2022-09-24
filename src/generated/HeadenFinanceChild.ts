/* eslint-disable */
import { EthersContractContextV5 } from 'ethereum-abi-types-generator';
import {
  BigNumber,
  BigNumberish,
  BytesLike as Arrayish,
  ContractTransaction,
} from 'ethers';

export type ContractContext = EthersContractContextV5<
  HeadenFinanceChild,
  HeadenFinanceChildMethodNames,
  HeadenFinanceChildEventsContext,
  HeadenFinanceChildEvents
>;

export declare type EventFilter = {
  address?: string;
  topics?: Array<string>;
  fromBlock?: string | number;
  toBlock?: string | number;
};

export interface ContractTransactionOverrides {
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number;
  /**
   * The price (in wei) per unit of gas
   */
  gasPrice?: BigNumber | string | number | Promise<any>;
  /**
   * The nonce to use in the transaction
   */
  nonce?: number;
  /**
   * The amount to send with the transaction (i.e. msg.value)
   */
  value?: BigNumber | string | number | Promise<any>;
  /**
   * The chain ID (or network ID) to use
   */
  chainId?: number;
}

export interface ContractCallOverrides {
  /**
   * The address to execute the call as
   */
  from?: string;
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number;
}
export type HeadenFinanceChildEvents =
  | 'Borrowed'
  | 'ChainSyncRequired'
  | 'FullChainSyncRequired'
  | 'LockUntilUpdateFromParentChain'
  | 'OwnershipTransferred'
  | 'Staked'
  | 'UpdateParentChain'
  | 'Withdrawn';
export interface HeadenFinanceChildEventsContext {
  Borrowed(...parameters: any): EventFilter;
  ChainSyncRequired(...parameters: any): EventFilter;
  FullChainSyncRequired(...parameters: any): EventFilter;
  LockUntilUpdateFromParentChain(...parameters: any): EventFilter;
  OwnershipTransferred(...parameters: any): EventFilter;
  Staked(...parameters: any): EventFilter;
  UpdateParentChain(...parameters: any): EventFilter;
  Withdrawn(...parameters: any): EventFilter;
}
export type HeadenFinanceChildMethodNames =
  | 'new'
  | 'SECONDS_PER_YEAR'
  | 'addRelayers'
  | 'borrowInterestRates'
  | 'borrowKink'
  | 'borrowPerSecondInterestRateBase'
  | 'borrowPerSecondInterestRateSlopeHigh'
  | 'borrowPerSecondInterestRateSlopeLow'
  | 'borrowToken'
  | 'borrowTokenWithCollateral'
  | 'chainId'
  | 'checkUpkeep'
  | 'createMarket'
  | 'createMarketPool'
  | 'dai'
  | 'getRiskLevel'
  | 'interval'
  | 'lastTimeStamp'
  | 'lockThisUserUntilParentUpdate'
  | 'marketTokens'
  | 'markets'
  | 'matic'
  | 'multichainRouter'
  | 'owner'
  | 'performUpkeep'
  | 'receiveFullUpdateFromParentChain'
  | 'receiveUpdateFromParentChain'
  | 'relayers'
  | 'renounceOwnership'
  | 'repayLoan'
  | 'requestFullUpdateFromParent'
  | 'requestUpdateFromParent'
  | 'stakeToken'
  | 'supplyInterestRates'
  | 'supplyKink'
  | 'supplyPerSecondInterestRateBase'
  | 'supplyPerSecondInterestRateSlopeHigh'
  | 'supplyPerSecondInterestRateSlopeLow'
  | 'tax'
  | 'transferOwnership'
  | 'updateConfiguration'
  | 'usd_amount'
  | 'usdc'
  | 'users'
  | 'usersborrows'
  | 'userstakes'
  | 'validateUsers'
  | 'withdrawToken';
export interface undefinedRequest {
  supplyKink: BigNumberish;
  supplyPerYearInterestRateSlopeLow: BigNumberish;
  supplyPerYearInterestRateSlopeHigh: BigNumberish;
  supplyPerYearInterestRateBase: BigNumberish;
  borrowKink: BigNumberish;
  borrowPerYearInterestRateSlopeLow: BigNumberish;
  borrowPerYearInterestRateSlopeHigh: BigNumberish;
  borrowPerYearInterestRateBase: BigNumberish;
}
export interface ChainSyncRequiredEventEmittedResponse {
  user: string;
}
export interface LockUntilUpdateFromParentChainEventEmittedResponse {
  user: string;
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface CheckUpkeepResponse {
  upkeepNeeded: boolean;
  0: boolean;
  result1: string;
  1: string;
  length: 2;
}
export interface MarketTokensResponse {
  available: boolean;
  0: boolean;
  _id: BigNumber;
  1: BigNumber;
  length: 2;
}
export interface MarketsResponse {
  tokenAddress: string;
  0: string;
  available: boolean;
  1: boolean;
  amountStaked: BigNumber;
  2: BigNumber;
  amountBorrowed: BigNumber;
  3: BigNumber;
  timeLastBorrowed: BigNumber;
  4: BigNumber;
  timeLastStaked: BigNumber;
  5: BigNumber;
  borrowRate: BigNumber;
  6: BigNumber;
  supplyRate: BigNumber;
  7: BigNumber;
  length: 8;
}
export interface ReceiveFullUpdateFromParentChainRequest {
  user: string;
  totalStakes: BigNumberish;
  totalBorrows: BigNumberish;
}
export interface UpdateConfigurationRequest {
  supplyKink: BigNumberish;
  supplyPerYearInterestRateSlopeLow: BigNumberish;
  supplyPerYearInterestRateSlopeHigh: BigNumberish;
  supplyPerYearInterestRateBase: BigNumberish;
  borrowKink: BigNumberish;
  borrowPerYearInterestRateSlopeLow: BigNumberish;
  borrowPerYearInterestRateSlopeHigh: BigNumberish;
  borrowPerYearInterestRateBase: BigNumberish;
}
export interface UsersResponse {
  userAddress: string;
  0: string;
  available: boolean;
  1: boolean;
  totalAmountBorrowed: BigNumber;
  2: BigNumber;
  totalAmountStaked: BigNumber;
  3: BigNumber;
  creditScore: BigNumber;
  4: BigNumber;
  ltv: BigNumber;
  5: BigNumber;
  lock: boolean;
  6: boolean;
  length: 7;
}
export interface UsersborrowsResponse {
  userAddress: string;
  0: string;
  tokenAddress: string;
  1: string;
  available: boolean;
  2: boolean;
  amountBorrowed: BigNumber;
  3: BigNumber;
  collateralAddress: string;
  4: string;
  collateralAmount: BigNumber;
  5: BigNumber;
  borrowRouter: string;
  6: string;
  timeLastBorrowed: BigNumber;
  7: BigNumber;
  length: 8;
}
export interface UserstakesResponse {
  userAddress: string;
  0: string;
  tokenAddress: string;
  1: string;
  available: boolean;
  2: boolean;
  amountStaked: BigNumber;
  3: BigNumber;
  timeLastStaked: BigNumber;
  4: BigNumber;
  length: 5;
}
export interface HeadenFinanceChild {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param _interval Type: uint256, Indexed: false
   * @param _multichainRouter Type: address, Indexed: false
   * @param _hashSalt Type: string, Indexed: false
   * @param _swapRouter Type: address, Indexed: false
   * @param _usdc Type: address, Indexed: false
   * @param _dai Type: address, Indexed: false
   * @param _matic Type: address, Indexed: false
   * @param config Type: tuple, Indexed: false
   * @param overrides
   */
  'new'(
    _interval: BigNumberish,
    _multichainRouter: string,
    _hashSalt: string,
    _swapRouter: string,
    _usdc: string,
    _dai: string,
    _matic: string,
    config: undefinedRequest,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  SECONDS_PER_YEAR(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _relayer Type: address, Indexed: false
   * @param overrides
   */
  addRelayers(
    _relayer: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _id Type: uint128, Indexed: false
   * @param overrides
   */
  borrowInterestRates(
    _id: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  borrowKink(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  borrowPerSecondInterestRateBase(
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  borrowPerSecondInterestRateSlopeHigh(
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  borrowPerSecondInterestRateSlopeLow(
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _tokenAddress Type: address, Indexed: false
   * @param _amountToBorrow Type: uint256, Indexed: false
   * @param overrides
   */
  borrowToken(
    _tokenAddress: string,
    _amountToBorrow: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _tokenAddress Type: address, Indexed: false
   * @param _amountToBorrow Type: uint256, Indexed: false
   * @param _collateralAddress Type: address, Indexed: false
   * @param _collateralAmount Type: uint256, Indexed: false
   * @param overrides
   */
  borrowTokenWithCollateral(
    _tokenAddress: string,
    _amountToBorrow: BigNumberish,
    _collateralAddress: string,
    _collateralAmount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  chainId(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: bytes, Indexed: false
   * @param overrides
   */
  checkUpkeep(
    parameter0: Arrayish,
    overrides?: ContractCallOverrides
  ): Promise<CheckUpkeepResponse>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _token Type: address, Indexed: false
   * @param overrides
   */
  createMarket(
    _token: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _token Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   * @param overrides
   */
  createMarketPool(
    _token: string,
    amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  dai(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getRiskLevel(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  interval(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  lastTimeStamp(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param user Type: address, Indexed: false
   * @param overrides
   */
  lockThisUserUntilParentUpdate(
    user: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   * @param overrides
   */
  marketTokens(
    parameter0: string,
    overrides?: ContractCallOverrides
  ): Promise<MarketTokensResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint128, Indexed: false
   * @param overrides
   */
  markets(
    parameter0: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<MarketsResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  matic(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  multichainRouter(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  owner(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param parameter0 Type: bytes, Indexed: false
   * @param overrides
   */
  performUpkeep(
    parameter0: Arrayish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param usersData Type: tuple[], Indexed: false
   * @param overrides
   */
  receiveFullUpdateFromParentChain(
    usersData: ReceiveFullUpdateFromParentChainRequest[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param user Type: address, Indexed: false
   * @param totalStakes Type: uint256, Indexed: false
   * @param totalBorrows Type: uint256, Indexed: false
   * @param overrides
   */
  receiveUpdateFromParentChain(
    user: string,
    totalStakes: BigNumberish,
    totalBorrows: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   * @param overrides
   */
  relayers(
    parameter0: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  renounceOwnership(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _tokenAddress Type: address, Indexed: false
   * @param _amount Type: uint256, Indexed: false
   * @param overrides
   */
  repayLoan(
    _tokenAddress: string,
    _amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  requestFullUpdateFromParent(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param user Type: address, Indexed: false
   * @param overrides
   */
  requestUpdateFromParent(
    user: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _tokenAddress Type: address, Indexed: false
   * @param _amountToStake Type: uint256, Indexed: false
   * @param overrides
   */
  stakeToken(
    _tokenAddress: string,
    _amountToStake: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _id Type: uint128, Indexed: false
   * @param overrides
   */
  supplyInterestRates(
    _id: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  supplyKink(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  supplyPerSecondInterestRateBase(
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  supplyPerSecondInterestRateSlopeHigh(
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  supplyPerSecondInterestRateSlopeLow(
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  tax(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newOwner Type: address, Indexed: false
   * @param overrides
   */
  transferOwnership(
    newOwner: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param config Type: tuple, Indexed: false
   * @param overrides
   */
  updateConfiguration(
    config: UpdateConfigurationRequest,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param amount Type: uint256, Indexed: false
   * @param overrides
   */
  usd_amount(
    amount: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  usdc(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   * @param overrides
   */
  users(
    parameter0: string,
    overrides?: ContractCallOverrides
  ): Promise<UsersResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: bytes32, Indexed: false
   * @param overrides
   */
  usersborrows(
    parameter0: Arrayish,
    overrides?: ContractCallOverrides
  ): Promise<UsersborrowsResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: bytes32, Indexed: false
   * @param overrides
   */
  userstakes(
    parameter0: Arrayish,
    overrides?: ContractCallOverrides
  ): Promise<UserstakesResponse>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  validateUsers(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _tokenAddress Type: address, Indexed: false
   * @param _amountToWithdraw Type: uint256, Indexed: false
   * @param _chainId Type: uint256, Indexed: false
   * @param _to Type: address, Indexed: false
   * @param overrides
   */
  withdrawToken(
    _tokenAddress: string,
    _amountToWithdraw: BigNumberish,
    _chainId: BigNumberish,
    _to: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
}

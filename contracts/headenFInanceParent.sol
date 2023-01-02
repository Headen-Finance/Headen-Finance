// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma abicoder v2;

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";
import {Router} from "@hyperlane-xyz/app/contracts/Router.sol";


interface ChainLinkAggregatorInterface {
  function latestAnswer() external view returns (int256);
  function latestTimestamp() external view returns (uint256);
  function latestRound() external view returns (uint256);
  function getAnswer(uint256 roundId) external view returns (int256);
  function getTimestamp(uint256 roundId) external view returns (uint256);
  function decimals() external view returns (uint8);
  function description() external view returns (string memory);
  function version() external view returns (uint256);

  event AnswerUpdated(int256 indexed current, uint256 indexed roundId, uint256 updatedAt);
  event NewRound(uint256 indexed roundId, address indexed startedBy, uint256 startedAt);
}

interface IMultiChain {
    function anySwapOut(address token, address to, uint amount, uint toChainID) external;
    function anySwapOutUnderlying(address token, address to, uint amount, uint toChainID) external;
    function anySwapOut(address[] calldata tokens, address[] calldata to, uint[] calldata amounts, uint[] calldata toChainIDs) external;
}

contract HeadenUtils is ReentrancyGuard {
    address swapRouter;
    string  hashSalt;
    ChainLinkAggregatorInterface chainLink;
    uint public tax = 350; //3.5%
    address public multichainRouter;
    address public usdc;
    address public dai;
    address public matic;
    uint multiplier = 10**18;
    uint public SECONDS_PER_YEAR = 3600 * 24 * 365;
    uint32 public immutable defaultId = 0;
    uint public immutable interval;
    uint public lastTimeStamp;
    uint public chainId;
    uint public maxLTV = 7000;
    uint public lastAPRUpdate = block.timestamp;
    uint public minAmount = 10000000;
    
    uint public  supplyKink;
    uint public  supplyPerSecondInterestRateSlopeLow;
    uint public  supplyPerSecondInterestRateSlopeHigh;
    uint public  supplyPerSecondInterestRateBase;
    uint public  borrowKink;
    uint public  borrowPerSecondInterestRateSlopeLow;
    uint public  borrowPerSecondInterestRateSlopeHigh;
    uint public  borrowPerSecondInterestRateBase;

    event Staked(uint _amount, address tokenAddress);
    event Borrowed(uint _amount, address tokenAddress);
    event Withdrawn(uint _amount, address tokenAddress);
    event Repayed(uint _amount, address tokenAddress);
    event FullChainSyncRequired();
    event UpdateChildChains(User user);

    //user specific
    struct User {
        address userAddress;
        bool available;
        uint totalAmountBorrowed; //in usd up to 8 decimal places
        uint totalAmountStaked; //in usd
        bool lock;
        uint lastAPRUpdated;
    }

    //stake specific
    struct UserStake {
        address userAddress;
        address tokenAddress;
        bool available;
        uint amountStaked; 
    }

    //borrow/collateral specific
    struct UserBorrow {
        address userAddress;
        address tokenAddress;
        bool available;
        uint amountBorrowed; //amount of token address borrowed
    }

    struct Market {
        address tokenAddress;
        bool available;
        uint amountStaked;
        uint amountBorrowed;
        uint timeLastBorrowed;
        uint timeLastStaked;
        uint borrowRate;
        uint supplyRate;
    }

    struct FullUpdateData {
        address user;
        uint totalStakes;
        uint totalBorrows;
    }

    struct MarketToken{
        bool available;
        uint128 _id;
        //uint _hyperLaneId;
    }

    struct Chain{
        address _address;
        uint _chainId;
        uint32 _hlId;
        bool _exists;
    }

    struct Abacus {
        address _abacusManager;
        address _abacusPay;
    }

    struct Configuration {
        uint64 supplyKink;
        uint64 supplyPerYearInterestRateSlopeLow;
        uint64 supplyPerYearInterestRateSlopeHigh;
        uint64 supplyPerYearInterestRateBase;
        uint64 borrowKink;
        uint64 borrowPerYearInterestRateSlopeLow;
        uint64 borrowPerYearInterestRateSlopeHigh;
        uint64 borrowPerYearInterestRateBase;
    }

    constructor(uint _interval, address _multichainRouter, string memory _hashSalt, address _swapRouter, address _usdc, address _chainLink, uint _chainId, Configuration memory config){
        multichainRouter=_multichainRouter;
        hashSalt =_hashSalt;
        swapRouter=_swapRouter;
        usdc = _usdc;
        interval = _interval;
        lastTimeStamp = block.timestamp;
        chainId = _chainId;
        chainLink = ChainLinkAggregatorInterface(_chainLink);

        // Set interest rate model configs
        unchecked {
            supplyKink = config.supplyKink;
            supplyPerSecondInterestRateSlopeLow = config.supplyPerYearInterestRateSlopeLow / SECONDS_PER_YEAR;
            supplyPerSecondInterestRateSlopeHigh = config.supplyPerYearInterestRateSlopeHigh / SECONDS_PER_YEAR;
            supplyPerSecondInterestRateBase = config.supplyPerYearInterestRateBase / SECONDS_PER_YEAR;
            borrowKink = config.borrowKink;
            borrowPerSecondInterestRateSlopeLow = config.borrowPerYearInterestRateSlopeLow / SECONDS_PER_YEAR;
            borrowPerSecondInterestRateSlopeHigh = config.borrowPerYearInterestRateSlopeHigh / SECONDS_PER_YEAR;
            borrowPerSecondInterestRateBase = config.borrowPerYearInterestRateBase / SECONDS_PER_YEAR;
        }
    }

    function getAvgPriceForTokens(uint amountIn, address _router, address[] memory path) internal view returns(uint){
       uint[] memory amount = IUniswapV2Router02(_router).getAmountsOut(amountIn, path);
       return amount[amount.length-1];
    }

    function multiply(uint _decimals) internal pure returns(uint){
        return 10**_decimals;
    }

    function per_amount(uint amount) public pure returns(uint){
        return amount * 10000;
    }

    function getValueOfToken(address token, uint amount)internal view returns(uint){
         //value of pool
         uint value = multiply(IERC20(usdc).decimals());
         if(token != usdc){   
            uint _multiplier = multiply(IERC20(token).decimals());
            address[] memory path = new address[](2);
            path[0] = token;
            path[1] = usdc;
            
            // only direct pair
            value = getAvgPriceForTokens(1*_multiplier, swapRouter, path);       
            require(value > 0,"price output must be greater than zero");
         }
        
        return uint(chainLink.latestAnswer()) * value * amount / multiply(IERC20(token).decimals()) * multiply(IERC20(usdc).decimals());
    }
}

contract HeadenFinanceParent is HeadenUtils, KeeperCompatibleInterface, Router {
    mapping (uint => mapping(address=>User)) public users;
    mapping (bytes32=>UserBorrow) public usersborrows;
    mapping (bytes32=>UserStake) public userstakes;
    mapping (uint128 => Market) public markets;
    mapping (address => MarketToken) public marketTokens;
    mapping (address => bool) public relayers;
    mapping (uint => Chain) public chains;
    uint128 public market_pools = 0;
    address[] public userAddresses;
    uint32 public hlParentId;
    address public parentAddress;
    uint public parentChainId;
    uint32[] hlChainIds;

    constructor(uint _interval, address _multichainRouter, string memory _hashSalt, address _swapRouter, address _usdc, address _chainLink, Abacus memory _abacus, Chain memory _parent, uint _chainId, Configuration memory config) HeadenUtils (_interval,_multichainRouter, _hashSalt, _swapRouter, _usdc, _chainLink, _chainId, config) {
        relayers[msg.sender] = true;
        _setAbacusConnectionManager(_abacus._abacusManager);
        _setInterchainGasPaymaster(_abacus._abacusPay);
        chains[_parent._hlId] = Chain(address(this), _parent._chainId, _parent._hlId, true);
        hlParentId = _parent._hlId;
        parentAddress = address(this);
        parentChainId = _parent._chainId;
    }

    function updateSettings (Configuration calldata config, address _relayer, uint _minAmount, bool light) external onlyRelayers{
        if(light){
            minAmount = _minAmount;
        }else{
            relayers[_relayer] = true;
            unchecked {
                supplyKink = config.supplyKink;
                supplyPerSecondInterestRateSlopeLow = config.supplyPerYearInterestRateSlopeLow / SECONDS_PER_YEAR;
                supplyPerSecondInterestRateSlopeHigh = config.supplyPerYearInterestRateSlopeHigh / SECONDS_PER_YEAR;
                supplyPerSecondInterestRateBase = config.supplyPerYearInterestRateBase / SECONDS_PER_YEAR;
                borrowKink = config.borrowKink;
                borrowPerSecondInterestRateSlopeLow = config.borrowPerYearInterestRateSlopeLow / SECONDS_PER_YEAR;
                borrowPerSecondInterestRateSlopeHigh = config.borrowPerYearInterestRateSlopeHigh / SECONDS_PER_YEAR;
                borrowPerSecondInterestRateBase = config.borrowPerYearInterestRateBase / SECONDS_PER_YEAR;
            }
        }
    }

    // ---- UTILS ----

    function addChildChain(Chain memory _child) external onlyRelayers{
        chains[_child._hlId] = Chain(_child._address, _child._chainId, _child._hlId, true);
    }

    function updateUserTotalValueInUSD(address user) internal {
        uint totalStakeValue = 0;
        uint totalBorrowValue = 0;
        for(uint128 j=0; j<=market_pools; j++){
            bytes32 _hash = keccak256(abi.encodePacked(user, markets[j].tokenAddress, hashSalt));
            totalStakeValue += getValueOfToken(markets[j].tokenAddress, userstakes[_hash].amountStaked);
            totalBorrowValue += getValueOfToken(markets[j].tokenAddress, usersborrows[_hash].amountBorrowed);
        }

        users[chainId][user].totalAmountBorrowed = totalBorrowValue;
        users[chainId][user].totalAmountStaked = totalStakeValue;
    }

    function collateDataAllChains(address user) internal {
        updateUserTotalValueInUSD(user);
        uint totalstakes=0;
        uint totalborrows=0;
        for(uint128 j=0; j<hlChainIds.length; j++){
            uint _chainId = chains[hlChainIds[j]]._chainId;
            totalstakes += users[_chainId][user].totalAmountBorrowed;
            totalborrows += users[_chainId][user].totalAmountStaked;
        }

        users[defaultId][user].totalAmountBorrowed = totalborrows;
        users[defaultId][user].totalAmountStaked = totalstakes;
    }

    // for input: true is for addition and false is for subtraction. SO stake will be true and withdraw will be false
    function addToMarket(uint _tokenAmount, bool borrow, bool input, uint128 _id) private {
        if(borrow){
            if(input){
                markets[_id].amountBorrowed -= _tokenAmount;
            }else{
                markets[_id].amountBorrowed += _tokenAmount;
            }
            
            markets[_id].timeLastBorrowed = block.timestamp;
        }else{
            if(input){
                markets[_id].amountStaked += _tokenAmount;
            }else{
                markets[_id].amountStaked -= _tokenAmount;
            }
            
            markets[_id].timeLastStaked = block.timestamp;
        }

        updateMarket(_id);
    }

    // ---- DEPOSITS ----

    function _stakeToken(address _tokenAddress, uint _amountToStake) private{
        require(marketTokens[_tokenAddress].available, "market not available");
        bytes32 _hash = keccak256(abi.encodePacked(msg.sender, _tokenAddress, hashSalt));
        uint fee = (tax * _amountToStake) / 10000;
        uint valueOfTokens = getValueOfToken(_tokenAddress, _amountToStake-fee);
        require(valueOfTokens > minAmount, "Amount too low, enter an input greater than 5 USD value");
        updateUserTotalValueInUSD(msg.sender);

        if(userstakes[_hash].available){
            userstakes[_hash].amountStaked += _amountToStake - fee; 
        }else{
            userstakes[_hash] = UserStake(msg.sender, _tokenAddress, true, _amountToStake - fee);
        }  

        users[chainId][msg.sender].totalAmountStaked += valueOfTokens; 
        addToMarket(_amountToStake - fee, false, true, marketTokens[_tokenAddress]._id);

         //transfer tokens to contract
        require(IERC20(_tokenAddress).transferFrom(msg.sender, address(this), _amountToStake), "transferFrom failed from contract.");  
        collateDataAllChains(msg.sender);

         //child
        emit UpdateChildChains(users[chainId][msg.sender]);
        emit Staked(_amountToStake, _tokenAddress);
        dispatch(msg.sender);
    }

    function stakeToken(address _tokenAddress, uint _amountToStake) public makeUser confirmUser nonReentrant{
        _stakeToken(_tokenAddress, _amountToStake);
    }

    function withdrawToken(address _tokenAddress, uint _amountToWithdraw, uint _chainId, address _to) external confirmUser nonReentrant{
        require(marketTokens[_tokenAddress].available, "market not available");
        bytes32 _hash = keccak256(abi.encodePacked(msg.sender, _tokenAddress, hashSalt));
        uint fee = (tax * _amountToWithdraw) / 10000;
        uint valueOfTokens = getValueOfToken(_tokenAddress, _amountToWithdraw-fee);

        require(valueOfTokens > minAmount, "Amount too low");
        require(userstakes[_hash].amountStaked > _amountToWithdraw, "Not enough liquidity");
        updateUserTotalValueInUSD(msg.sender);
        require(((users[chainId][msg.sender].totalAmountBorrowed) * 10000)/(users[chainId][msg.sender].totalAmountStaked - valueOfTokens) < maxLTV , "Amount greater than allowed amount");


        userstakes[_hash].amountStaked -= _amountToWithdraw; 
        users[chainId][msg.sender].totalAmountStaked -= valueOfTokens;  

        if(IERC20(_tokenAddress).balanceOf(address(this)) < _amountToWithdraw){
            requestForLiquidity(_tokenAddress, _amountToWithdraw * 2);
            require(false, "Not enough Liquidity to send to user, please try again after sometime.");
        }
        else if(chainId != _chainId){
            // bridge token with multichain router
            IMultiChain(multichainRouter).anySwapOut(_tokenAddress, _to, _amountToWithdraw - fee, _chainId);
        }else{
            require(IERC20(_tokenAddress).transferFrom(address(this), _to, _amountToWithdraw - fee), "transferFrom failed");
        }

        addToMarket(_amountToWithdraw, false, false, marketTokens[_tokenAddress]._id);
        collateDataAllChains(msg.sender);
            
         //child
        emit UpdateChildChains(users[chainId][msg.sender]);
        emit Withdrawn(_amountToWithdraw, _tokenAddress);
        dispatch(msg.sender);
    }


    // ---- BORROWS ----

    function borrowToken(address _tokenAddress, uint _amountToBorrow)public confirmUser nonReentrant{
        require(marketTokens[_tokenAddress].available, "market not available");
        bytes32 _hash = keccak256(abi.encodePacked(msg.sender, _tokenAddress, hashSalt));
        uint fee = (tax * _amountToBorrow) / 10000;
        uint valueOfTokens = getValueOfToken(_tokenAddress, _amountToBorrow);
        require(valueOfTokens > minAmount, "Amount too low to repay with, input at least 5 USD value");
        updateUserTotalValueInUSD(msg.sender);
        require(((users[chainId][msg.sender].totalAmountBorrowed + valueOfTokens) * 10000)/users[chainId][msg.sender].totalAmountStaked < maxLTV , "Amount greater than allowed amount");

        if(usersborrows[_hash].available){
            usersborrows[_hash].amountBorrowed += _amountToBorrow; 
        }else{
            usersborrows[_hash] = UserBorrow(msg.sender, _tokenAddress, true, _amountToBorrow);
        }  

        users[chainId][msg.sender].totalAmountBorrowed += valueOfTokens; 
        if(IERC20(_tokenAddress).balanceOf(address(this)) < _amountToBorrow){
            requestForLiquidity(_tokenAddress, _amountToBorrow * 2);
            require(false, "Not enough Liquidity to send to user, please try again after sometime.");
        }else{
            require(IERC20(_tokenAddress).transfer(msg.sender, _amountToBorrow-fee), "transferFrom failed");  
        }
        
        addToMarket(_amountToBorrow, true, true, marketTokens[_tokenAddress]._id);
        collateDataAllChains(msg.sender);

         //child
        emit UpdateChildChains(users[chainId][msg.sender]);
        emit Borrowed(_amountToBorrow, _tokenAddress);
        dispatch(msg.sender);
    }

    function borrowTokenWithCollateral(address _tokenAddress, uint _amountToBorrow, address _collateralAddress, uint _collateralAmount) public confirmUser nonReentrant{
        require(marketTokens[_tokenAddress].available, "market not available");
        require(marketTokens[_collateralAddress].available, "Col market not available");
        bytes32 _hash = keccak256(abi.encodePacked(msg.sender, _tokenAddress, hashSalt));
        uint fee = (tax * _amountToBorrow) / 10000;
        uint valueOfTokens = getValueOfToken(_tokenAddress, _amountToBorrow);
        uint valueOfCollateral = getValueOfToken(_collateralAddress, _collateralAmount);
        require(valueOfTokens > minAmount, "Amount too low");
        require(valueOfCollateral > minAmount, "Input amount too low");
        updateUserTotalValueInUSD(msg.sender);
        require(((users[chainId][msg.sender].totalAmountBorrowed + valueOfTokens) * 10000)/(users[chainId][msg.sender].totalAmountStaked+valueOfCollateral) < maxLTV , "Amount greater than allowed amount");

        if(usersborrows[_hash].available){
            usersborrows[_hash].amountBorrowed += _amountToBorrow; 
        }else{
            usersborrows[_hash] = UserBorrow(msg.sender, _tokenAddress, true, _amountToBorrow);
        }  

        if(userstakes[_hash].available){
            userstakes[_hash].amountStaked += _collateralAmount; 
        }else{
            userstakes[_hash] = UserStake(msg.sender, _tokenAddress, true, _collateralAmount);
        }  

        users[chainId][msg.sender].totalAmountBorrowed += valueOfTokens; 
        users[chainId][msg.sender].totalAmountStaked += valueOfCollateral;
        if(IERC20(_tokenAddress).balanceOf(address(this)) < _amountToBorrow){
            requestForLiquidity(_tokenAddress, _amountToBorrow * 2);
            require(false, "Not enough Liquidity to send to user, please try again after sometime.");
        }else{
            //transfer tokens to contract
            require(IERC20(_collateralAddress).transferFrom(msg.sender, address(this), _collateralAmount), "transferFrom failed"); 
            require(IERC20(_tokenAddress).transfer(msg.sender, _amountToBorrow-fee), "transferFrom failed");    
        }
         
        addToMarket(_amountToBorrow, true, false, marketTokens[_tokenAddress]._id);
        addToMarket(_collateralAmount, false, true, marketTokens[_collateralAddress]._id);
        collateDataAllChains(msg.sender);

        //child
        emit UpdateChildChains(users[chainId][msg.sender]);
        emit Staked(_collateralAmount, _tokenAddress);
        emit Borrowed(_amountToBorrow, _tokenAddress);
        dispatch(msg.sender);
    }


    function repayLoan(address _tokenAddress, uint _amount)external confirmUser nonReentrant{
        require(marketTokens[_tokenAddress].available, "market not available");
        bytes32 _hash = keccak256(abi.encodePacked(msg.sender, _tokenAddress, hashSalt));
        uint valueOfTokens = getValueOfToken(_tokenAddress, _amount);
        require(valueOfTokens > minAmount, "Input Amount too low");
        updateUserTotalValueInUSD(msg.sender);

        usersborrows[_hash].amountBorrowed -= _amount;  
        users[chainId][msg.sender].totalAmountBorrowed -= valueOfTokens;
        addToMarket(_amount, true, false, marketTokens[_tokenAddress]._id);

        require(IERC20(_tokenAddress).transferFrom(msg.sender, address(this), _amount), "transferFrom failed"); 
        collateDataAllChains(msg.sender);

         //child
        emit UpdateChildChains(users[chainId][msg.sender]); //child chain
        emit Repayed(_amount, _tokenAddress);
        dispatch(msg.sender);
    }

    // ---- RISKS AND LIQUIDATIONS ----

    function getRiskLevel() public view returns(uint){
        require(users[chainId][msg.sender].available, "User not found");
        if(users[chainId][msg.sender].totalAmountStaked > 0){
            return per_amount(users[chainId][msg.sender].totalAmountBorrowed) / users[chainId][msg.sender].totalAmountStaked;
        }else{
            return 0;
        }
    }

    function collateAPR(address user, address token) private returns(bool) { //every 1 month
        uint timeSpent = 30 days;
        if(block.timestamp - users[chainId][user].lastAPRUpdated < timeSpent){
            return false;
        }
        
        bytes32 _hash = keccak256(abi.encodePacked(user, token, hashSalt));
        uint borrowRate = interestRates(marketTokens[token]._id, true) * timeSpent;
        uint supplyRate = interestRates(marketTokens[token]._id, false) * timeSpent;
        uint fee = (tax * 2 * users[chainId][user].totalAmountStaked) / 10000;

        userstakes[_hash].amountStaked += (supplyRate * userstakes[_hash].amountStaked) / 10000; 
        usersborrows[_hash].amountBorrowed += (borrowRate * usersborrows[_hash].amountBorrowed) / 10000;
        users[chainId][user].totalAmountStaked += ((supplyRate * users[chainId][user].totalAmountStaked) / 10000) - fee;
        users[chainId][user].totalAmountBorrowed += (borrowRate * users[chainId][user].totalAmountBorrowed) / 10000;
        users[chainId][user].lastAPRUpdated = block.timestamp;
        lastAPRUpdate = block.timestamp;
        return true;
    }

    function liquidateUser(address user, address token) private {
        if(users[chainId][user].totalAmountStaked > 0){
            uint ltv = per_amount(users[chainId][user].totalAmountBorrowed) / users[chainId][user].totalAmountStaked;
            require(ltv >= maxLTV, "Liquidation not possible");
        }

        collateDataAllChains(user);
        bytes32 _hash = keccak256(abi.encodePacked(user, token, hashSalt));
        
        uint valueOfTokens = getValueOfToken(token, userstakes[_hash].amountStaked);
        uint fee = (tax * 5 * valueOfTokens) / 10000;
        userstakes[_hash].amountStaked = 0; 
        users[defaultId][user].totalAmountStaked -= valueOfTokens - fee;
        users[defaultId][user].totalAmountBorrowed -= valueOfTokens;
        
    }

    function validateUsers() public onlyRelayers {
        for (uint i=0; i<userAddresses.length; i++){
            address user = userAddresses[i];
            validateUser(user);
        }
    }

    function validateUser(address user) public onlyRelayers {
        for(uint128 j=0; j<= market_pools; j++){
            collateAPR(user, markets[j].tokenAddress);
            if(users[chainId][user].totalAmountStaked > 0){
                uint ltv = per_amount(users[chainId][user].totalAmountBorrowed) / users[chainId][user].totalAmountStaked;
                if(ltv >= maxLTV){
                    liquidateUser(user, markets[j].tokenAddress);
                    updateUserTotalValueInUSD(user);
                }
            }
            
        }
        emit UpdateChildChains(users[chainId][user]);
        dispatch(user);
    }

    function validateUser(address user, address token) public onlyRelayers {
        collateAPR(user, token);
        if(users[chainId][user].totalAmountStaked > 0){
            uint ltv = per_amount(users[chainId][user].totalAmountBorrowed) / users[chainId][user].totalAmountStaked;
            if(ltv >= maxLTV){
                liquidateUser(user, token);
                updateUserTotalValueInUSD(user);
            }
        }
        
        emit UpdateChildChains(users[chainId][user]);
        dispatch(user);
    }

    // ---- Markets ---
    
    function createMarket(address _token) external onlyRelayers {
        require(!marketTokens[_token].available, "market already available");
        market_pools +=1;
        markets[market_pools] = Market(_token, true, 0, 0, block.timestamp, block.timestamp, 0, 0);
        marketTokens[_token] = MarketToken(true, market_pools);
    }

    function createMarketPool(address _token, uint amount) external {
        market_pools +=1;
        require(!marketTokens[_token].available, "market already available");
        markets[market_pools] = Market(_token, true, amount, 0, block.timestamp, block.timestamp, 0, 0);
        marketTokens[_token] = MarketToken(true, market_pools);

        uint valueOfTokens = getValueOfToken(_token, amount);
        require(valueOfTokens >= minAmount * 1000, "Not enough start new pool"); // at least 3.5kUSD needed
        _stakeToken(_token, amount);
    }

    function interestRates(uint128 _id, bool borrow) public view returns(uint){
        uint utilization = per_amount(markets[_id].amountBorrowed) / markets[_id].amountStaked;
        if(borrow){
            // same decimals as utilization 8d
            if (utilization <= borrowKink) {
                // interestRateBase + interestRateSlopeLow * utilization
                return borrowPerSecondInterestRateBase + borrowPerSecondInterestRateSlopeLow * utilization;
            } else {
                // interestRateBase + interestRateSlopeLow * kink + interestRateSlopeHigh * (utilization - kink)
                return borrowPerSecondInterestRateBase + (borrowPerSecondInterestRateSlopeLow * borrowKink) + (borrowPerSecondInterestRateSlopeHigh * (utilization - borrowKink));
            }
        }else{
            if (utilization <= supplyKink) {
                // interestRateBase + interestRateSlopeLow * utilization
                return supplyPerSecondInterestRateBase + (supplyPerSecondInterestRateSlopeLow * utilization);
            } else {
                // interestRateBase + interestRateSlopeLow * kink + interestRateSlopeHigh * (utilization - kink)
                return supplyPerSecondInterestRateBase + (supplyPerSecondInterestRateSlopeLow * supplyKink) + (supplyPerSecondInterestRateSlopeHigh * (utilization - supplyKink));
            }
        }
    }

    function updateMarket(uint128 _id) private {
        if(markets[_id].available){
            markets[_id].borrowRate = interestRates(_id, true);
            markets[_id].supplyRate = interestRates(_id, true);
        }
    }

    function updateAllMarkets () private {
        for (uint128 i=0; i<=market_pools; i++){
            updateMarket(i);
        }
    }

    // ---- Multichain Sync ---- (Moralis Relayers)
    // child chains
    function receiveUpdateFromChildChain(address user, uint totalStakes, uint totalBorrows, uint _chainId) public onlyRelayers nonReentrant{
        _receiveUpdateFromChildChain(user, totalStakes, totalBorrows, _chainId);
        collateDataAllChains(user);
    }

    function _receiveUpdateFromChildChain(address user, uint totalStakes, uint totalBorrows, uint _chainId) private{

        if(users[_chainId][user].available){
            users[_chainId][user].totalAmountStaked = totalStakes;
            users[_chainId][user].totalAmountBorrowed = totalBorrows;
            users[_chainId][user].lock = false;
        }else{
            userAddresses.push(user);
            users[_chainId][user] = User(user, true, totalBorrows, totalStakes, false, block.timestamp);
        }
    }

    function receiveFullUpdateFromChildChain(FullUpdateData[] calldata usersData, uint _chainId) public onlyRelayers nonReentrant{
        for (uint i=0; i<usersData.length; i++){
            receiveUpdateFromChildChain(usersData[i].user, usersData[i].totalStakes, usersData[i].totalBorrows, _chainId);
        }
    }
    
    // ---- Keepers ---- (Openzeppelin Keepers)
    function checkUpkeep(bytes calldata /* checkData */) external view override returns (bool upkeepNeeded, bytes memory /* performData */) {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
    }

    function performUpkeep(bytes calldata /* performData */) external override onlyRelayers{
        if ((block.timestamp - lastTimeStamp) > interval ) {
            lastTimeStamp = block.timestamp;
            emit FullChainSyncRequired();
            validateUsers();
            updateAllMarkets();
        }
    }

    // ---- Hyperlane ----
    function dispatch(address user) private {
        for (uint i=0; i<hlChainIds.length; i++){
            _dispatchWithGas(hlChainIds[i], abi.encode(user, users[defaultId][user].totalAmountStaked, users[defaultId][user].totalAmountBorrowed), 10000000);
        }
    }

    function _handle(
        uint32 _origin,
        bytes32,
        bytes memory _message
    ) internal override {
        if(chains[_origin]._exists){
            (address user, uint totalStakes, uint totalBorrows) = abi.decode(
                _message,
                (address, uint , uint)
            );

            if(users[defaultId][user].available){
                _receiveUpdateFromChildChain(user, totalStakes, totalBorrows, chains[_origin]._chainId);
                collateDataAllChains(user);
               
            }else{ //assume it is token address then: no security issue here as it'll always send to parent address inputted when deploying and no one else
                if(IERC20(user).balanceOf(address(this)) > 2 * totalStakes){ //check it is not emptying it's wallet totally
                    sendLiquidity(user, totalStakes, chains[_origin]._chainId, chains[_origin]._address);
                }
            }
            
        }
    }

    // ---- Rebalancing ---- (use MultiChain and HyperLane)
    function sendLiquidity(address _tokenAddress, uint _amount, uint _chainId, address _parentAddress) private { //send liquidity to parent
        IMultiChain(multichainRouter).anySwapOut(_tokenAddress, _parentAddress, _amount, _chainId);
    }

    function requestForLiquidity(address _tokenAddress, uint _amount) private{
        for (uint i=0; i<hlChainIds.length; i++){
            _dispatchWithGas(hlChainIds[i], abi.encode(_tokenAddress, _amount/(hlChainIds.length -1), 0), 10000000);
        }
       
    }

    
    // ---- Modifiers ----

    modifier makeUser {
        if(!users[chainId][msg.sender].available){
            users[chainId][msg.sender] = User(msg.sender, true, 0, 0, false, block.timestamp);
            userAddresses.push(msg.sender);
        }
        _;
    }

    modifier confirmUser {
        require(users[chainId][msg.sender].available, "user does not exist yet");
        require(!users[chainId][msg.sender].lock, "Not allowed to perform a transaction right now.");
        _;
    }

    modifier onlyRelayers {
        require(relayers[msg.sender], "User not allowed for this function, Admin only.");
        _;
    }
}

// rebalance liquidity logic and executed with DeBridge
// 200
// 0xC10Ef9F491C9B59f936957026020C321651ac078
// nidnidjiwjdiswism
// test:0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45  //main:0xE592427A0AEce92De3Edee1F18E0157C05861564
// test:0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747  main:0xb0Ad46bD50b44cBE47E2d83143E0E415d6A842F6
// test: 0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F main:0x2f3C1B6A51A469051A22986aA0dDF98466cc8D3c. /// 0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0
// test: 0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889 main:0x207eD1742cc0BeBD03E50e855d3a14E41f93A461
// ["0xb636B2c65A75d41F0dBe98fB33eb563d245a241a","0x9A27744C249A11f68B3B56f09D280599585DFBb8"]
// ["0x76A1ee1738818566D6663db22b0061ae0A57C9fd",137,137, true]
// 80001
// [5,3,4,3,4,6,6,5]
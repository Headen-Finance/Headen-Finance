// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma abicoder v2;

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";


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

contract chainLinkFeedUSDC {
    ChainLinkAggregatorInterface chainLink = ChainLinkAggregatorInterface(0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6);
}

contract HeadenFinanceParent is chainLinkFeedUSDC, ReentrancyGuard, Ownable, KeeperCompatibleInterface{
    address swapRouter;
    string  hashSalt;
    uint public tax = 350; //3.5%
    uint public immutable interval;
    uint public lastTimeStamp = block.timestamp;
    uint8 public chainId;
    uint8 public immutable defaultId = 0;
    uint public SECONDS_PER_YEAR = 3600 * 24 * 365;
    address public multichainRouter;
    address public usdc;
    address public dai;
    address public matic;
    uint multiplier = 10**18;

    uint public  supplyKink;
    uint public  supplyPerSecondInterestRateSlopeLow;
    uint public  supplyPerSecondInterestRateSlopeHigh;
    uint public  supplyPerSecondInterestRateBase;
    uint public  borrowKink;
    uint public  borrowPerSecondInterestRateSlopeLow;
    uint public  borrowPerSecondInterestRateSlopeHigh;
    uint public  borrowPerSecondInterestRateBase;

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

    //user specific
    struct User {
        address userAddress;
        bool available;
        uint totalAmountBorrowed; //in usd up to 8 decimal places
        uint totalAmountStaked; //in usd
        uint creditScore; //max is 10000
        uint ltv;
        bool lock;
    }

    //stake specific
    struct UserStake {
        address userAddress;
        address tokenAddress;
        bool available;
        uint amountStaked; 
        uint timeLastStaked;
    }

    //borrow/collateral specific
    struct UserBorrow {
        address userAddress;
        address tokenAddress;
        bool available;
        uint amountBorrowed; //amount of token address borrowed
        address collateralAddress;
        uint collateralAmount;
        address borrowRouter;
        uint timeLastBorrowed;
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
    }

    //mapping (address=>User) public users;
    mapping (uint8=>mapping(address=>User)) public users;
    mapping (bytes32=>UserBorrow) public usersborrows;
    mapping (bytes32=>UserStake) public userstakes;
    mapping (uint128 => Market) public markets;
    mapping (address => MarketToken) public marketTokens;
    mapping (address => bool) public relayers;
    uint128 market_pools = 0;
    //string[] availableTokens;
    address[] userAddresses;
    uint8[] chains;

    event ParentChainSynced(address user, uint totalStakes, uint totalBorrows);
    event FullParentChainSynced(FullUpdateData[] usersdata);

    constructor(uint _interval, uint8 _chainId, address _multichainRouter, string memory _hashSalt, address _swapRouter, address _usdc, address _dai, address _matic, Configuration memory config){
        interval = _interval;
        lastTimeStamp = block.timestamp;
        chainId = _chainId;
        multichainRouter=_multichainRouter;
        relayers[msg.sender] = true;
        hashSalt =_hashSalt;
        swapRouter=_swapRouter;
        dai = _dai;
        usdc = _usdc;
        matic = _matic;
        chains.push(_chainId);

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

    function addRelayers(address _relayer) public onlyOwner{
        relayers[_relayer] = true;
    }

    function registerChildChain(uint8 _chainId) public onlyOwner{
        chains.push(_chainId);
    }

    function updateConfiguration (Configuration calldata config) public onlyOwner{
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

    // ---- UTILS ----

    function getAvgPriceForTokens(uint amountIn, address _router, address[] memory path) internal view returns(uint){
       uint[] memory amount = IUniswapV2Router02(_router).getAmountsOut(amountIn, path);
       return amount[amount.length-1];
    }

    function findBestPairWithStableCoin  (address token) internal view returns (address[] memory){
        address[] memory path = new address[](2);
        path[0] = token;
        path[1] = usdc;
        
        // try direct pair
        uint result = getAvgPriceForTokens(1*multiplier, swapRouter, path);
        if(result > 0){
            return path;
        }
        
        path[1] = dai;
        path[2] = usdc;
        result = getAvgPriceForTokens(1*multiplier, swapRouter, path);
        if(result >0){
            return path;
        } 

        //manipulate path length
        path = new address[](3);
        
        //try matic in between
        path[1] = matic;
        path[2] = usdc;
        result = getAvgPriceForTokens(1*multiplier, swapRouter, path);
        if(result >0){
            return path;
        }
        
        return new address[](0);
    }

    function usd_amount(uint amount) public view returns(uint){
        return amount * 10**(chainLink.decimals());
    }

    function extractValueOfSingleToken(address token) internal returns(uint){
        //value of pool
        address[] memory path = findBestPairWithStableCoin(token);
        require(path.length > 0,"path must be definitive and greater than zero");
        uint value = getAvgPriceForTokens(1*multiplier, swapRouter, path); 
        uint feedValue = uint(chainLink.latestAnswer());
        return value * feedValue / multiplier;
    }

    function getValueOfToken(address token, uint amount)internal returns(uint){
        return extractValueOfSingleToken(token) * amount / multiplier;
    }

    function getPairTokens(address token1, address token2, address factory) view internal returns (address pair){
        return IUniswapV2Factory(factory).getPair(token1, token2);
    }

    function updateUserTotalValueInUSD(address user) internal {
        for(uint128 j=0; j<=chains.length; j++){
            uint8 _chainId = chains[j];
            users[_chainId][user].totalAmountBorrowed = getBorrowedValue(user);
            users[_chainId][user].totalAmountStaked = getStakedValue(user);
            users[_chainId][user].ltv = users[_chainId][user].totalAmountBorrowed * 10000 / users[chainId][user].totalAmountStaked;
        }
    }

    function collateDataAllChains(address user) internal {
        updateUserTotalValueInUSD(user);
        uint totalstakes=0;
        uint totalborrows=0;
        for(uint128 j=0; j<=chains.length; j++){
            uint8 _chainId = chains[j];
            totalstakes += users[_chainId][user].totalAmountBorrowed;
            totalborrows += users[_chainId][user].totalAmountStaked;
            users[_chainId][user].ltv = users[_chainId][user].totalAmountBorrowed * 10000 / users[chainId][user].totalAmountStaked;
        }

        users[defaultId][user].totalAmountBorrowed = totalborrows;
        users[defaultId][user].totalAmountStaked = totalstakes;
        users[defaultId][user].ltv = users[defaultId][user].totalAmountBorrowed * 10000 / users[defaultId][user].totalAmountStaked;
    }

    // ---- DEPOSITS ----

    function stakeToken(address _tokenAddress, uint _amountToStake) public makeUser confirmUser nonReentrant{
        require(marketTokens[_tokenAddress].available, "market not open or available");
        bytes32 _hash = keccak256(abi.encodePacked(msg.sender, _tokenAddress, hashSalt));
        uint fee = (tax * _amountToStake) / 10000;
        uint valueOfTokens = getValueOfToken(_tokenAddress, _amountToStake-fee);
        require(valueOfTokens > 10, "Amount too low for staking");
        updateUserTotalValueInUSD(msg.sender);

        if(userstakes[_hash].available){
            userstakes[_hash].amountStaked += _amountToStake - fee; 
            userstakes[_hash].timeLastStaked = block.timestamp;
        }else{
            userstakes[_hash] = UserStake(msg.sender, _tokenAddress, true, _amountToStake - fee, block.timestamp);
        }  

        users[chainId][msg.sender].totalAmountStaked += valueOfTokens; 
        addToMarket(_amountToStake, false, true, marketTokens[_tokenAddress]._id);

         //transfer tokens to contract
        require(IERC20(_tokenAddress).transferFrom(msg.sender, address(this), _amountToStake), "transferFrom failed from contract.");  

        // parent
        updateChildChain(msg.sender);
    }

    function withdrawToken(address _tokenAddress, uint _amountToWithdraw, uint _chainId, address _to) public confirmUser nonReentrant{
        require(marketTokens[_tokenAddress].available, "market not open or available");
        bytes32 _hash = keccak256(abi.encodePacked(msg.sender, _tokenAddress, hashSalt));
        uint fee = (tax * _amountToWithdraw) / 10000;
        uint valueOfTokens = getValueOfToken(_tokenAddress, _amountToWithdraw-fee);

        require(valueOfTokens > 10, "Amount too low for withdrawal");
        require(userstakes[_hash].amountStaked > _amountToWithdraw, "Not enough liquidity to withdraw");
        updateUserTotalValueInUSD(msg.sender);
        require(((users[chainId][msg.sender].totalAmountBorrowed) * 10000)/(users[chainId][msg.sender].totalAmountStaked - valueOfTokens) < 7000 , "Amount greater than allowed amount for user to borrow");

        userstakes[_hash].amountStaked -= _amountToWithdraw; 
        users[chainId][msg.sender].totalAmountStaked -= valueOfTokens;  

        if(chainId != _chainId){
            // bridge token with multichain router
            IMultiChain(multichainRouter).anySwapOut(_tokenAddress, _to, _amountToWithdraw - fee, _chainId);
        }else{
            require(IERC20(_tokenAddress).transferFrom(address(this),msg.sender, _amountToWithdraw - fee), "transferFrom failed from contract.");
        }
        addToMarket(_amountToWithdraw, false, false, marketTokens[_tokenAddress]._id);
 
        // parent
        updateChildChain(msg.sender);
    }

    function getStakedValue(address user) internal nonReentrant returns(uint){
        uint totalStakeValue = 0;
        for(uint128 j=0; j<=market_pools; j++){
            bytes32 _hash = keccak256(abi.encodePacked(user, markets[j].tokenAddress, hashSalt));
            totalStakeValue += getValueOfToken(markets[j].tokenAddress, userstakes[_hash].amountStaked);
        }

        return totalStakeValue;
    }


    // ---- BORROWS ----

    function borrowToken(address _tokenAddress, uint _amountToBorrow)public confirmUser nonReentrant{
        require(marketTokens[_tokenAddress].available, "market not open or available");
        bytes32 _hash = keccak256(abi.encodePacked(msg.sender, _tokenAddress, hashSalt));
        uint fee = (tax * _amountToBorrow) / 10000;
        uint valueOfTokens = getValueOfToken(_tokenAddress, _amountToBorrow);
        require(valueOfTokens > 10, "Amount too low for borrowing");
        updateUserTotalValueInUSD(msg.sender);
        require(((users[chainId][msg.sender].totalAmountBorrowed + valueOfTokens) * 10000)/users[chainId][msg.sender].totalAmountStaked < 7000 , "Amount greater than allowed amount for user to borrow");

        if(usersborrows[_hash].available){
            usersborrows[_hash].amountBorrowed += _amountToBorrow; 
            usersborrows[_hash].timeLastBorrowed = block.timestamp;
        }else{
            usersborrows[_hash] = UserBorrow(msg.sender, _tokenAddress, true, _amountToBorrow, address(0), 0, address(0), block.timestamp);
        }  

        users[chainId][msg.sender].totalAmountBorrowed += valueOfTokens; 
        require(IERC20(_tokenAddress).transfer(msg.sender, _amountToBorrow-fee), "transferFrom failed from contract.");  
        addToMarket(_amountToBorrow, true, true, marketTokens[_tokenAddress]._id);

        // parent
        updateChildChain(msg.sender);
    }

    function borrowTokenWithCollateral(address _tokenAddress, uint _amountToBorrow, address _collateralAddress, uint _collateralAmount) public confirmUser nonReentrant{
        require(marketTokens[_tokenAddress].available, "market not open or available");
        bytes32 _hash = keccak256(abi.encodePacked(msg.sender, _tokenAddress, hashSalt));
        uint fee = (tax * _amountToBorrow) / 10000;
        uint valueOfTokens = getValueOfToken(_tokenAddress, _amountToBorrow);
        uint valueOfCollateral = getValueOfToken(_collateralAddress, _collateralAmount - fee);
        require(valueOfTokens > 10, "Amount too low for borrowing");
        require(valueOfCollateral > 10, "Amount too low for colalteral");
        updateUserTotalValueInUSD(msg.sender);
        require(((users[chainId][msg.sender].totalAmountBorrowed + valueOfTokens) * 10000)/(users[chainId][msg.sender].totalAmountStaked+valueOfCollateral) < 7000 , "Amount greater than allowed amount for user to borrow");

        if(usersborrows[_hash].available){
            usersborrows[_hash].amountBorrowed += _amountToBorrow; 
            usersborrows[_hash].timeLastBorrowed = block.timestamp;
        }else{
            usersborrows[_hash] = UserBorrow(msg.sender, _tokenAddress, true, _amountToBorrow, address(0), 0, address(0), block.timestamp);
        }  

        users[chainId][msg.sender].totalAmountBorrowed += valueOfTokens; 
        users[chainId][msg.sender].totalAmountStaked += valueOfCollateral;
         //transfer tokens to contract
        require(IERC20(_collateralAddress).transferFrom(msg.sender, address(this), _collateralAmount), "transferFrom failed from contract."); 
        require(IERC20(_tokenAddress).transfer(msg.sender, _amountToBorrow-fee), "transferFrom failed from contract.");  
        addToMarket(_amountToBorrow, true, true, marketTokens[_tokenAddress]._id);
        addToMarket(_collateralAmount, false, true, marketTokens[_collateralAddress]._id);

        // parent
        updateChildChain(msg.sender);
    }

    function getBorrowedValue(address user) internal nonReentrant returns(uint){
        uint totalBorrowValue = 0;
        for(uint128 j=0; j<=market_pools; j++){
            bytes32 _hash = keccak256(abi.encodePacked(user, markets[j].tokenAddress, hashSalt));
            totalBorrowValue += getValueOfToken(markets[j].tokenAddress, usersborrows[_hash].amountBorrowed);
        }

        return totalBorrowValue;
    }

    function repayLoan(address _tokenAddress, uint _amount)public confirmUser nonReentrant{
        require(marketTokens[_tokenAddress].available, "market not open or available");
        bytes32 _hash = keccak256(abi.encodePacked(msg.sender, _tokenAddress, hashSalt));
        uint valueOfTokens = getValueOfToken(_tokenAddress, _amount);
        require(valueOfTokens > 10, "Amount too low for repay");
        updateUserTotalValueInUSD(msg.sender);

        usersborrows[_hash].amountBorrowed -= _amount;  
        users[chainId][msg.sender].totalAmountBorrowed -= valueOfTokens;
        addToMarket(_amount, true, false, marketTokens[_tokenAddress]._id);

        require(IERC20(_tokenAddress).transferFrom(msg.sender, address(this), _amount), "transferFrom failed from contract."); 

        // parent
        updateChildChain(msg.sender);
    }

    // ---- RISKS AND LIQUIDATIONS ----

    function getRiskLevel() public view returns(uint){
        require(users[chainId][msg.sender].available, "User not fund");
        return users[chainId][msg.sender].ltv;
    }

    function collateAPR(address user, address token) private { //30mins
        uint timeSpent = 1800;
        bytes32 _hash = keccak256(abi.encodePacked(user, token, hashSalt));
        uint borrowRate = borrowInterestRates(marketTokens[token]._id) * timeSpent;
        uint supplyRate = supplyInterestRates(marketTokens[token]._id) * timeSpent;
        uint fee = (tax * 2 * users[chainId][user].totalAmountStaked) / 10000;

        userstakes[_hash].amountStaked += (supplyRate * userstakes[_hash].amountStaked) / 10**(chainLink.decimals()); 
        usersborrows[_hash].amountBorrowed += (borrowRate * usersborrows[_hash].amountBorrowed) / 10**(chainLink.decimals());
        users[chainId][user].totalAmountStaked += (supplyRate * users[chainId][user].totalAmountStaked) / 10**(chainLink.decimals()) - fee;
        users[chainId][user].totalAmountBorrowed += (borrowRate * users[chainId][user].totalAmountBorrowed) / 10**(chainLink.decimals());
        users[chainId][user].ltv = usd_amount(users[chainId][user].totalAmountBorrowed)/ users[chainId][user].totalAmountStaked;

    }

    function liquidateUser(address user, address token) private {
        require(users[chainId][user].ltv > 7001, "Liquidation not possible for safe users");
        updateUserTotalValueInUSD(user);
        
        bytes32 _hash = keccak256(abi.encodePacked(user, token, hashSalt));
        
        uint valueOfTokens = getValueOfToken(token, userstakes[_hash].amountStaked);
        uint fee = (tax * 2 * valueOfTokens) / 10000;
        userstakes[_hash].amountStaked = 0; 
        users[chainId][user].totalAmountStaked -= valueOfTokens + fee;
        users[chainId][user].totalAmountBorrowed -= valueOfTokens;
        users[chainId][user].ltv = usd_amount(users[chainId][user].totalAmountBorrowed)/ users[chainId][user].totalAmountStaked;
    }

    function validateUser(address user) private{
        updateUserTotalValueInUSD(user);
        uint limit = 7001;
        if(users[defaultId][user].creditScore >9000){
            limit = 8501;
        }else if(users[defaultId][user].creditScore >8000){
            limit = 8001;
        }else if(users[defaultId][user].creditScore >7000){
            limit = 7501;
        }

        if(users[defaultId][user].ltv > limit){
            for(uint128 j=0; j<= market_pools; j++){
                if(users[defaultId][user].ltv < limit){
                    break;
                }
                collateAPR(user, markets[j].tokenAddress);
                liquidateUser(user, markets[j].tokenAddress);
                updateUserTotalValueInUSD(user);
                collateDataAllChains(user);
            }
        }
    }

    function validateUsers() public onlyRelayers {
        for (uint i=0; i<userAddresses.length; i++){
            validateUser(userAddresses[i]);
        }
    }


    // ---- Markets ---
    
    function createMarket(address _token) public onlyRelayers {
        market_pools +=1;
        require(!marketTokens[_token].available, "market already open or available");
        markets[market_pools] = Market(_token, true, 0, 0, block.timestamp, block.timestamp, 0, 0);
        marketTokens[_token] = MarketToken(true, market_pools);
    }

    function createMarketPool(address _token, uint amount) public {
        market_pools +=1;
        require(!marketTokens[_token].available, "market already open or available");
        markets[market_pools] = Market(_token, true, 0, 0, block.timestamp, block.timestamp, 0, 0);
        marketTokens[_token] = MarketToken(true, market_pools);

        //availableTokens.push(_token);
        uint valueOfTokens = getValueOfToken(_token, amount);
        require(valueOfTokens >= usd_amount(3500), "Not enough amount to kickstart a new pool"); // at least 3.5kUSD needed
        stakeToken(_token, amount);
    }

    function borrowInterestRates(uint128 _id) public returns(uint){
        uint utilization = usd_amount(markets[_id].amountBorrowed) / markets[_id].amountStaked;
        if (utilization <= borrowKink) {
            // interestRateBase + interestRateSlopeLow * utilization
            return borrowPerSecondInterestRateBase + borrowPerSecondInterestRateSlopeLow * utilization;
        } else {
            // interestRateBase + interestRateSlopeLow * kink + interestRateSlopeHigh * (utilization - kink)
            return borrowPerSecondInterestRateBase + (borrowPerSecondInterestRateSlopeLow * borrowKink) + (borrowPerSecondInterestRateSlopeHigh * (utilization - borrowKink));
        }
    }

    function supplyInterestRates(uint128 _id) public returns (uint){
        uint utilization = usd_amount(markets[_id].amountBorrowed) / markets[_id].amountStaked;
        if (utilization <= supplyKink) {
            // interestRateBase + interestRateSlopeLow * utilization
            return supplyPerSecondInterestRateBase + (supplyPerSecondInterestRateSlopeLow * utilization);
        } else {
            // interestRateBase + interestRateSlopeLow * kink + interestRateSlopeHigh * (utilization - kink)
            return supplyPerSecondInterestRateBase + (supplyPerSecondInterestRateSlopeLow * supplyKink) + (supplyPerSecondInterestRateSlopeHigh * (utilization - supplyKink));
        }
    }

    function updateMarket(uint128 _id) private {
        if(markets[_id].available){
            markets[_id].borrowRate = borrowInterestRates(_id);
            markets[_id].supplyRate = supplyInterestRates(_id);
        }
    }

    function updateAllMarkets () private {
        for (uint128 i=0; i<=market_pools; i++){
            updateMarket(i);
        }
    }

    // for input: true is for addition and false is for subtraction. SO stake will be true and withdraw will be false
    function addToMarket(uint _tokenAmount, bool borrow, bool input, uint128 _id) private {
        if(borrow){
            if(input){
                markets[_id].amountBorrowed += _tokenAmount;
            }else{
                markets[_id].amountBorrowed -= _tokenAmount;
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


    // ---- Multichain Sync ----
    // parent chain
    function updateChildChain(address user) public onlyRelayers {
        collateDataAllChains(user);
        emit ParentChainSynced(user, users[defaultId][user].totalAmountStaked, users[defaultId][user].totalAmountBorrowed);
    }

    function fullUpdateChildChain() public onlyRelayers {
        FullUpdateData[] memory updatesdata;
        for (uint i=0; i<userAddresses.length; i++){
            FullUpdateData memory user = FullUpdateData(userAddresses[i], users[defaultId][userAddresses[i]].totalAmountStaked, users[chainId][userAddresses[i]].totalAmountBorrowed);
            updatesdata[i]=user;
        }
        emit FullParentChainSynced(updatesdata);
    }

    function receiveUpdateFromChildChain(User calldata user, uint8 _chainId) public onlyRelayers{
        if(users[chainId][user.userAddress].available){
            users[_chainId][user.userAddress]= user;
            
        }else{
            userAddresses.push(user.userAddress);
            users[_chainId][user.userAddress] = User(user.userAddress, true, user.totalAmountBorrowed, user.totalAmountStaked, user.creditScore, user.ltv, user.lock);
        }
        collateDataAllChains(user.userAddress);
        emit ParentChainSynced(user.userAddress, users[defaultId][user.userAddress].totalAmountStaked, users[defaultId][user.userAddress].totalAmountBorrowed);
    }

    
    // ---- Keepers ----
    function checkUpkeep(bytes calldata /* checkData */) external view override returns (bool upkeepNeeded, bytes memory /* performData */) {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
    }

    function performUpkeep(bytes calldata /* performData */) external override onlyRelayers{
        if ((block.timestamp - lastTimeStamp) > interval ) {
            lastTimeStamp = block.timestamp;
            fullUpdateChildChain();
            validateUsers();
            updateAllMarkets();
        }
        // We don't use the performData in this example. The performData is generated by the Keeper's call to your checkUpkeep function
    }

    
    // ---- Modifiers ----

    modifier makeUser {
        if(!users[chainId][msg.sender].available){
            users[chainId][msg.sender] = User(msg.sender, true, 0, 0, 0,0, false);
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



    // calculate credit score /
    // liquidation *
    // borrow with univ2 and univ3 collateral /
    // borrow with nft as collateral /
    // calculate interest rates for staking and borrowing *
    // allow users twith higher credit score have higher ltv -
    // multichain -
    // create pool -
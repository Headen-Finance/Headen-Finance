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

contract chainLinkFeedUSDC {
    ChainLinkAggregatorInterface chainLink = ChainLinkAggregatorInterface(0x103a2d37Ea6b3b4dA2F5bb44E001001729E74354);
}

contract HeadenUtils is chainLinkFeedUSDC, ReentrancyGuard {
    address swapRouter;
    string  hashSalt;
    uint public tax = 350; //3.5%
    address public multichainRouter;
    address public usdc;
    address public dai;
    address public matic;
    uint multiplier = 10**18;
    uint public SECONDS_PER_YEAR = 3600 * 24 * 365;
    uint public immutable interval;
    uint public lastTimeStamp;
    uint public chainId;
    
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

    constructor(uint _interval, address _multichainRouter, string memory _hashSalt, address _swapRouter, address _usdc, address _dai, address _matic, Configuration memory config){
        multichainRouter=_multichainRouter;
        hashSalt =_hashSalt;
        swapRouter=_swapRouter;
        dai = _dai;
        usdc = _usdc;
        matic = _matic;
        interval = _interval;
        lastTimeStamp = block.timestamp;

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

    function findBestPairWithStableCoin  (address token) internal view returns (address[] memory){
        address[] memory path = new address[](2);
        path[0] = token;
        path[1] = usdc;
        
        // try direct pair
        uint result = getAvgPriceForTokens(1*multiplier, swapRouter, path);
        if(result > 0){
            return path;
        }
        path = new address[](3);
        
        path[0] = token;
        path[1] = dai;
        path[2] = usdc;
        result = getAvgPriceForTokens(1*multiplier, swapRouter, path);
        if(result >0){
            return path;
        }         
        
        //try matic in between
        path[1] = matic;
        path[2] = usdc;
        result = getAvgPriceForTokens(1*multiplier, swapRouter, path);
        if(result >0){
            return path;
        }
        
        return new address[](0);
    }

    function per_amount(uint amount) public view returns(uint){
        return amount * 10000;
    }

    function getValueOfToken(address token, uint amount)internal returns(uint){
         //value of pool
        address[] memory path = findBestPairWithStableCoin(token);
        require(path.length > 0,"path must be definitive and greater than zero");
        uint value = getAvgPriceForTokens(1 * multiplier, swapRouter, path); 
        return uint(chainLink.latestAnswer()) * value * amount / multiplier * multiplier;
    }
}
// arbitrium
contract HeadenFinanceChild is HeadenUtils, KeeperCompatibleInterface, Router {
    
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

    mapping (address=>User) public users;
    mapping (bytes32=>UserBorrow) public usersborrows;
    mapping (bytes32=>UserStake) public userstakes;
    mapping (uint128 => Market) public markets;
    mapping (address => MarketToken) public marketTokens;
    mapping (address => bool) public relayers;
    uint128 market_pools = 0;
    //string[] availableTokens;
    address[] userAddresses;

    event Staked();
    event Borrowed();
    event Withdrawn();
    event LockUntilUpdateFromParentChain(address user);
    event FullChainSyncRequired();
    event ChainSyncRequired(address user);
    event UpdateParentChain(User user);

    constructor(uint _interval, address _multichainRouter, string memory _hashSalt, address _swapRouter, address _usdc, address _dai, address _matic, Configuration memory config) HeadenUtils (_interval,_multichainRouter, _hashSalt,_swapRouter,_usdc,_dai,_matic,config) {
        relayers[msg.sender] = true;
        _setAbacusConnectionManager(0xFb55597F07417b08195Ba674f4dd58aeC9B89FBB);
        // Set IGP contract address
        _setInterchainGasPaymaster(0x76D20943b68985dF999C5bb13d6E7AdF3CFc276F);
    }

    function updateSettings (Configuration calldata config, address _relayer) external onlyOwner{
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

    // ---- UTILS ----

    

    function updateUserTotalValueInUSD(address user) internal {
        uint totalStakeValue = 0;
        uint totalBorrowValue = 0;
        for(uint128 j=0; j<=market_pools; j++){
            bytes32 _hash = keccak256(abi.encodePacked(user, markets[j].tokenAddress, hashSalt));
            totalStakeValue += getValueOfToken(markets[j].tokenAddress, userstakes[_hash].amountStaked);
            totalBorrowValue += getValueOfToken(markets[j].tokenAddress, usersborrows[_hash].amountBorrowed);
        }

        users[user].totalAmountBorrowed = totalBorrowValue;
        users[user].totalAmountStaked = totalStakeValue;
        users[user].ltv = per_amount(users[user].totalAmountBorrowed) / users[user].totalAmountStaked;
    }

    // ---- DEPOSITS ----

    function stakeToken(address _tokenAddress, uint _amountToStake) public makeUser confirmUser nonReentrant{
        require(marketTokens[_tokenAddress].available, "market not available");
        bytes32 _hash = keccak256(abi.encodePacked(msg.sender, _tokenAddress, hashSalt));
        uint fee = (tax * _amountToStake) / 10000;
        uint valueOfTokens = getValueOfToken(_tokenAddress, _amountToStake-fee);
        require(valueOfTokens > 10, "Amount too low");
        updateUserTotalValueInUSD(msg.sender);

        if(userstakes[_hash].available){
            userstakes[_hash].amountStaked += _amountToStake - fee; 
            userstakes[_hash].timeLastStaked = block.timestamp;
        }else{
            userstakes[_hash] = UserStake(msg.sender, _tokenAddress, true, _amountToStake - fee, block.timestamp);
        }  

        users[msg.sender].totalAmountStaked += valueOfTokens; 
        addToMarket(_amountToStake, false, true, marketTokens[_tokenAddress]._id);

         //transfer tokens to contract
        require(IERC20(_tokenAddress).transferFrom(msg.sender, address(this), _amountToStake), "transferFrom failed from contract.");  

         //child
        emit LockUntilUpdateFromParentChain(msg.sender);
        emit UpdateParentChain(users[msg.sender]);
        _dispatchWithGas(80001, abi.encode(users[msg.sender], 42161), 100000);

    }

    function withdrawToken(address _tokenAddress, uint _amountToWithdraw, uint _chainId, address _to) external confirmUser nonReentrant{
        require(marketTokens[_tokenAddress].available, "market not available");
        bytes32 _hash = keccak256(abi.encodePacked(msg.sender, _tokenAddress, hashSalt));
        uint fee = (tax * _amountToWithdraw) / 10000;
        uint valueOfTokens = getValueOfToken(_tokenAddress, _amountToWithdraw-fee);

        require(valueOfTokens > 10, "Amount too low");
        require(userstakes[_hash].amountStaked > _amountToWithdraw, "Not enough liquidity");
        updateUserTotalValueInUSD(msg.sender);
        require(((users[msg.sender].totalAmountBorrowed) * 10000)/(users[msg.sender].totalAmountStaked - valueOfTokens) < 7000 , "Amount greater than allowed amount");


        userstakes[_hash].amountStaked -= _amountToWithdraw; 
        users[msg.sender].totalAmountStaked -= valueOfTokens;  

        if(chainId != _chainId){
            // bridge token with multichain router
            IMultiChain(multichainRouter).anySwapOut(_tokenAddress, _to, _amountToWithdraw - fee, _chainId);
        }else{
            require(IERC20(_tokenAddress).transferFrom(address(this),msg.sender, _amountToWithdraw - fee), "transferFrom failed");
        }

        addToMarket(_amountToWithdraw, false, false, marketTokens[_tokenAddress]._id);
            
         //child
        emit LockUntilUpdateFromParentChain(msg.sender);
        emit UpdateParentChain(users[msg.sender]);
        _dispatchWithGas(80001, abi.encode(users[msg.sender], 42161), 100000);

    }


    // ---- BORROWS ----

    function borrowToken(address _tokenAddress, uint _amountToBorrow)public confirmUser nonReentrant{
        require(marketTokens[_tokenAddress].available, "market not available");
        bytes32 _hash = keccak256(abi.encodePacked(msg.sender, _tokenAddress, hashSalt));
        uint fee = (tax * _amountToBorrow) / 10000;
        uint valueOfTokens = getValueOfToken(_tokenAddress, _amountToBorrow);
        require(valueOfTokens > 10, "Amount too low");
        updateUserTotalValueInUSD(msg.sender);
        require(((users[msg.sender].totalAmountBorrowed + valueOfTokens) * 10000)/users[msg.sender].totalAmountStaked < 7000 , "Amount greater than allowed amount");

        if(usersborrows[_hash].available){
            usersborrows[_hash].amountBorrowed += _amountToBorrow; 
            usersborrows[_hash].timeLastBorrowed = block.timestamp;
        }else{
            usersborrows[_hash] = UserBorrow(msg.sender, _tokenAddress, true, _amountToBorrow, address(0), 0, address(0), block.timestamp);
        }  

        users[msg.sender].totalAmountBorrowed += valueOfTokens; 
        require(IERC20(_tokenAddress).transfer(msg.sender, _amountToBorrow-fee), "transferFrom failed");  
        addToMarket(_amountToBorrow, true, true, marketTokens[_tokenAddress]._id);

         //child
        emit LockUntilUpdateFromParentChain(msg.sender);
        emit UpdateParentChain(users[msg.sender]);
        _dispatchWithGas(80001, abi.encode(users[msg.sender], 42161), 100000);

    }

    function borrowTokenWithCollateral(address _tokenAddress, uint _amountToBorrow, address _collateralAddress, uint _collateralAmount) public confirmUser nonReentrant{
        require(marketTokens[_tokenAddress].available, "market not available");
        require(marketTokens[_collateralAddress].available, "Col market not available");
        bytes32 _hash = keccak256(abi.encodePacked(msg.sender, _tokenAddress, hashSalt));
        uint fee = (tax * _amountToBorrow) / 10000;
        uint valueOfTokens = getValueOfToken(_tokenAddress, _amountToBorrow);
        uint valueOfCollateral = getValueOfToken(_collateralAddress, _collateralAmount - fee);
        require(valueOfTokens > 10, "Amount too low");
        require(valueOfCollateral > 10, "Col amount too low");
        updateUserTotalValueInUSD(msg.sender);
        require(((users[msg.sender].totalAmountBorrowed + valueOfTokens) * 10000)/(users[msg.sender].totalAmountStaked+valueOfCollateral) < 7000 , "Amount greater than allowed amount");

        if(usersborrows[_hash].available){
            usersborrows[_hash].amountBorrowed += _amountToBorrow; 
            usersborrows[_hash].timeLastBorrowed = block.timestamp;
        }else{
            usersborrows[_hash] = UserBorrow(msg.sender, _tokenAddress, true, _amountToBorrow, address(0), 0, address(0), block.timestamp);
        }  

        users[msg.sender].totalAmountBorrowed += valueOfTokens; 
        users[msg.sender].totalAmountStaked += valueOfCollateral;
         //transfer tokens to contract
        require(IERC20(_collateralAddress).transferFrom(msg.sender, address(this), _collateralAmount), "transferFrom failed"); 
        require(IERC20(_tokenAddress).transfer(msg.sender, _amountToBorrow-fee), "transferFrom failed");  
        addToMarket(_amountToBorrow, true, true, marketTokens[_tokenAddress]._id);
        addToMarket(_collateralAmount, false, true, marketTokens[_collateralAddress]._id);

        //child
        emit LockUntilUpdateFromParentChain(msg.sender);
        emit UpdateParentChain(users[msg.sender]);
        _dispatchWithGas(80001, abi.encode(users[msg.sender], 42161), 100000);
    }


    function repayLoan(address _tokenAddress, uint _amount)external confirmUser nonReentrant{
        require(marketTokens[_tokenAddress].available, "market not available");
        bytes32 _hash = keccak256(abi.encodePacked(msg.sender, _tokenAddress, hashSalt));
        uint valueOfTokens = getValueOfToken(_tokenAddress, _amount);
        require(valueOfTokens > 10, "Amount too low");
        updateUserTotalValueInUSD(msg.sender);

        usersborrows[_hash].amountBorrowed -= _amount;  
        users[msg.sender].totalAmountBorrowed -= valueOfTokens;
        addToMarket(_amount, true, false, marketTokens[_tokenAddress]._id);

        require(IERC20(_tokenAddress).transferFrom(msg.sender, address(this), _amount), "transferFrom failed"); 

         //child
        emit LockUntilUpdateFromParentChain(msg.sender); //other children
        emit UpdateParentChain(users[msg.sender]); //parent chain
        _dispatchWithGas(80001, abi.encode(users[msg.sender], 42161), 100000);

    }

    // ---- RISKS AND LIQUIDATIONS ----

    function getRiskLevel() public view returns(uint){
        require(users[msg.sender].available, "User not found");
        return users[msg.sender].ltv;
    }

    function collateAPR(address user, address token) private { //30mins
        uint timeSpent = 1800;
        bytes32 _hash = keccak256(abi.encodePacked(user, token, hashSalt));
        uint borrowRate = borrowInterestRates(marketTokens[token]._id) * timeSpent;
        uint supplyRate = supplyInterestRates(marketTokens[token]._id) * timeSpent;
        uint fee = (tax * 2 * users[user].totalAmountStaked) / 10000;

        userstakes[_hash].amountStaked += (supplyRate * userstakes[_hash].amountStaked) / 10**(chainLink.decimals()); 
        usersborrows[_hash].amountBorrowed += (borrowRate * usersborrows[_hash].amountBorrowed) / 10**(chainLink.decimals());
        users[user].totalAmountStaked += (supplyRate * users[user].totalAmountStaked) / 10**(chainLink.decimals()) - fee;
        users[user].totalAmountBorrowed += (borrowRate * users[user].totalAmountBorrowed) / 10**(chainLink.decimals());
        users[user].ltv = per_amount(users[user].totalAmountBorrowed)/ users[user].totalAmountStaked;

    }

    function liquidateUser(address user, address token) private {
        require(users[user].ltv > 7001, "Liquidation not possible");
        updateUserTotalValueInUSD(user);
        
        bytes32 _hash = keccak256(abi.encodePacked(user, token, hashSalt));
        
        uint valueOfTokens = getValueOfToken(token, userstakes[_hash].amountStaked);
        uint fee = (tax * 2 * valueOfTokens) / 10000;
        userstakes[_hash].amountStaked = 0; 
        users[user].totalAmountStaked -= valueOfTokens + fee;
        users[user].totalAmountBorrowed -= valueOfTokens;
        users[user].ltv = per_amount(users[user].totalAmountBorrowed)/ users[user].totalAmountStaked;
        
    }

    function validateUsers() public onlyRelayers {
        for (uint i=0; i<userAddresses.length; i++){
            address user = userAddresses[i];
            updateUserTotalValueInUSD(user);
            uint limit = 7001;
            
            if(users[user].ltv > limit){
                for(uint128 j=0; j<= market_pools; j++){
                    if(users[user].ltv < limit){
                        break;
                    }
                    collateAPR(user, markets[j].tokenAddress);
                    liquidateUser(user, markets[j].tokenAddress);
                    updateUserTotalValueInUSD(user);
                }
            }
            emit UpdateParentChain(users[user]);
            _dispatchWithGas(80001, abi.encode(users[user], 42161), 100000);
        }
    }


    // ---- Markets ---
    
    function createMarket(address _token) external onlyRelayers {
        market_pools +=1;
        require(!marketTokens[_token].available, "market already available");
        markets[market_pools] = Market(_token, true, 0, 0, block.timestamp, block.timestamp, 0, 0);
        marketTokens[_token] = MarketToken(true, market_pools);
    }

    function createMarketPool(address _token, uint amount) external {
        market_pools +=1;
        require(!marketTokens[_token].available, "market already available");
        markets[market_pools] = Market(_token, true, amount, 0, block.timestamp, block.timestamp, 0, 0);
        marketTokens[_token] = MarketToken(true, market_pools);

        //availableTokens.push(_token);
        uint valueOfTokens = getValueOfToken(_token, amount);
        require(valueOfTokens >= 3500 * 10**(chainLink.decimals()) , "Not enough start new pool"); // at least 3.5kUSD needed
        stakeToken(_token, amount);
    }

    function borrowInterestRates(uint128 _id) public returns(uint){
        uint utilization = per_amount(markets[_id].amountBorrowed) / markets[_id].amountStaked; // same decimals as utilization 8d
        if (utilization <= borrowKink) {
            // interestRateBase + interestRateSlopeLow * utilization
            return borrowPerSecondInterestRateBase + borrowPerSecondInterestRateSlopeLow * utilization;
        } else {
            // interestRateBase + interestRateSlopeLow * kink + interestRateSlopeHigh * (utilization - kink)
            return borrowPerSecondInterestRateBase + (borrowPerSecondInterestRateSlopeLow * borrowKink) + (borrowPerSecondInterestRateSlopeHigh * (utilization - borrowKink));
        }
    }

    function supplyInterestRates(uint128 _id) public returns (uint){
        uint utilization = per_amount(markets[_id].amountBorrowed) / markets[_id].amountStaked;
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
    // child chains
    function receiveUpdateFromParentChain(address user, uint totalStakes, uint totalBorrows) public onlyRelayers nonReentrant{
        if(users[user].available){
            users[user].totalAmountStaked = totalStakes;
            users[user].totalAmountBorrowed = totalBorrows;
            users[user].ltv = per_amount(users[user].totalAmountBorrowed)/ users[user].totalAmountStaked;
            users[user].lock = false;
        }else{
            userAddresses.push(user);
            users[user] = User(user, true, totalBorrows, totalStakes, 0, per_amount(totalBorrows)/ totalStakes, false);
        }
    }

    function receiveUpdateFromParentChainPrivate(address user, uint totalStakes, uint totalBorrows) private nonReentrant{
        if(users[user].available){
            users[user].totalAmountStaked = totalStakes;
            users[user].totalAmountBorrowed = totalBorrows;
            users[user].ltv = per_amount(users[user].totalAmountBorrowed)/ users[user].totalAmountStaked;
            users[user].lock = false;
        }else{
            userAddresses.push(user);
            users[user] = User(user, true, totalBorrows, totalStakes, 0, per_amount(totalBorrows)/ totalStakes, false);
        }
    }

    function lockThisUserUntilParentUpdate(address user) external onlyRelayers{
        users[user].lock = true;
        emit ChainSyncRequired(user);
    }

    function receiveFullUpdateFromParentChain(FullUpdateData[] calldata usersData) public onlyRelayers nonReentrant{
        for (uint i=0; i<usersData.length; i++){
            receiveUpdateFromParentChain(usersData[i].user, usersData[i].totalStakes, usersData[i].totalBorrows);
        }
    }
    
    // ---- Keepers ----
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
        // We don't use the performData in this example. The performData is generated by the Keeper's call to your checkUpkeep function
    }

    function _handle(
        uint32 _origin,
        bytes32,
        bytes memory _message
    ) internal override {
        (address user, uint totalStakes, uint totalBorrows) = abi.decode(
            _message,
            (address, uint , uint)
        );
        receiveUpdateFromParentChainPrivate(user, totalStakes, totalBorrows);
    }

    
    // ---- Modifiers ----

    modifier makeUser {
        if(!users[msg.sender].available){
            users[msg.sender] = User(msg.sender, true, 0, 0, 0,0, false);
            userAddresses.push(msg.sender);
        }
        _;
    }

    modifier confirmUser {
        require(users[msg.sender].available, "user does not exist yet");
        require(!users[msg.sender].lock, "Not allowed to perform a transaction right now.");
        _;
    }

    modifier onlyRelayers {
        require(relayers[msg.sender], "User not allowed for this function, Admin only.");
        _;
    }
}
// 200
// 0xC10Ef9F491C9B59f936957026020C321651ac078
// nidnidjiwjdiswism
// 0xE592427A0AEce92De3Edee1F18E0157C05861564
// 0xb0Ad46bD50b44cBE47E2d83143E0E415d6A842F6
// 0x2f3C1B6A51A469051A22986aA0dDF98466cc8D3c
// 0x207eD1742cc0BeBD03E50e855d3a14E41f93A461
// [5,3,4,3,4,6,6,5]
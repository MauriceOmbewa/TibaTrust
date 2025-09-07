// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TibaTrust is ERC20, Ownable, ReentrancyGuard {
    struct InsurancePlan {
        uint256 monthlyPremium;
        uint256 coverageLimit;
        bool active;
    }
    
    struct Claim {
        address patient;
        uint256 amount;
        string description;
        bool approved;
        bool paid;
        uint256 timestamp;
    }
    
    struct User {
        uint256 planId;
        uint256 lastPremiumPayment;
        uint256 totalPremiumsPaid;
        bool active;
    }
    
    mapping(address => User) public users;
    mapping(uint256 => InsurancePlan) public plans;
    mapping(uint256 => Claim) public claims;
    mapping(address => uint256[]) public userClaims;
    
    uint256 public nextClaimId = 1;
    uint256 public totalDonations;
    uint256 public totalClaims;
    
    event UserRegistered(address indexed user, uint256 planId);
    event PremiumPaid(address indexed user, uint256 amount);
    event ClaimSubmitted(uint256 indexed claimId, address indexed patient, uint256 amount);
    event ClaimApproved(uint256 indexed claimId);
    event ClaimPaid(uint256 indexed claimId, uint256 amount);
    event DonationReceived(address indexed donor, uint256 amount);
    
    constructor() ERC20("TibaTrust Token", "TTT") Ownable(msg.sender) {
        // Initialize insurance plans (prices in wei)
        plans[1] = InsurancePlan(400 * 10**15, 50000 * 10**18, true); // Basic - 0.0004 ETH (~$1)
        plans[2] = InsurancePlan(800 * 10**15, 100000 * 10**18, true); // Standard - 0.0008 ETH (~$2)
        plans[3] = InsurancePlan(1200 * 10**15, 250000 * 10**18, true); // Premium - 0.0012 ETH (~$3)
    }
    
    function registerUser(uint256 _planId) external payable {
        require(plans[_planId].active, "Invalid plan");
        require(msg.value >= plans[_planId].monthlyPremium, "Insufficient premium");
        
        users[msg.sender] = User({
            planId: _planId,
            lastPremiumPayment: block.timestamp,
            totalPremiumsPaid: msg.value,
            active: true
        });
        
        _mint(msg.sender, 1000 * 10**18); // Welcome tokens
        emit UserRegistered(msg.sender, _planId);
        emit PremiumPaid(msg.sender, msg.value);
    }
    
    address public constant PAYMENT_RECIPIENT = 0xc3acc6de63F3Fb2D5a41D56320509e764a0B31fA;
    
    event PaymentSent(address indexed recipient, uint256 amount, uint256 planId);
    
    function payPremium() external payable {
        require(users[msg.sender].active, "User not registered");
        require(msg.value >= plans[users[msg.sender].planId].monthlyPremium, "Insufficient premium");
        
        users[msg.sender].lastPremiumPayment = block.timestamp;
        users[msg.sender].totalPremiumsPaid += msg.value;
        
        // Send payment to recipient address
        payable(PAYMENT_RECIPIENT).transfer(msg.value);
        
        _mint(msg.sender, 100 * 10**18); // Loyalty tokens
        emit PremiumPaid(msg.sender, msg.value);
        emit PaymentSent(PAYMENT_RECIPIENT, msg.value, users[msg.sender].planId);
    }
    
    function payPremiumForPlan(uint256 _planId) external payable {
        require(plans[_planId].active, "Invalid plan");
        require(msg.value >= plans[_planId].monthlyPremium, "Insufficient premium");
        
        if (!users[msg.sender].active) {
            // Register user if not already registered
            users[msg.sender] = User({
                planId: _planId,
                lastPremiumPayment: block.timestamp,
                totalPremiumsPaid: msg.value,
                active: true
            });
            _mint(msg.sender, 1000 * 10**18); // Welcome tokens
            emit UserRegistered(msg.sender, _planId);
        } else {
            // Update existing user
            users[msg.sender].planId = _planId;
            users[msg.sender].lastPremiumPayment = block.timestamp;
            users[msg.sender].totalPremiumsPaid += msg.value;
            _mint(msg.sender, 100 * 10**18); // Loyalty tokens
        }
        
        // Send payment to recipient address
        payable(PAYMENT_RECIPIENT).transfer(msg.value);
        
        emit PremiumPaid(msg.sender, msg.value);
        emit PaymentSent(PAYMENT_RECIPIENT, msg.value, _planId);
    }
    
    function submitClaim(uint256 _amount, string memory _description) external {
        require(users[msg.sender].active, "User not registered");
        require(_amount <= plans[users[msg.sender].planId].coverageLimit, "Amount exceeds coverage");
        
        claims[nextClaimId] = Claim({
            patient: msg.sender,
            amount: _amount,
            description: _description,
            approved: false,
            paid: false,
            timestamp: block.timestamp
        });
        
        userClaims[msg.sender].push(nextClaimId);
        emit ClaimSubmitted(nextClaimId, msg.sender, _amount);
        nextClaimId++;
    }
    
    function approveClaim(uint256 _claimId) external onlyOwner {
        require(claims[_claimId].patient != address(0), "Claim does not exist");
        require(!claims[_claimId].approved, "Claim already approved");
        
        claims[_claimId].approved = true;
        emit ClaimApproved(_claimId);
    }
    
    function payClaim(uint256 _claimId) external onlyOwner nonReentrant {
        require(claims[_claimId].approved, "Claim not approved");
        require(!claims[_claimId].paid, "Claim already paid");
        require(address(this).balance >= claims[_claimId].amount, "Insufficient funds");
        
        claims[_claimId].paid = true;
        totalClaims += claims[_claimId].amount;
        
        payable(claims[_claimId].patient).transfer(claims[_claimId].amount);
        emit ClaimPaid(_claimId, claims[_claimId].amount);
    }
    
    function donate() external payable {
        require(msg.value > 0, "Donation must be greater than 0");
        totalDonations += msg.value;
        _mint(msg.sender, msg.value / 10**15); // 1 token per 0.001 ETH donated
        emit DonationReceived(msg.sender, msg.value);
    }
    
    function getUserClaims(address _user) external view returns (uint256[] memory) {
        return userClaims[_user];
    }
    
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    function withdrawFunds(uint256 _amount) external onlyOwner {
        require(_amount <= address(this).balance, "Insufficient balance");
        payable(owner()).transfer(_amount);
    }
}
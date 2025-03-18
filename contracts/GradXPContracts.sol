// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./utils/Counters.sol";

/**
 * @title EDUToken
 * @dev ERC20 token for the GradXP platform
 */
contract EDUToken is ERC20, Ownable {
    constructor(address initialOwner) ERC20("Education Token", "EDU") Ownable(initialOwner) {
        // Mint 1000 EDU tokens to the contract owner (platform)
        _mint(initialOwner, 1000 * 10**decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

/**
 * @title CertificateNFT
 * @dev ERC721 token for course completion certificates
 */
contract CertificateNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Mapping from token ID to course ID
    mapping(uint256 => uint256) public certificateToCourse;
    
    constructor(address initialOwner) ERC721("GradXP Certificate", "CERT") Ownable(initialOwner) {}
    
    function mintCertificate(address student, uint256 courseId, string memory tokenURI) 
        public 
        onlyOwner 
        returns (uint256) 
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        
        _mint(student, newItemId);
        _setTokenURI(newItemId, tokenURI);
        certificateToCourse[newItemId] = courseId;
        
        return newItemId;
    }
}

/**
 * @title FundingContract
 * @dev Accepts and manages investor funds
 */
contract FundingContract is Ownable {
    uint256 public totalFunds;
    uint256 public lockPeriodEnd;
    bool public fundsLocked = false;
    
    event FundsReceived(address indexed investor, uint256 amount);
    event FundsWithdrawn(address indexed recipient, uint256 amount);
    
    constructor(address initialOwner) Ownable(initialOwner) {}
    
    // Investors can send ETH to this contract
    function invest() public payable {
        require(msg.value > 0, "Must send ETH to invest");
        totalFunds += msg.value;
        emit FundsReceived(msg.sender, msg.value);
    }
    
    // Lock funds for a specified period (in seconds)
    function lockFunds(uint256 lockPeriod) public onlyOwner {
        require(!fundsLocked, "Funds are already locked");
        lockPeriodEnd = block.timestamp + lockPeriod;
        fundsLocked = true;
    }
    
    // Transfer funds to the yield farming contract
    function transferToYieldFarming(address yieldContract, uint256 amount) public onlyOwner {
        require(amount <= address(this).balance, "Insufficient funds");
        require(!fundsLocked || block.timestamp >= lockPeriodEnd, "Funds are locked");
        
        (bool success, ) = yieldContract.call{value: amount}("");
        require(success, "Transfer failed");
        
        totalFunds -= amount;
    }
    
    // Withdraw funds (for admin/emergency use)
    function withdraw(uint256 amount) public onlyOwner {
        require(amount <= address(this).balance, "Insufficient funds");
        require(!fundsLocked || block.timestamp >= lockPeriodEnd, "Funds are locked");
        
        payable(owner()).transfer(amount);
        totalFunds -= amount;
        emit FundsWithdrawn(owner(), amount);
    }
    
    // Fallback function to receive ETH
    receive() external payable {
        totalFunds += msg.value;
        emit FundsReceived(msg.sender, msg.value);
    }
}

/**
 * @title YieldFarmingContract
 * @dev Simulates yield farming for the investor funds
 */
contract YieldFarmingContract is Ownable {
    uint256 public totalStaked;
    uint256 public yieldRate = 10; // 10% APY
    uint256 public lastYieldTimestamp;
    
    event Staked(uint256 amount);
    event YieldGenerated(uint256 amount);
    event Withdrawn(address recipient, uint256 amount);
    
    constructor(address initialOwner) Ownable(initialOwner) {
        lastYieldTimestamp = block.timestamp;
    }
    
    // Stake ETH for yield farming
    function stake() public payable onlyOwner {
        totalStaked += msg.value;
        emit Staked(msg.value);
    }
    
    // Simulate yield generation (for demo purposes)
    function generateYield() public onlyOwner {
        // Calculate time passed since last yield
        uint256 timeElapsed = block.timestamp - lastYieldTimestamp;
        
        // Only generate yield if at least 1 minute has passed (for demo)
        require(timeElapsed >= 1 minutes, "Wait at least 1 minute between yield generation");
        
        // Calculate yield amount (simplified for demo)
        // In a real implementation, this would be based on actual DeFi protocols
        uint256 yieldAmount = (totalStaked * yieldRate * timeElapsed) / (365 days * 100);
        
        // For demo purposes, we're simulating yield by adding ETH to the contract
        // In a real implementation, this would come from actual yield farming
        payable(address(this)).transfer(yieldAmount);
        
        totalStaked += yieldAmount;
        lastYieldTimestamp = block.timestamp;
        
        emit YieldGenerated(yieldAmount);
    }
    
    // For demo purposes - simulate yield without actual transfer
    function simulateYield(uint256 yieldAmount) public onlyOwner {
        totalStaked += yieldAmount;
        lastYieldTimestamp = block.timestamp;
        
        emit YieldGenerated(yieldAmount);
    }
    
    // Withdraw funds to reward contract
    function withdrawToRewards(address rewardContract, uint256 amount) public onlyOwner {
        require(amount <= address(this).balance, "Insufficient funds");
        
        (bool success, ) = rewardContract.call{value: amount}("");
        require(success, "Transfer failed");
        
        totalStaked -= amount;
        emit Withdrawn(rewardContract, amount);
    }
    
    // Fallback function to receive ETH
    receive() external payable {}
}

/**
 * @title LearningContract
 * @dev Manages courses, quizzes, and user scores
 */
contract LearningContract is Ownable {
    struct Course {
        string name;
        string description;
        uint256 passingScore; // Out of 100
        bool active;
    }
    
    struct Quiz {
        uint256 courseId;
        string[] questions;
        uint8[] answers; // Correct answer index for each question
    }
    
    struct UserScore {
        uint256 score; // Out of 100
        bool completed;
        bool certificateIssued;
    }
    
    // Course and quiz storage
    Course[] public courses;
    mapping(uint256 => Quiz) public quizzes; // courseId => Quiz
    
    // User scores
    mapping(address => mapping(uint256 => UserScore)) public userScores; // user => courseId => UserScore
    mapping(uint256 => address[]) public courseParticipants; // courseId => participants
    
    // Events
    event CourseCreated(uint256 courseId, string name);
    event QuizSubmitted(address user, uint256 courseId, uint256 score);
    event CertificateEligible(address user, uint256 courseId);
    
    constructor(address initialOwner) Ownable(initialOwner) {}
    
    // Create a new course
    function createCourse(
        string memory name, 
        string memory description, 
        uint256 passingScore,
        string[] memory quizQuestions,
        uint8[] memory quizAnswers
    ) public onlyOwner returns (uint256) {
        require(quizQuestions.length == quizAnswers.length, "Questions and answers must match");
        
        uint256 courseId = courses.length;
        courses.push(Course(name, description, passingScore, true));
        
        Quiz storage newQuiz = quizzes[courseId];
        newQuiz.courseId = courseId;
        newQuiz.questions = quizQuestions;
        newQuiz.answers = quizAnswers;
        
        emit CourseCreated(courseId, name);
        return courseId;
    }
    
    // Submit quiz answers and get score
    function submitQuiz(uint256 courseId, uint8[] memory userAnswers) public {
        require(courseId < courses.length, "Course does not exist");
        require(courses[courseId].active, "Course is not active");
        require(quizzes[courseId].questions.length == userAnswers.length, "Answer count mismatch");
        require(!userScores[msg.sender][courseId].completed, "Quiz already completed");
        
        Quiz storage quiz = quizzes[courseId];
        uint256 correctAnswers = 0;
        
        for (uint i = 0; i < userAnswers.length; i++) {
            if (userAnswers[i] == quiz.answers[i]) {
                correctAnswers++;
            }
        }
        
        // Calculate score as percentage
        uint256 score = (correctAnswers * 100) / userAnswers.length;
        
        // Record user score
        userScores[msg.sender][courseId] = UserScore(score, true, false);
        
        // Add user to course participants if not already added
        bool participantExists = false;
        for (uint i = 0; i < courseParticipants[courseId].length; i++) {
            if (courseParticipants[courseId][i] == msg.sender) {
                participantExists = true;
                break;
            }
        }
        
        if (!participantExists) {
            courseParticipants[courseId].push(msg.sender);
        }
        
        emit QuizSubmitted(msg.sender, courseId, score);
        
        // Check if eligible for certificate
        if (score >= courses[courseId].passingScore) {
            emit CertificateEligible(msg.sender, courseId);
        }
    }
    
    // Get top performers for a course
    function getTopPerformers(uint256 courseId, uint256 count) public view returns (address[] memory, uint256[] memory) {
        require(courseId < courses.length, "Course does not exist");
        
        // Get participants for this course
        address[] memory participants = courseParticipants[courseId];
        uint256 participantCount = participants.length;
        
        // Adjust count if there are fewer participants
        if (count > participantCount) {
            count = participantCount;
        }
        
        // Create arrays for top performers and their scores
        address[] memory topPerformers = new address[](count);
        uint256[] memory topScores = new uint256[](count);
        
        // Initialize with first participants
        for (uint i = 0; i < count; i++) {
            topPerformers[i] = participants[i];
            topScores[i] = userScores[participants[i]][courseId].score;
        }
        
        // Sort to find top performers (simple insertion sort)
        for (uint i = count; i < participantCount; i++) {
            uint256 currentScore = userScores[participants[i]][courseId].score;
            
            // Check if this score is higher than any in our top list
            for (uint j = 0; j < count; j++) {
                if (currentScore > topScores[j]) {
                    // Shift everyone down
                    for (uint k = count - 1; k > j; k--) {
                        topPerformers[k] = topPerformers[k-1];
                        topScores[k] = topScores[k-1];
                    }
                    
                    // Insert new top performer
                    topPerformers[j] = participants[i];
                    topScores[j] = currentScore;
                    break;
                }
            }
        }
        
        return (topPerformers, topScores);
    }
    
    // Mark certificate as issued
    function markCertificateIssued(address user, uint256 courseId) public onlyOwner {
        require(courseId < courses.length, "Course does not exist");
        require(userScores[user][courseId].completed, "Course not completed");
        require(userScores[user][courseId].score >= courses[courseId].passingScore, "Did not pass course");
        
        userScores[user][courseId].certificateIssued = true;
    }
    
    // Get course details
    function getCourse(uint256 courseId) public view returns (
        string memory name,
        string memory description,
        uint256 passingScore,
        bool active
    ) {
        require(courseId < courses.length, "Course does not exist");
        Course storage course = courses[courseId];
        return (course.name, course.description, course.passingScore, course.active);
    }
    
    // Get quiz questions
    function getQuizQuestions(uint256 courseId) public view returns (string[] memory) {
        require(courseId < courses.length, "Course does not exist");
        return quizzes[courseId].questions;
    }
    
    // Get user score
    function getUserScore(address user, uint256 courseId) public view returns (
        uint256 score,
        bool completed,
        bool certificateIssued
    ) {
        require(courseId < courses.length, "Course does not exist");
        UserScore storage userScore = userScores[user][courseId];
        return (userScore.score, userScore.completed, userScore.certificateIssued);
    }
}

/**
 * @title RewardContract
 * @dev Distributes rewards to top performers
 */
contract RewardContract is Ownable {
    EDUToken public eduToken;
    CertificateNFT public certificateNFT;
    LearningContract public learningContract;
    
    struct Reward {
        uint256 courseId;
        uint256[] ethAmounts; // ETH amounts for top performers
        uint256 eduAmount; // EDU tokens per recipient
        string certificateURI; // Base URI for certificates
        bool distributed;
    }
    
    mapping(uint256 => Reward) public rewards; // courseId => Reward
    mapping(uint256 => mapping(address => bool)) public rewardsClaimed; // courseId => user => claimed
    
    event RewardConfigured(uint256 courseId, uint256[] ethAmounts, uint256 eduAmount);
    event RewardDistributed(uint256 courseId, address recipient, uint256 ethAmount, uint256 eduAmount);
    event CertificateIssued(uint256 courseId, address recipient, uint256 tokenId);
    
    constructor(
        address initialOwner,
        address _eduToken,
        address _certificateNFT,
        address _learningContract
    ) Ownable(initialOwner) {
        eduToken = EDUToken(_eduToken);
        certificateNFT = CertificateNFT(_certificateNFT);
        learningContract = LearningContract(_learningContract);
    }
    
    // Configure rewards for a course
    function configureRewards(
        uint256 courseId,
        uint256[] memory ethAmounts,
        uint256 eduAmount,
        string memory certificateURI
    ) public onlyOwner {
        rewards[courseId] = Reward(courseId, ethAmounts, eduAmount, certificateURI, false);
        emit RewardConfigured(courseId, ethAmounts, eduAmount);
    }
    
    // Distribute rewards to top performers
    function distributeRewards(uint256 courseId) public onlyOwner {
        Reward storage reward = rewards[courseId];
        require(!reward.distributed, "Rewards already distributed");
        require(reward.ethAmounts.length > 0, "Rewards not configured");
        require(address(this).balance >= calculateTotalEthReward(courseId), "Insufficient ETH balance");
        require(eduToken.balanceOf(address(this)) >= calculateTotalEduReward(courseId), "Insufficient EDU balance");
        
        // Get top performers
        (address[] memory topPerformers, uint256[] memory topScores) = 
            learningContract.getTopPerformers(courseId, reward.ethAmounts.length);
        
        // Distribute rewards to each top performer
        for (uint i = 0; i < topPerformers.length; i++) {
            address performer = topPerformers[i];
            uint256 score = topScores[i];
            
            // Skip if already claimed
            if (rewardsClaimed[courseId][performer]) continue;
            
            // Mark as claimed
            rewardsClaimed[courseId][performer] = true;
            
            // Send ETH reward
            if (i < reward.ethAmounts.length) {
                uint256 ethAmount = reward.ethAmounts[i];
                payable(performer).transfer(ethAmount);
                
                // Send EDU tokens
                eduToken.transfer(performer, reward.eduAmount);
                
                emit RewardDistributed(courseId, performer, ethAmount, reward.eduAmount);
            }
            
            // Issue certificate if passed
            (,string memory description, uint256 passingScore,) = learningContract.getCourse(courseId);
            if (score >= passingScore) {
                uint256 tokenId = certificateNFT.mintCertificate(
                    performer, 
                    courseId, 
                    reward.certificateURI
                );
                
                // Mark certificate as issued in learning contract
                learningContract.markCertificateIssued(performer, courseId);
                
                emit CertificateIssued(courseId, performer, tokenId);
            }
        }
        
        reward.distributed = true;
    }
    
    // Calculate total ETH needed for rewards
    function calculateTotalEthReward(uint256 courseId) public view returns (uint256) {
        Reward storage reward = rewards[courseId];
        uint256 total = 0;
        
        for (uint i = 0; i < reward.ethAmounts.length; i++) {
            total += reward.ethAmounts[i];
        }
        
        return total;
    }
    
    // Calculate total EDU needed for rewards
    function calculateTotalEduReward(uint256 courseId) public view returns (uint256) {
        Reward storage reward = rewards[courseId];
        (address[] memory topPerformers,) = 
            learningContract.getTopPerformers(courseId, reward.ethAmounts.length);
            
        return reward.eduAmount * topPerformers.length;
    }
    
    // Fallback function to receive ETH
    receive() external payable {}
}

/**
 * @title GradXPPlatform
 * @dev Main contract that ties all platform components together
 */
contract GradXPPlatform is Ownable {
    EDUToken public eduToken;
    CertificateNFT public certificateNFT;
    FundingContract public fundingContract;
    YieldFarmingContract public yieldFarmingContract;
    LearningContract public learningContract;
    RewardContract public rewardContract;
    
    constructor(address initialOwner) Ownable(initialOwner) {
        // Deploy all contracts
        eduToken = new EDUToken(address(this));
        certificateNFT = new CertificateNFT(address(this));
        fundingContract = new FundingContract(address(this));
        yieldFarmingContract = new YieldFarmingContract(address(this));
        learningContract = new LearningContract(address(this));
        rewardContract = new RewardContract(
            address(this),
            address(eduToken),
            address(certificateNFT),
            address(learningContract)
        );
        
        // Transfer some EDU tokens to the reward contract
        eduToken.transfer(address(rewardContract), 500 * 10**18);
    }
    
    // Initialize a demo course
    function initializeDemoCourse() public onlyOwner {
        // Create demo course with quiz
        string[] memory questions = new string[](3);
        questions[0] = "What is an NFT?";
        questions[1] = "What is the main benefit of yield farming?";
        questions[2] = "Which of these is NOT a feature of blockchain?";
        
        uint8[] memory answers = new uint8[](3);
        answers[0] = 1; // Correct answer index for question 1
        answers[1] = 0; // Correct answer index for question 2
        answers[2] = 2; // Correct answer index for question 3
        
        uint256 courseId = learningContract.createCourse(
            "Intro to Web3",
            "Learn the basics of Web3 technology and blockchain concepts",
            70, // Passing score (70%)
            questions,
            answers
        );
        
        // Configure rewards for the course
        uint256[] memory ethAmounts = new uint256[](3);
        ethAmounts[0] = 0.03 ether; // 1st place
        ethAmounts[1] = 0.02 ether; // 2nd place
        ethAmounts[2] = 0.01 ether; // 3rd place
        
        rewardContract.configureRewards(
            courseId,
            ethAmounts,
            10 * 10**18, // 10 EDU tokens per recipient
            "ipfs://QmCertificateBaseURI/"
        );
    }
    
    // Move funds from funding to yield farming
    function moveToYieldFarming(uint256 amount) public onlyOwner {
        fundingContract.transferToYieldFarming(address(yieldFarmingContract), amount);
    }
    
    // Move funds from yield farming to rewards
    function moveToRewards(uint256 amount) public onlyOwner {
        yieldFarmingContract.withdrawToRewards(address(rewardContract), amount);
    }
    
    // Distribute rewards for a course
    function distributeRewards(uint256 courseId) public onlyOwner {
        rewardContract.distributeRewards(courseId);
    }
    
    // Get contract addresses
    function getContractAddresses() public view returns (
        address eduTokenAddress,
        address certificateNFTAddress,
        address fundingContractAddress,
        address yieldFarmingContractAddress,
        address learningContractAddress,
        address rewardContractAddress
    ) {
        return (
            address(eduToken),
            address(certificateNFT),
            address(fundingContract),
            address(yieldFarmingContract),
            address(learningContract),
            address(rewardContract)
        );
    }
}


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
            (, , uint256 passingScore, ) = learningContract.getCourse(courseId);
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


contract GradXP {
    address public owner;
    uint256 public totalPool;
    uint256 public yieldPool;
    uint256 public rewardPool;
    uint256 public yieldRate = 1; // 1% per minute (for demo purposes)
    uint256 public lastYieldTimestamp;
    
    struct Course {
        uint256 id;
        string title;
        string description;
        uint256 price;
        address creator;
        bool isActive;
    }
    
    struct Certificate {
        uint256 id;
        uint256 courseId;
        address student;
        uint256 score;
        uint256 timestamp;
    }
    
    mapping(uint256 => Course) public courses;
    mapping(address => uint256) public investments;
    mapping(address => uint256) public points;
    mapping(address => mapping(uint256 => bool)) public enrollments;
    mapping(uint256 => Certificate) public certificates;
    
    uint256 public courseCount;
    uint256 public certificateCount;
    
    event Investment(address indexed investor, uint256 amount, uint256 timestamp);
    event CourseCreated(uint256 indexed courseId, address indexed creator, uint256 price);
    event CoursePurchased(address indexed student, uint256 indexed courseId, uint256 amount);
    event CertificateIssued(address indexed student, uint256 indexed courseId, uint256 certificateId, uint256 score);
    event RewardClaimed(address indexed student, uint256 amount, uint256 points);
    event YieldAccrued(uint256 amount, uint256 timestamp);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        lastYieldTimestamp = block.timestamp;
    }
    
    /**
     * @dev Invest ETH in the platform
     */
    function invest() external payable {
        require(msg.value > 0, "Investment amount must be greater than 0");
        
        // Accrue yield before updating pools
        accrueYield();
        
        // 50% to yield pool, 50% to reward pool
        uint256 yieldAmount = msg.value / 2;
        uint256 rewardAmount = msg.value - yieldAmount;
        
        yieldPool += yieldAmount;
        rewardPool += rewardAmount;
        totalPool += msg.value;
        
        // Track individual investments
        investments[msg.sender] += msg.value;
        
        emit Investment(msg.sender, msg.value, block.timestamp);
    }
    
    /**
     * @dev Create a new course
     */
    function createCourse(string memory title, string memory description, uint256 price) external {
        courseCount++;
        courses[courseCount] = Course({
            id: courseCount,
            title: title,
            description: description,
            price: price,
            creator: msg.sender,
            isActive: true
        });
        
        emit CourseCreated(courseCount, msg.sender, price);
    }
    
    /**
     * @dev Purchase a course
     */
    function purchaseCourse(uint256 courseId) external payable {
        Course storage course = courses[courseId];
        require(course.isActive, "Course is not active");
        require(msg.value >= course.price, "Insufficient payment");
        require(!enrollments[msg.sender][courseId], "Already enrolled in this course");
        
        // Accrue yield before updating pools
        accrueYield();
        
        // 20% to creator, 40% to yield pool, 40% to reward pool
        uint256 creatorAmount = (msg.value * 20) / 100;
        uint256 yieldAmount = (msg.value * 40) / 100;
        uint256 rewardAmount = msg.value - creatorAmount - yieldAmount;
        
        // Transfer creator's share
        payable(course.creator).transfer(creatorAmount);
        
        // Update pools
        yieldPool += yieldAmount;
        rewardPool += rewardAmount;
        totalPool += (yieldAmount + rewardAmount);
        
        // Enroll student
        enrollments[msg.sender][courseId] = true;
        
        // Award points for enrollment
        points[msg.sender] += 5;
        
        emit CoursePurchased(msg.sender, courseId, msg.value);
    }
    
    /**
     * @dev Issue a certificate for course completion
     */
    function issueCertificate(address student, uint256 courseId, uint256 score) external onlyOwner {
        require(enrollments[student][courseId], "Student not enrolled in this course");
        require(score >= 0 && score <= 100, "Score must be between 0 and 100");
        
        certificateCount++;
        certificates[certificateCount] = Certificate({
            id: certificateCount,
            courseId: courseId,
            student: student,
            score: score,
            timestamp: block.timestamp
        });
        
        // Award points based on score
        uint256 pointsAwarded = score / 10; // 0-10 points based on score
        points[student] += pointsAwarded;
        
        emit CertificateIssued(student, courseId, certificateCount, score);
        
        // If score is high enough, award ETH from reward pool
        if (score >= 70) {
            uint256 rewardAmount = 0;
            
            if (score >= 90) {
                rewardAmount = (rewardPool * 3) / 100; // 3% of reward pool for 90+
            } else if (score >= 80) {
                rewardAmount = (rewardPool * 2) / 100; // 2% of reward pool for 80-89
            } else {
                rewardAmount = (rewardPool * 1) / 100; // 1% of reward pool for 70-79
            }
            
            if (rewardAmount > 0 && rewardAmount <= rewardPool) {
                rewardPool -= rewardAmount;
                totalPool -= rewardAmount;
                payable(student).transfer(rewardAmount);
                
                emit RewardClaimed(student, rewardAmount, pointsAwarded);
            }
        }
    }
    
    /**
     * @dev Accrue yield based on time elapsed
     */
    function accrueYield() public {
        uint256 timeElapsed = block.timestamp - lastYieldTimestamp;
        
        // Only accrue yield if at least 1 minute has passed
        if (timeElapsed >= 1 minutes) {
            // Calculate yield: yieldPool * yieldRate * (timeElapsed / 1 minute)
            uint256 minutes = timeElapsed / 60;
            uint256 yieldAmount = 0;
            
            for (uint256 i = 0; i < minutes; i++) {
                yieldAmount += (yieldPool * yieldRate) / 100;
            }
            
            if (yieldAmount > 0) {
                yieldPool += yieldAmount;
                totalPool += yieldAmount;
                
                emit YieldAccrued(yieldAmount, block.timestamp);
            }
            
            lastYieldTimestamp = block.timestamp;
        }
    }
    
    /**
     * @dev Get total pool amount
     */
    function getTotalPool() external view returns (uint256) {
        return totalPool;
    }
    
    /**
     * @dev Get yield pool amount
     */
    function getYieldPool() external view returns (uint256) {
        return yieldPool;
    }
    
    /**
     * @dev Get reward pool amount
     */
    function getRewardPool() external view returns (uint256) {
        return rewardPool;
    }
    
    /**
     * @dev Get user investment amount
     */
    function getUserInvestment(address user) external view returns (uint256) {
        return investments[user];
    }
    
    /**
     * @dev Get user points
     */
    function getUserPoints(address user) external view returns (uint256) {
        return points[user];
    }
    
    /**
     * @dev Check if user is enrolled in a course
     */
    function isEnrolled(address user, uint256 courseId) external view returns (bool) {
        return enrollments[user][courseId];
    }
    
    /**
     * @dev Get certificate details
     */
    function getCertificate(uint256 certificateId) external view returns (
        uint256 id,
        uint256 courseId,
        address student,
        uint256 score,
        uint256 timestamp
    ) {
        Certificate storage cert = certificates[certificateId];
        return (cert.id, cert.courseId, cert.student, cert.score, cert.timestamp);
    }
    
    /**
     * @dev Withdraw funds in case of emergency (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 amount = totalPool;
        totalPool = 0;
        yieldPool = 0;
        rewardPool = 0;
        payable(owner).transfer(amount);
    }
}


// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VotingToken is ERC20 {
    uint8 private _decimals;

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _initialSupply,
        uint8 decimal,
        address _owner
    ) ERC20(_tokenName, _tokenSymbol) {
        _decimals = decimal;
        _mint(_owner, _initialSupply * 10 ** uint256(decimal));
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
}

contract Voting is Ownable {
    struct Candidate {
        uint256 id;
        string name;
        address candidateAddress;
        uint256 voteCount;
        VotingToken token;
        uint256 transferAmount;
    }
    mapping(uint256 => Candidate) public candidates;
    mapping(address => bool) public voters;
    mapping(address => bool) public registeredVoters;
    mapping(address => address) public tokenOfAddress;
    uint256 public candidatesCount;

    event TokenCreated(
        address tokenAddress,
        string name,
        string symbol,
        uint256 initialSupply
    );
    event CandidateAdded(
        uint256 candidateId,
        string name,
        address candidateAddress,
        address tokenAddress,
        uint256 transferAmount
    );
    event Voted(address indexed voter, uint256 indexed candidateId);
    event TokenSent(
        address indexed sender,
        uint256 indexed candidateId,
        uint256 amount
    );

    constructor() Ownable(msg.sender) {}

    function createToken(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint8 decimal
    ) external returns (address) {
        VotingToken newToken = new VotingToken(
            name,
            symbol,
            initialSupply,
            decimal,
            msg.sender
        );
        emit TokenCreated(address(newToken), name, symbol, initialSupply);
        tokenOfAddress[msg.sender] = address(newToken);
        return address(newToken);
    }

    function getTokenAddress() public view returns (address) {
        require(tokenOfAddress[msg.sender] != address(0), "Token not created.");
        return tokenOfAddress[msg.sender];
    }

    function addCandidate(
        string memory _name,
        VotingToken _token,
        uint256 _transferAmount
    ) external {
        candidatesCount++;

        candidates[candidatesCount] = Candidate(
            candidatesCount,
            _name,
            msg.sender,
            0,
            _token,
            _transferAmount
        );
        emit CandidateAdded(
            candidatesCount,
            _name,
            msg.sender,
            address(_token),
            _transferAmount
        );
    }

    function registerVoter() public {
        require(!registeredVoters[msg.sender], "You are already registered.");
        registeredVoters[msg.sender] = true;
    }

    function sendTokenToVoteContract(
        uint256 _amount,
        uint256 _candidateId
    ) public {
        require(_candidateId > 0, "Id must be greater than 0.");
        require(_candidateId <= candidatesCount, "Invalid candidate ID.");

        Candidate storage candidate = candidates[_candidateId];
        uint256 amountToTransfer = _amount * 10 ** candidate.token.decimals();

        require(
            candidate.token.allowance(msg.sender, address(this)) >=
                amountToTransfer,
            "Insufficient allowance to send tokens."
        );

        require(
            candidate.token.balanceOf(msg.sender) >= amountToTransfer,
            "Insufficient token balance."
        );

        candidate.token.transferFrom(
            msg.sender,
            address(this),
            amountToTransfer
        );

        emit TokenSent(msg.sender, _candidateId, amountToTransfer);
    }

    function vote(uint256 _candidateId) public {
        require(
            registeredVoters[msg.sender],
            "You are not registered to vote."
        );
        require(!voters[msg.sender], "You have already voted.");
        require(
            _candidateId > 0 && _candidateId <= candidatesCount,
            "Invalid candidate ID."
        );

        Candidate storage candidate = candidates[_candidateId];
        candidate.voteCount++;

        uint256 amountToTransfer = candidate.transferAmount *
            10 ** candidate.token.decimals();

        require(
            candidate.token.balanceOf(address(this)) >= amountToTransfer,
            "Insufficient token balance in this contract."
        );

        candidate.token.transfer(msg.sender, amountToTransfer);

        voters[msg.sender] = true;

        emit Voted(msg.sender, _candidateId);
    }

    function getCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory candidateList = new Candidate[](candidatesCount);
        for (uint256 i = 1; i <= candidatesCount; i++) {
            candidateList[i - 1] = candidates[i];
        }
        return candidateList;
    }
}

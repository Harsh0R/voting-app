import votingContractABI from "./Voting.json";
import tokenABI from "./VotingToken.json";

const VotingContractAddress = '0xB7DF1349CE01A967806388Ff7e0BAbBC4b6ed3af';

const tokenAbi = tokenABI.abi;
const contractABI = votingContractABI.abi;



export { tokenAbi, VotingContractAddress , contractABI  };
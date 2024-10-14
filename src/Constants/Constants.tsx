import votingContractABI from "./Voting.json";
import tokenABI from "./VotingToken.json";

const VotingContractAddress = '0xccE3c5A6Ed4A01611Df943410c854cA2BbBF9330';

const tokenAbi = tokenABI.abi;
const contractABI = votingContractABI.abi;



export { tokenAbi, VotingContractAddress , contractABI  };
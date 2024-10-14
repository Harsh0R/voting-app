import votingContractABI from "./Voting.json";
import tokenABI from "./VotingToken.json";

// const VotingContractAddress = '0xccE3c5A6Ed4A01611Df943410c854cA2BbBF9330';
const VotingContractAddress = "0x7Cb310A4953047333b3cE6b21E29B5333CB124bc";

const tokenAbi = tokenABI.abi;
const contractABI = votingContractABI.abi;

export { tokenAbi, VotingContractAddress, contractABI };

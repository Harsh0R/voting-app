import votingContractABI from "./Voting.json";
import tokenABI from "./VotingToken.json";

const VotingContractAddress = '0x010342557897e0E38E15DAa410f3115934061ADb';

const tokenAbi = tokenABI.abi;
const contractABI = votingContractABI.abi;



export { tokenAbi, VotingContractAddress , contractABI  };
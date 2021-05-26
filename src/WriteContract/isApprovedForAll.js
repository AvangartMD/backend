const contractInstance = require('../contractInstance');
const account = require('../account');

callIsApprovedForAll = async() => {

    try {
        
        const operatorAddress = "0xBb8901d048e1004fcfA4236a0Cd93741D851cEBC";    
        const callIsApproved = await contractInstance.methods.isApprovedForAll(account, operatorAddress).call();
        console.log(callIsApproved);
        return callIsApproved;

    } catch (error) {
        console.log(error);
    }

}

callIsApprovedForAll()
const contractInstance = require('../contractInstance');
const account = require('../account');

callIsApproved = async() => {
    try {
        const callIsApproved = await contractInstance.methods.isApproved(account).call();

        console.log(callIsApproved);
        return callIsApproved;
        
    } catch (error) {
        console.log(error);
    }
    
}

callIsApproved()
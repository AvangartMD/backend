const contractInstance = require('../contractInstance');
const account = require('../account');

callBalanceOf = async() => {
    try {
        const id = 18; // This is testing ID not real ID
        const callBalance = await contractInstance.methods.balanceOf(account,id).call();

        console.log(callBalance);
        return callBalance;
    } catch (error) {
        console.log(error);
    }    
}

callBalanceOf()
const contractInstance = require('../contractInstance');
const account = require('../account');

callBalanceOfBatch = async() => {
    try {
        const add = [account,account];
        const id = [100, 100]; // This is testing ID not real ID

        const callBalance = await contractInstance.methods.balanceOfBatch(add,id).call();

        console.log(callBalance);
        return callBalance;
    } catch (error) {
        console.log(error);
    }

    
}

callBalanceOfBatch();
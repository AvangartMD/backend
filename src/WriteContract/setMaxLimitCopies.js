const contractInstance = require('../contractInstance');
const account = require('../account');

setMaxLimitCopies = async() => {

    try {
        var amount;

        const setMaxLimitCopiesStatus = await contractInstance.methods.setMaxLimitCopies(amount).send({from: account});
        return setMaxLimitCopiesStatus;
    }
     catch (error) {
        console.log(error);
    }
}

setMaxLimitCopies();
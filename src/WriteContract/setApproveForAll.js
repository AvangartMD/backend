const contractInstance = require('../contractInstance');
const account = require('../account');

setApproveForAll = async() => {

    try {
        var operator;
        var approved;

        const setApproveForAllStatus = await contractInstance.methods.setApproveForAll(operator, approved).send({from:account});
        return setApproveForAllStatus;
    }
     catch (error) {
        console.log(error);
    }
}

setApproveForAll();
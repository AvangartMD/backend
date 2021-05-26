const contractInstance = require('../contractInstance');
const account = require('../account');

setMaxEditions = async() => {

    try {
        var max;

        const setMaxEditionsStatus = await contractInstance.methods.setMaxEditions(max).send({from:account});
        return setMaxEditionsStatus;
    }
     catch (error) {
        console.log(error);
    }
}

setMaxEditions();
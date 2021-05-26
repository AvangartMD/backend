const contractInstance = require('../contractInstance');
const account = require('../account');

burnToken = async() => {

    try {
        var id = "";
        var amount = "";

        const burnTokenStatus = await contractInstance.methods.burnToken(id,amount).send({from: account});;
        return burnTokenStatus;
    } 
    catch (error) {
        console.log(error);
    }
}

burnToken();
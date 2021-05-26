const contractInstance = require('../contractInstance');
const account = require('../account');

mintEditionToken = async() => {

    try {
        var tokenURI = "";

        const mintEditionTokenStatus = await contractInstance.methods.mintEditionToken(tokenURI).send({from:account});
        return mintEditionTokenStatus;
    }
     catch (error) {
        console.log(error);
    }
}

mintEditionToken();
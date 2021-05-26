const contractInstance = require('../contractInstance');
const account = require('../account');

mintTokenCopies = async() => {

    try {
        var amount = "";
        var tokenURI = "";

        const mintTokenCopiesStatus = await contractInstance.methods.mintTokenCopies(amount, tokenURI).send({from:account});
        return mintTokenCopiesStatus;
    }
     catch (error) {
        console.log(error);
    }
}

mintTokenCopies();
const contractInstance = require('../contractInstance');
const account = require('../account');

callMaxEdition = async() => {

    try {

        const callMaxEdition = await contractInstance.methods.maxEditions(account).call();
        console.log(callMaxEdition);
        return callMaxEdition;

    } catch (error) {
        console.log(error);
    }

}

callMaxEdition()
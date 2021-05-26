const contractInstance = require('../contractInstance');
const account = require('../account');

disableCreator = async() => {

    try {
        var creatorAddress = "";

        const disableCreatorStatus = await contractInstance.methods.changeAdmin(creatorAddress).send({from: account});
        return disableCreatorStatus;
    }
     catch (error) {
        console.log(error);
    }
}

disableCreator();
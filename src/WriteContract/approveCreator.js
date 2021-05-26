const contractInstance = require('../contractInstance');
const account = require('../account');

approveCreator = async() => {

    try {
        var creatorAdd = "";

        const approveCreatorStatus = await contractInstance.methods.approveCreator(creatorAdd)
                                                    .send({from: account});
        return approveCreatorStatus;
    }
     catch (error) {
        console.log(error);
    }
}
    
approveCreator();
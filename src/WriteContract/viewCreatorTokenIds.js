const contractInstance = require('../contractInstance');
const account = require('../account');

callCreatorTokenId = async() => {

    try {
        const creatorAddress = account;
        const creatorId = await contractInstance.methods.viewCreatorTokenIds(creatorAddress).call();
        console.log(creatorId);
        return creatorId;

    } catch (error) {
        console.log(error);
    }
}
callCreatorTokenId()
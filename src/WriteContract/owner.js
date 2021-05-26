const contractInstance = require('../contractInstance');
const account = require('../account');

callToken = async() => {

    try {

        const tokenId = 100;  //fake token Id
        const owner = await contractInstance.methods.owner(tokenId).call();
        console.log(owner);
        return owner;

    } catch (error) {
        console.log(error);
    }

}

callToken()
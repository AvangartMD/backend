const contractInstance = require('../contractInstance');
const account = require('../account');

callTokenURI = async() => {

    try {

        const tokenURI = 12;  //fake token Id
        const tokenU = await contractInstance.methods.tokenURI(tokenURI).call();
        console.log(tokenU);
        return tokenU;

    } catch (error) {
        console.log(error);
    }
}
callTokenURI()
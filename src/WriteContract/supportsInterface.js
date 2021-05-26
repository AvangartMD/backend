const contractInstance = require('../contractInstance');
const account = require('../account');

callSupportIterface = async() => {

    try {

        const intefaceId = 100;  //fake token Id
        const interface = await contractInstance.methods.supportsInterface(intefaceId).call();
        console.log(interface);
        return interface;

    } catch (error) {
        console.log(error);
    }

}

callSupportIterface()
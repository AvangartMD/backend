const contractInstance = require('../contractInstance');
const account = require('../account');

callURI = async() => {

    try {

        const URIId = 12;  //fake token Id
        const uriId = await contractInstance.methods.uri(URIId).call();
        console.log(uriId);
        return uriId;

    } catch (error) {
        console.log(error);
    }
}
callURI()
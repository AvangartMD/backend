const contractInstance = require('../contractInstance');

callMaxEditionPerCreation = async(event) => {
    
    try {
        var callEdition = await contractInstance.methods.maxEditionPerCreator().call();

        console.log(callEdition);
        return callEdition;
    } catch (error) {
        console.log(error);
    }    
}
callMaxEditionPerCreation();


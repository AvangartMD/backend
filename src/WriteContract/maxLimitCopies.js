const contractInstance = require('../contractInstance');

callMaxLimitCopies = async(event) => {
    try {
        var callMax = await contractInstance.methods.maxLimitCopies().call();
        //var callMax = await contractInstance.methods.maxLimitCopies().send({from: "0x4BBD291965245Bf62344A61C691F254629640f5f"});
        console.log(callMax);
        return callMax;
    } catch (error) {
        console.log(error);
    }
}

callMaxLimitCopies();


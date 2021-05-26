const contractInstance = require('../contractInstance');

callTokenId = async(event) => {
    try {
        var tokenId = await contractInstance.methods.tokenId().call();
        //var callMax = await contractInstance.methods.maxLimitCopies().send({from: "0x4BBD291965245Bf62344A61C691F254629640f5f"});
        console.log(tokenId);
        return tokenId;
    } catch (error) {
        console.log(error);
    }
}

callTokenId();

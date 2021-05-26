const contractInstance = require('../contractInstance');
const account = require('../account');

safeTransferFrom = async() => {

    try {
        var fromAddress = "";
        var toAddress = "";
        var ids = "";
        var amount = "";
        var data = "";

        const safeTransferFromStatus = await contractInstance.methods
                                        .safeTransferFrom(fromAddress,
                                                               toAddress,
                                                               ids,
                                                               amount,
                                                               data ).send({from:account});          
                                           
        return safeTransferFromStatus;
    }
     catch (error) {
        console.log(error);
    }
}

safeTransferFrom();
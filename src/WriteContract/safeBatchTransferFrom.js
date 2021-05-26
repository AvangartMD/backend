const contractInstance = require('../contractInstance');
const account = require('../account');

safeBatchTransferFrom = async() => {

    try {
        var fromAddress = "";
        var toAddress = "";
        var ids = "";
        var amount = "";
        var data = "";

        const safeBatchTransferFromStatus = await contractInstance.methods
                                        .safeBatchTransferFrom(fromAddress,
                                                               toAddress,
                                                               ids,
                                                               amount,
                                                               data ).send({from: account});          
                                           
        return safeBatchTransferFromStatus;
    }
     catch (error) {
        console.log(error);
    }
}

safeBatchTransferFrom();
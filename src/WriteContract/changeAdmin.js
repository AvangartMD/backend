const contractInstance = require('../contractInstance');

changeAdmin = async() => {

    try {
        var adminAddress = "";

        const changeAdminStatus = await contractInstance.methods.changeAdmin(adminAddress);
        return changeAdminStatus;
    }
     catch (error) {
        console.log(error);
    }
}

changeAdmin();
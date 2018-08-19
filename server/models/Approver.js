const { mysql } = require('../qcloud');

const approver = {
    async getRequestIds(args){
        let result = await mysql('APPROVER').select('idrequest').where({ iduser: args.iduser });
        return result;
    }
}

module.exports = approver;
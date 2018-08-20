const { mysql } = require('../qcloud');

const request = {
    async getCategory(args) {
        let idrequests = [];
        let result = [];
        for (let inx in args.requestIds) {
            idrequests.push(args.requestIds[inx].idrequest);
        }
        if (args.args.inout == 1) {// Inbox, 未审批
            result = mysql('REQUEST').select('category').count('category as num')
                .whereIn('idrequest', idrequests).whereNull('status').groupBy('category');
        } else {
            result = mysql('REQUEST').select('category').count('category as num')
                .whereIn('idrequest', idrequests).whereNotNull('status').groupBy('category');
        }
        return result;
    },

    async getItem(args) {
        let idrequests = [];
        let result = [];
        let category = args.args.category;

        for (let inx in args.requestIds) {
            idrequests.push(args.requestIds[inx].idrequest);
        }

        if (args.args.inout == 1) {// Inbox, 未审批
            result = mysql('REQUEST').select('cdate', 'ctime', 'subcategory', 'subject', 'requestid', 'name1 as name')
                .innerJoin('USER', 'USER.iduser', 'REQUEST.iduser')
                .whereIn('idrequest', idrequests).where({ category: category }).whereNull('status');
        } else {
            result = mysql('REQUEST').select('cdate', 'ctime', 'subcategory', 'subject', 'requestid', 'name1 as name')
                .innerJoin('USER', 'USER.iduser', 'REQUEST.iduser')
                .whereIn('idrequest', idrequests).where({ category: category }).whereNotNull('status');
        }

        return result;
    }

}

module.exports = request;

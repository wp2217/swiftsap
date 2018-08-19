const { mysql } = require('../qcloud');

const request = {
    async getCategory(args) {
        var idrequests = [];
        for (let inx in args) {
            idrequests.push(args[inx].idrequest);
        }
        let result = mysql('REQUEST').select('category').count('category as num')
            .whereIn('idrequest', idrequests).groupBy('category');

        return result;
    },
    
    async getItem(args) {
        let result = await mysql('REQUEST').select('subcategory').count('subcategory as num')
            .where({ iduser: args.iduser, category: args.category }).groupBy('subcategory');
        return result;
    }

}

module.exports = request;

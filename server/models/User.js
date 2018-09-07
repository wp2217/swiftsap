const { mysql } = require('../qcloud');

const user = {
  async getUserID(args) {
    let result = await mysql('USER').select('IDUSER').where({ EMAIL: args.EMAIL});
    return result;
  },

  async saveUser(args){
    return await mysql('USER').insert(args, 'IDUSER');
  }

}

module.exports = user;
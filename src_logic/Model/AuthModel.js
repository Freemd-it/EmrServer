var config = require('../../Config');
const user = require('../Entity/User');

var AuthModel = function (data) {
    this.data = data;
}

AuthModel.login = async function(options) {
    return await user.findOne(options)
}

AuthModel.createUser = async function(options) {

}

module.exports = AuthModel;

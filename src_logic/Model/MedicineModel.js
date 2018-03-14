var sequelize = require('sequelize');
var Op = sequelize.Op;
var dbService = require('../Service/SequelizeService.js');
var medicine = require('../Entity/Medicine.js');
var moment = require('moment');
var MedicineModel = function(data){
    this.data = data;
}

/* Read */
MedicineModel.list = function(data, callback){

    medicine.findAll({
      attributes: [
        'id', 'name', 'primaryCategory', 'secondaryCategory', 'medication', 'property', 'ingredient', 'amount', 'quantity', 'available'
      ]
    })
    .then(result => {
        callback(result);
    })
    .catch(error => {
        callback(error);
    });
}

MedicineModel.listTwo = async function(options){

    return await medicine.findAll(options)
}

MedicineModel.search = function(data, callback){

    if (data.option === '1') {
      medicine.findAll({
        attributes: [
          'id', 'name', 'primaryCategory', 'secondaryCategory', 'medication', 'property', 'ingredient', 'amount', 'quantity', 'available'
        ],
        where: {
          name: { like: '%'+data.searchText+'%' }
        }
      })
      .then(result => {
        callback(result);
      })
      .catch(error => {
        callback(error);
      });
    } else {
      medicine.findAll({
        attributes: [
          'id', 'name', 'primaryCategory', 'secondaryCategory', 'medication', 'property', 'ingredient', 'amount', 'quantity', 'available'
        ],
        where: {
          ingredient: { like: '%'+data.searchText+'%' }
        }
      })
      .then(result => {
        callback(result);
      })
      .catch(error => {
        callback(error);
      });
    }
}

MedicineModel.clearance = async function (query) {

   return await dbService.query(query, {model: medicine})
}

MedicineModel.create = async function(data){

  const insertDate = moment(new Date()).format('YYYYMMDD');
  const totalAmount = data.quantity * data.amount;

  return await medicine.create({
    name: data.name,
    primaryCategory: data.primaryCategory,
    secondaryCategory: data.secondaryCategory,
    medication: data.medication,
    property: data.property,
    ingredient: data.ingredient,
    amount: data.amount,
    quantity: data.quantity,
    totalAmount: totalAmount
  });
}

MedicineModel.delete = async function(options){
  const { where = [] } = options;
  return await medicine.destroy({
    where: {
      id:{
        [Op.or]: where
      }
    }
  });
}

MedicineModel.update = async function(options){
  const { id, name, ingredient, amount, quantity, medication, property, available, primaryCategory, secondaryCategory} = options;
  const totalAmount = quantity * amount;

  return await medicine.update({
    name: name,
    primaryCategory: primaryCategory,
    secondaryCategory: secondaryCategory,
    ingredient: ingredient,
    amount: amount,
    quantity: quantity,
    medication: medication,
    property: property,
    available: available,
    totalAmount: totalAmount
  },{
    where : { id: id }
  });

}

module.exports = MedicineModel;

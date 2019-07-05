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
        'id', 'name', 'primaryCategory', 'secondaryCategory', 'medication', 'property', 'ingredient', 'amount', 'quantity', 'available', 'expiry', 'memo', 'capacity', 'totalAmount'
      ]
    })
    .then(result => {
        console.log('/management/list', result)
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
          'id', 'name', 'primaryCategory', 'secondaryCategory', 'medication', 'property', 'ingredient', 'amount', 'quantity', 'available', 'expiry', 'memo', 'capacity'
        ],
        where: {
          name: { like: '%'+data.searchText+'%' }
        }
      })
      .then(result => {
        console.log('result', result)
        callback(result);
      })
      .catch(error => {
        callback(error);
      });
    } else {
      medicine.findAll({
        attributes: [
          'id', 'name', 'primaryCategory', 'secondaryCategory', 'medication', 'property', 'ingredient', 'amount', 'quantity', 'available', 'expiry', 'memo', 'capacity', 'totalAmount'
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
   return await dbService.query(query)
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

  const { id, name, ingredient, amount, quantity, totalAmount } = options;

  let record = {
    name: name,
    ingredient: ingredient,
    amount: amount,
    quantity: quantity,
    totalAmount: totalAmount%amount + quantity*amount
  }

  if(!options.primaryCategory){
    const { capacity, totalAmount, expiry, memo } = options
    record.capacity = capacity
    record.totalAmount = totalAmount
    record.expiry = expiry
    record.memo = memo
  } else {
    const { available, primaryCategory, secondaryCategory, medication, property } = options
    record.primaryCategory = primaryCategory
    record.secondaryCategory = secondaryCategory
    record.medication = medication
    record.property = property
    record.available = available
  }

  return await medicine.update(record, {
    where : { id: id }
  });

}

module.exports = MedicineModel;

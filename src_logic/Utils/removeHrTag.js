exports.removeHrTag = (data) => {
  var regex = /<br>/g
  if (data instanceof Object) {
    Object.keys(data[0].dataValues).map(key => {
      if( key === 'impression' || key === 'presentIllness' || key === 'treatmentNote') {
        data[0].dataValues[key] = data[0].dataValues[key].replace(regex, '\n')
      }
    })
  }
  else if (typeof data === 'string' || data instanceof String) {
    data = data.replace(regex, '\n')
  }
  return data
}
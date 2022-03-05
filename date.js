
exports.getDate = () => {
  let today = new Date()

  var option = {
    weekday: 'long',
    day:"numeric",
    month: "long"
  };


  return today.toLocaleDateString("enuUS",option)
}

exports.getDay = () => {
  let today = new Date()

  var option = {
    weekday: 'long'
  };

  let day = today.toLocaleDateString("enuUS",option)
  return day
}

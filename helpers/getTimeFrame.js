module.exports = function getTimeWindow(formattedTime) {
    const formattedTimeArray = formattedTime.split('');
    
    return formattedTimeArray.indexOf('-') > -1 ?
           'WEEKLY' : 
           formattedTimeArray.indexOf(',') > -1 ?
           'DAILY' :
           'MONTHLY';
  }
  
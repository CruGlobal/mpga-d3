var dataSplitter = function (data) {
  return {
    lostPartners:_.filter(data, function (partnerRow) {
      return partnerRow['12MonthTotalCount'] == 0;
    }),
    notLostPartners:_.filter(data, function (partnerRow) {
      return partnerRow['12MonthTotalCount'] != 0;
    })
  };
};

var formatCurrency = function (number) {
  return '$' + d3.format(',.2f')(number);
}

var formatDate = function(timeSinceEpoch) {
  var date = new Date(timeSinceEpoch);
  return date.getMonth() + '/' + date.getDay() + '/' + date.getFullYear();
}
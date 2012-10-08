var dataSplitter = function (data) {
  return {
    lostPartners:_.filter(data, function (partnerRow) {
      return partnerRow['12MonthTotalCount'] == 0;
    }),
    notLostPartners:_.filter(data, function (partnerRow) {
      return partnerRow['12MonthTotalCount'] != 0;
    })
  }
};

var newAndCurrentPartners = function (notLostPartners) {
  _.each(notLostPartners, function(d) {
    d['avgOver12Months'] = d['12MonthTotalAmount'] / 12;
  });
  return notLostPartners;
}

var formatCurrency = function (number) {
  return '$' + d3.format(',.2f')(number);
}
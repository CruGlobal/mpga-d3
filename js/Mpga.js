//'use strict';

//(function () {
  var splitData = function (data) {
    return {
      lostPartners:_.filter(data, function (partnerRow) {
        return partnerRow['12MonthTotalCount'] == 0;
      }),
      notLostPartners:_.filter(data, function (partnerRow) {
        return partnerRow['12MonthTotalCount'] != 0;
      })
    }
  };
//})();
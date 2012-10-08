'use strict';

var data;

d3.json('testData.json', function (json) {
    data = json;

    var tr = d3.select('.container')
      .append('table').attr('class', 'table-striped')
      .append('tbody')
      .selectAll('tr')
      .data(json)
      .enter()
      .append('tr');

    tr.append('td').text(function(d) {
        return d.accountName;
    });
    tr.append('td').text(function(d) {
        return d.accountNumber;
    });
    tr.append('td').text(function(d) {
        return formatCurrency(d['12MonthTotalAmount']);
    });
});

'use strict';

var newFakeRow = function() {
  return {
    "accountName":Faker.Name.findName(),
    "accountNumber":_.random(1,100000),
    "12MonthTotalAmount":d3.random.normal(1200, 200)(),
    "12MonthTotalCount":_.random(15),
    "firstTransactionDate":new Date(d3.random.normal(1254669256528, 1077256528)()),
    "lastTransactionDate":new Date(d3.random.normal(1349364389641, 1077256528)()),
    "totalTransactionAmount":d3.random.normal(7800, 1200)(),
    "nonCash12MonthTotalAmount":0
  };
}

var data = []
_.times(50, function() { data.push(newFakeRow()) } )




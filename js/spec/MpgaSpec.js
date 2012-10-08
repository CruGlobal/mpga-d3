describe('A suite', function() {
    it('contains spec with an expectation', function() {
        expect(true).toBe(true);
    });
});

describe('splitData', function () {
  var data = [
    { '12MonthTotalCount':0},
    { '12MonthTotalCount':0},
    { '12MonthTotalCount':2},
    { '12MonthTotalCount':2},
    { '12MonthTotalCount':1}
  ];

  var split = splitData(data);


  it('splits the data into lost and not lost', function () {
    expect(_.size(split.lostPartners)).toBe(2);
    expect(_.size(split.notLostPartners)).toBe(3);
  })
});
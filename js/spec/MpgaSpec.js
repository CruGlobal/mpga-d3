describe('A suite', function() {
  it('contains spec with an expectation', function() {
    expect(true).toBe(true);
  });
});

describe('dataSplitter', function () {
  var data = [
    { '12MonthTotalCount':0},
    { '12MonthTotalCount':0},
    { '12MonthTotalCount':2},
    { '12MonthTotalCount':2},
    { '12MonthTotalCount':1}
  ];

  var split = dataSplitter(data);

  it('splits the data into lost and not lost', function () {
    expect(_.size(split.lostPartners)).toBe(2);
    expect(_.size(split.notLostPartners)).toBe(3);
  });
});

describe('formatCurrency', function() {
  it('trims to 2 decimal places, adds thousands separator and prepends $', function () {
    expect(formatCurrency(1234.5678)).toBe('$1,234.57');
  });
  it('rounds correctly', function () {
    expect(formatCurrency(1234.1111)).toBe('$1,234.11');
  });
  it('5 rounds up', function () {
    expect(formatCurrency(1234.555)).toBe('$1,234.56');
  });
  it('adds commas in the correct places', function () {
    expect(formatCurrency(123456789)).toBe('$123,456,789.00');
  });
});
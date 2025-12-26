const buildSeatLayout = (baseLayout) => {
  return baseLayout.map(row => ({
    row: row.row,
    seats: Array.from({ length: row.count }, (_, i) => ({
      number: i + 1,
      price: row.price,
      status: "available", 
    })),
  }));
};

module.exports = buildSeatLayout;

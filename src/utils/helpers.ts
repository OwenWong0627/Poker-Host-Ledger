export const addDollarSign = (amount: number) => {
  if (amount < 0) {
    return '-$' + Math.abs(amount).toFixed(2);
  }
  else if (amount === undefined || amount === null) {
    return '$0.00';
  }
  else {
    return '+$' + amount.toFixed(2);
  }
};
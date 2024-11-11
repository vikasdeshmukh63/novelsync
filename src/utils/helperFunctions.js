// eslint-disable-next-line eqeqeq
export const finderFunction = (key, value, data) => data.find((item) => item[key] == value);
// utility function to render text safely
export const renderText = (value, fallbackText) => {
  if (value !== null && value !== undefined) {
    return value;
  }
  return fallbackText ? 'Not Available' : '';
};

module.exports = function (item, query) {
  if (!query) { return true; }
  if (!item.match) { return false; }

  for (let key of item.match) {
    // Allow for dot notated paths, i.e. `course.title`
    const value = key.split('.').reduce((obj, prop) => obj && obj[prop], item);

    if (value && query.test(value)) {
      return true;
    }
  }

  return false;
};

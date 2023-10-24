const remapItem = (item) => {
  const { _id, ...rest } = item;
  return {
    id: _id,
    ...rest,
  };
};

module.exports = { remapItem };

export const filterValidators = (validators, filters) => ({
  ...validators,
  data:
    filters.search || filters.address
      ? validators.data.filter(
          (validator) =>
            validator.username.includes(filters.search) &&
            (!filters.address || filters.address.includes(validator.address))
        )
      : validators.data,
});

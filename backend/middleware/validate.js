const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: result.error.errors,
    });
  }
  req.body = result.data;
  next();
};

module.exports = validate;

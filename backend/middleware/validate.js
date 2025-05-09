const validate = (schema) => (req, res, next) => {
  try {
    schema.safeParse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      error: "Validation failed",
      details: error.errors || error.message,
    });
  }
};

module.exports = validate;

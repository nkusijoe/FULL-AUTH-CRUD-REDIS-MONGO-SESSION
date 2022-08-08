const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  //creates a copy of req.query
  let reqQuery = { ...req.query };

  //create a list of fields to exclude from the query
  let excludeFields = ["select", "sort", "page", "limit"];

  excludeFields.map((field) => delete reqQuery[field]);

  //creates query string
  let queryStr = JSON.stringify(reqQuery);

  //create mongodb operators
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|eq|in)\b/g,
    (match) => `$${match}`
  );
  query = model.find();

  //selects fieds
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  //sorts fields
  if (req.query.sort) {
    const sortBy = req.query.sort;
    query = query.sort(sortBy);
  }

   // paginate the resuls
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query.limit(limit).skip(startIndex);

  if (populate) {
    query = query.populate(populate);
  }

  const results = await query;

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedResults;

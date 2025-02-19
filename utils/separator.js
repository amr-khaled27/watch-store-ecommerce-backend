function separatorMiddleware(req, res, next) {
  console.log(`\n###\n`);
  next();
}

export default separatorMiddleware;

const { callApiTemplate } = require("./template");

exports.getProductByTitle = ({ title }) => {
  const options = {
    uri: `${process.env.BASE_URL}/api/v1/products`,
    qs: { title, limit: 8 },
    method: "GET",
  };
  return callApiTemplate(options);
};

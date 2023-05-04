import template from "./template.js";

const getProductByTitle = (title) => {
  const options = {
    uri: `${process.env.BASE_URL}/api/v1/products`,
    qs: { title, limit: 8 },
    method: "GET",
  };
  return template.callApiTemplate(options);
};

export default { getProductByTitle };

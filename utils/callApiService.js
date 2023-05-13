import template from "./template.js";

const getProductByTitle = async (title) => {
  const options = {
    uri: `${process.env.BASE_URL}/api/v1/products`,
    qs: { title, limit: 8, sort: "-createdAt" },
    method: "GET",
  };
  try {
    return await template.callApiTemplate(options);
  } catch (error) {
    console.log("error-call-api", error);
  }
};

export default { getProductByTitle };

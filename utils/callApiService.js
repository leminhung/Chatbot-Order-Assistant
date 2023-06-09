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

const getNearestOrderByPhoneNumber = async (phone) => {
  const options = {
    uri: `${process.env.BASE_URL}/api/v1/phone/order`,
    qs: {
      phone: phone,
    },
    method: "GET",
  };
  try {
    return await template.callApiTemplate(options);
  } catch (error) {
    console.log("error-call-api", error);
  }
};

const getTopOutstandingProducts = async () => {
  const options = {
    uri: `${process.env.BASE_URL}/api/v1/products`,
    qs: {
      limit: 8,
      sort: "-quantity_purchased",
    },
    method: "GET",
  };
  try {
    return await template.callApiTemplate(options);
  } catch (error) {
    console.log("error-call-api", error);
  }
};

export default {
  getProductByTitle,
  getNearestOrderByPhoneNumber,
  getTopOutstandingProducts,
};

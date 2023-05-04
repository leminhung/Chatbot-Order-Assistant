import request from "request";

// Sends response messages via the Send API
const callSendAPI = async (sender_psid, response) => {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };
  let infoRes = {
    uri: "https://graph.facebook.com/v2.6/me/messages",
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: "POST",
    json: request_body,
  };
  // Send the HTTP request to the Messenger Platform
  request(infoRes, (err, res, body) => {
    if (!err) {
      console.log("message sent!");
    } else {
      console.error("Unable to send message:" + err);
    }
  });
};

// latest news
let handleGetNews = (sender_psid) => {
  let response = {
    text: `Hi, I'm Maya😊, who help you to 🔎 the information about the product(menu 👇)
      \n😍 Top outstanding products (press 1) 🔥 
      \n🚀 Top latest products (press 2) 🔥
      \n😇 Let order some items (press 3) 🔥
      \n👟 Search product by name (Adidas,...)
    `,
  };
  return new Promise(async (resolve, reject) => {
    try {
      await callSendAPI(sender_psid, response);
      resolve("done!");
    } catch (error) {
      console.log("[err--]", error);
      reject(error);
    }
  });
};
export default {
  callSendAPI,
  handleGetNews,
};

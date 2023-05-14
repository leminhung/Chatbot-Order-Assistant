import request from "request";
import chatbotServices from "../services/chatbot.js";
// import { templateProductInfo } from "../utils/template.js";
import { checkDirtyWord } from "../utils/checkDirtyWord.js";
import callApiService from "../utils/callApiService.js";
import template from "../utils/template.js";

const OUTSTANDING_PRODUCTS_ROUTE = process.env.OUTSTANDING_PRODUCTS_ROUTE;
const ORDER_ITEMS_ROUTE = process.env.ORDER_ITEMS_ROUTE;
const LATEST_PRODUCTS_ROUTE = process.env.LATEST_PRODUCTS_ROUTE;

const REGEX_CHECK_PHONE_NUMBER = /([+][1-9]{2,}|0[3|5|7|8|9])+([0-9]{8})\b/g;
const REGEX_CHECK_CONTAIN_PHONE_NUMBER = /[0-9]{7}/;

const getHomePage = (req, res, next) => {
  res.render("homepage");
};

const getWebhook = (req, res, next) => {
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
};

const postWebhook = (req, res, next) => {
  let body = req.body;

  if (body.object === "page") {
    body.entry.forEach(function (entry) {
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log("Sender PSID: " + sender_psid);

      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });
    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
};

// handle received message
const handleMessage = async (sender_psid, received_message) => {
  let messageText = received_message.text?.toLowerCase().trim();
  let response = { text: "" },
    text;

  console.log(
    "------------------------------------------------------------------------------------------------------------------------------------------------------"
  );
  console.log("yourInput--", messageText);
  console.log(
    "------------------------------------------------------------------------------------------------------------------------------------------------------"
  );

  // check dirty word
  const { inValid, dirtyWord } = checkDirtyWord(messageText);
  if (inValid) {
    response = {
      text: `Your chat contains impolite words like "${dirtyWord}" 😒😒, please use the polite word possible 😘`,
    };
    chatbotServices.callSendAPI(sender_psid, response);
    return;
  }

  let helps = ["how", "can", "help", "order", "buy", "?", "tell", "show", "me"];
  if (helps.includes(messageText)) {
    response = {
      text: `Hi 😘, you are asking about how to order products, right?
            \n👆 You can click reset chatbot in persistent menu below 💥
      `,
    };
    chatbotServices.callSendAPI(sender_psid, response);
    return;
  }
  if (REGEX_CHECK_CONTAIN_PHONE_NUMBER.test(messageText)) {
    // check valid phone number
    response = {
      text: `😘`,
    };
    chatbotServices.callSendAPI(sender_psid, response);
    return;
  }

  let check = ["1", "2", "getstarted"].includes(messageText);
  if (!check) {
    // handle search product by name
    let result = await callApiService.getProductByTitle(messageText);

    console.log("getProductByTitle", result.data);

    // searching text
    response.text = "🤔 Searching....";
    chatbotServices.callSendAPI(sender_psid, response);

    // no have product
    if (result.data.length === 0) {
      response.text = `Ohh, there is no product with name "${messageText}" 😭😭😭. Please 🔎 product's name that outstanding in shop(Adidas,...)😂😂😂`;
      chatbotServices.callSendAPI(sender_psid, response);
      return;
    }

    // have product
    response = template.template(result.data);
  } else if (messageText === "1") {
    // response = await getResult(OUTSTANDING_PRODUCTS_ROUTE);
  } else if (messageText === "2") {
    // response = await getResult(LATEST_PRODUCTS_ROUTE);
  }

  response.text = text || "";

  chatbotServices.callSendAPI(sender_psid, response);
};

const handlePostback = async (sender_psid, received_postback) => {
  // Get the payload for the postback
  let payload = received_postback.payload;
  let response;

  // Set the response based on the postback payload
  switch (payload) {
    case "RESET_BOT":
    case "GET_STARTED":
    case "BACK_TO_MAIN_MENU":
      await chatbotServices.handleGetNews(sender_psid);
      break;
    case "ORDER_INSTRUCTION":
      response = {
        text: `Sure, you can follow by some steps below:
                     \n👆 Select product in home page 💥
                     \n✌️ Click icon 🛒
                     \n👌 Click "Process to checkout" -> "Place order" 💥
                     \n🖖 Fill in Stripe form -> Order 🚀
                     `,
      };
      chatbotServices.callSendAPI(sender_psid, response);
      break;
    default:
      response = {
        text: "I don't know what you mean 🤔, please type meaningful keyword 😭😭😭",
      };
      chatbotServices.callSendAPI(sender_psid, response);
      break;
  }
};

const setUpProfile = async (req, res) => {
  // Construct the message body
  let request_body = {
    get_started: { payload: "GET_STARTED" },
    whitelisted_domains: ["https://friendly-chatbot.onrender.com/"],
  };
  let infoRes = {
    uri: `https://graph.facebook.com/v13.0/me/messenger_profile?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: "POST",
    json: request_body,
  };
  // Send the HTTP request to the Messenger Platform
  await request(infoRes, (err, res, body) => {
    if (!err) {
      console.log("Setup profile successed!");
    } else {
      console.error("Unable to setup profile successed:" + err);
    }
  });
  return res.send("Setup profile successed!");
};

const setUpPersistentMenu = async (req, res, next) => {
  console.log("RESPersistentMenu--", req);
  let request_body = {
    persistent_menu: [
      {
        locale: "default",
        composer_input_disabled: false,
        call_to_actions: [
          {
            type: "web_url",
            title: "Contact to Hưng via facebook",
            url: "https://www.facebook.com/leminh.hung.9256/",
          },
          {
            type: "web_url",
            title: "Github Lê Minh Hưng",
            url: "https://github.com/leminhung",
          },
          {
            type: "postback",
            title: "Reset conversation now",
            payload: "RESET_BOT",
          },
          {
            type: "web_url",
            title: "Leave infor so we can contact you",
            url: "https://github.com/leminhung",
            webview_height_ratio: "full",
            messenger_extensions: true,
          },
        ],
      },
    ],
  };
  let infoRes = {
    uri: `https://graph.facebook.com/v12.0/me/messenger_profile?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: "POST",
    json: request_body,
  };

  await request(infoRes, (err, res, body) => {
    if (!err) {
      console.log("Setup persistent menu successfully!");
    } else {
      console.error("Unable to setup persistent menu:" + err);
    }
  });
  return res.send("Setup persistent menu!");
};

export default {
  getHomePage,
  getWebhook,
  postWebhook,
  setUpProfile,
  setUpPersistentMenu,
};

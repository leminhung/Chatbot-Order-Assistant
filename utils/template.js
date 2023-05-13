import request from "request";
const template = (arr) => {
  let arrElements = [],
    client_url = "https://footcapp.netlify.app";
  let defaultDes =
    "This shoes upper is made with a high-performance yarn which contains at least 50% Parley Ocean Plastic — reimagined plastic waste";

  arr.map((v) => {
    arrElements.push({
      title: v.title,
      subtitle: `${v.description ? v.description : defaultDes}`,
      image_url: `${client_url}${
        v.assets.length > 0 ? v.assets[0].filename : "/images/product-6.jpg"
      }`,
      buttons: [
        {
          type: "web_url",
          url: client_url,
          title: "View detail",
        },
        {
          type: "postback",
          title: "How to order",
          payload: "ORDER_INSTRUCTION",
        },
      ],
    });
  });
  return {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        image_aspect_ratio: "square",
        elements: arrElements,
      },
    },
  };
};

const templateProductInfo = (
  location = "updating...",
  total = "updating...",
  deaths = "updating...",
  today = "updating...",
  recovered = "updating...",
  data = ""
) => {
  if (data === "") {
    return "I don't know what you are typing, please read menu above 👆 and try typing again 😅";
  }
  return `-----------------${location.toUpperCase()}-------------------
                     \n😱 Total cases: ${total} cases
                     \n😢 Deaths: ${deaths} cases
                     \n🤧 Today: ${today} cases
                     \n⛅ Recovered: ${recovered} cases
                     `;
};

const callApiTemplate = (options) => {
  return new Promise((resolve, reject) => {
    request(options, async (err, res, body) => {
      if (!err) {
        let response = await JSON.parse(body);
        resolve(response);
      } else {
        console.error("Unable to send message:" + err);
        reject(err);
      }
    });
  });
};

export default { template, templateProductInfo, callApiTemplate };

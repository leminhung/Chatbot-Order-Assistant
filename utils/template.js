const template = (arr) => {
  let arrElements = [];

  arr.map((v) => {
    arrElements.push({
      title: v.title,
      subtitle: "Nguồn: Báo dân trí",
      image_url: v.imageUrl,
      buttons: [
        {
          type: "web_url",
          url: v.link,
          title: "XEM THÊM",
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
import request from "request";

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
        console.log("res--", response);
        resolve(response.response);
      } else {
        console.error("Unable to send message:" + err);
        reject(err);
      }
    });
  });
};

export default { template, templateProductInfo, callApiTemplate };

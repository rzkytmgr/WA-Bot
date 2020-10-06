// import module
const axios = require("axios");

// covid info function
async function getCovidInfo(countryCode = "") {
  let data;

  const APIUrl = `https://covid19.mathdro.id/api/${
    countryCode !== "" ? "countries/" + countryCode : ""
  }`;

  try {
    let result = await axios.get(APIUrl);
    data = result.data;
  } catch {
    console.log(`[ERR] ${err}`);
  }

  return data;
}

function showCovidInfo(data) {
  return `
📣 Data Kasus Terbaru Covid-19 di *${
    data.name ? data.name.toUpperCase() : "Dunia"
  }*

Terkonfirmasi : *${data.confirmed}* Jiwa
Sembuh         : *${data.recovered}* Jiwa
Meninggal      : *${data.deaths}* Jiwa

Selalu jaga kesehatan dan ikuti protokol kesehatan yang berlaku! 😷
        `;
}

exports.getCovidInfo = getCovidInfo;
exports.showCovidInfo = showCovidInfo;

const axios = require("axios");

exports.getGombal = async () => {
    const getWords = await axios.get("https://api-neraka.vercel.app/api/bucin");
    const result = getWords.data.result;
    const { kata } = result;
    return kata;
};

exports.getGay = async () => {
    const getPercentage = await axios.get("https://api-neraka.vercel.app/api/gay");
    const result = getPercentage.data.result;
    return result;
}
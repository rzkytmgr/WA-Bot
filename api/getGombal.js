const axios = require("axios");

exports.getGombal = async () => {
    const getWords = await axios.get("https://api-neraka.vercel.app/api/bucin");
    const result = getWords.data.result;
    const { kata } = result;
    return kata;
};

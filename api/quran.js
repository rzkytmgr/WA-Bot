// import axios
const axios = require("axios");

async function getQuran(surah, ayat) {
    const APIURL = `https://api.banghasan.com/quran/format/json/surat/${surah}/ayat/${ayat}`;

    let quranData;

    await axios
        .get(APIURL)
        .then((res) => {
            quranData = res.data;
        })
        .catch((err) => {
            console.log(`[ERR] Fetching Data Quran!`, err);
        });

    return quranData;
}

exports.showQuranInfo = function (data) {
    return `
*Q.S ${data.nama}* (${data.arti}) - *${data.asma}* [${data.urut}]

${data.ayat.teks}

*Artinya :* ${data.ayat.arti}
        `;
};
exports.getQuran = getQuran;

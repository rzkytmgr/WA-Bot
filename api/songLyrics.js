// solenolyrics module
const solenolyrics = require('solenolyrics');
const { requestLyricsFor } = require('solenolyrics');

exports.getLyrics = async (requestLyrics) => {

        const author = await solenolyrics.requestAuthorFor(requestLyricsFor);
        const title = await solenolyrics.requestTitleFor(requestLyrics);
        const lyrics = await solenolyrics.requestLyricsFor(requestLyrics);

        console.log(`[INFO] Request Song Lyrics ${author} - ${title}`);

        let show = `
🎵 *${author} - ${title}*
-
${lyrics}
        `

        return {lyrics, show};
}
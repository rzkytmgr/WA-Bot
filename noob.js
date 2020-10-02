// import { create, Client } from '@open-wa/wa-automate';
const wa = require('@open-wa/wa-automate');
const axios = require('axios');

wa.create({
        headless: false,
        useChrome: true,
        executablePath: '/usr/bin/google-chrome-stable'
}).then(client => start(client));

function start(client) {
  client.onMessage(async message => {
        let text = message.body.split(' ');
        
        // Perintah menu
        if(text[0] === '!perintah') {
                client.sendText(message.from, `
😸📢 Command/Perintah Bot :

📌 Umum :
*!ping* - Mention semua member yang ada di grup. 
*!covid* - Dapatkan data kasus Covid-19 terbaru.
*!voice* - Konversi dari teks ke Voice note. _(New Feature)_
*!stiker* - Konversi Gambar menjadi stiker. _(New Feature)_
*!18* - Konten dewasa. _(New Feature)_

📌 Muslim :
*!quran* - Dapatkan bacaan ayat dan arti dari satu surah.
*!sholat* - Dapatkan Jadwal Sholat.

📓 _Note:_ Gunakan bot dengan bijak, hal-hal yang melanggar hukum yang dilakukan user *BUKAN TANGGUNG JAWAB* kami (Developer).
Terima Kasih,

☎️ Contact/Support :
Hubungi kami jika menemukan Error atau perintah yang tidak bekerja
Instagram : *@rzkytmgrr*

📢 Shout Out/Thanks to:
*@myau.myaw* , *@abdulcapah* , *@efrin_pinem1*

💳 Donasi :
Trakteer saya secangkir cendol 🥤 di *https://trakteer.id/rzkytmgr*
                `)
        } 

        // cek resi
        else if(text[0] === '!track') {
                const APIKEY = '7ba4cb6b15c2e413b45100e1bdb4207d193809bff13004ff466b6e24dd15ce7b';

                function checkPrefix(prefix) {
                        let allPrefix = ["pos", "jnt", "sicepat", "tiki", "anteraja", "wahana", "ninja", "lion"];
                        return allPrefix.filter(res => res === prefix).toString();
                }

                if(text[1]) {
                        
                }
        }

        // Ping get all members
        else if(text[0] === '!ping' || text[0] === '!p') {
                if(message.isGroupMsg) {
                        let groupId = message.from
                        // console.log(message)
                        await client.tagEveryone(groupId).then(res => {
                                console.log(res, ' ?')
                        }).catch(err => {
                                console.log(`err: ${err}`)
                        })
                } else {
                        console.log('no grup')
                }
        }
        
        // Voice note dari translate google
        else if(text[0] === '!voice') {
                // VOICE NOTE GOOGLE TRANSLATE
                let bahasa = message.body.split(' ').slice(1, 2)[0]
                let textArr = message.body.split(' ').slice(2).toString().replace(/,/g, ' ');
                client.sendFileFromUrl(message.from, `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${bahasa}&q=${textArr}`).then(() => {
                        console.log('Done!')
                }).catch((err) => {
                        client.sendText(message.from, '*!voice [kode bahasa] [kalimat]*')
                });
        }
        
        // Covid command dari API
        else if(text[0] === '!covid') {
                // COVID DATA
                let covidData = {};
                if(text[1]) {
                        axios.get(`https://covid19.mathdro.id/api/countries/${text[1]}`).then(res => {
                                let data = res.data;

                                covidData.conf = data.confirmed.value;
                                covidData.reco = data.recovered.value;
                                covidData.deat = data.deaths.value;
                                
                                client.sendText(message.from, `
😷 Data Covid dari kode negara *${text[1].toUpperCase()}*
Terkonfirmasi : *${covidData.conf}* Jiwa
Sembuh         : *${covidData.reco}* Jiwa
Kematian       : *${covidData.deat}* Jiwa

!covid (untuk melihat secara global) 📣
${text[1].toLowerCase() === 'id' ? 'Indonesia Juara 🏆 kwkwwkwkwk!' : ''}
                                `)
                        })
                } else {
                        axios.get(`https://covid19.mathdro.id/api/`).then(res => {
                                let data = res.data;

                                covidData.conf = data.confirmed.value;
                                covidData.reco = data.recovered.value;
                                covidData.deat = data.deaths.value;
                                client.sendText(message.from, `
😷 Data Covid Keseluruhan *Didunia*
Terkonfirmasi : *${covidData.conf}* Jiwa
Sembuh         : *${covidData.reco}* Jiwa
Kematian       : *${covidData.deat}* Jiwa

Tetap jaga kesehatan! 😷📣
                                `)
                        })
                }
        }
        
        // Stiker maker
        else if(text[0] === '!stiker' || text[0] === '!sticker' || message.caption === '!stiker' || message.caption === '!sticker') {
                if(message.caption) {
                        if(message.type === 'image') {
                                if(message.caption === '!stiker' || message.caption === '!sticker') {
                                        client.sendImageAsSticker(message.from, `data:${message.mimetype};base64,${message.content}`)
                                        client.sendText(message.from, 'capek gua jadi bot anj, disuruh suruh');
                                }
                        }
                }

                if(!message.caption) {
                        if(text[1]) {
                                client.sendStickerfromUrl(message.from, text[1]).then(res => console.log("Done!")).catch(err => {
                                        client.sendText(message.from, 'Yang valid dong urlnya!')
                                })
                        } else {
                                client.sendText(message.from, 'Masukkan URL/ URL VALID');
                        }
                }
        }

        // Quran
        else if(text[0] === '!quran') {
                if(text[1] === 'list') {

                } 


                if(isNaN(Number(text[1])) === false) {
                        if(text[2]) {
                                axios.get(`https://api.banghasan.com/quran/format/json/surat/${text[1]}/ayat/${text[2]}`)
                                .then(resp => {
                                        let data = resp.data;

                                        if(data.status === 'ok') {
                                                let dataAyat = data.ayat.data;
                                                let detailAyat = {
                                                        ayat: dataAyat.ar[0].teks,
                                                        arti: dataAyat.id[0].teks,
                                                        nama: data.surat.nama,
                                                        asma: data.surat.asma,
                                                        artiSurah: data.surat.arti
                                                }

                                                client.sendText(message.from, `
*${detailAyat.nama} [${text[1]}:${text[2]}]* _(${detailAyat.artiSurah})_ *- ${detailAyat.asma}*

${detailAyat.ayat} 

*Artinya:* ${detailAyat.arti}
                                                `)
                                        }
                                })
                                .cathc(err => console.log(err))
                        }
                }
        }

        // 18+
        else if(text[0] === '!18') {
                client.sendText(message.from, `
Dengan jelas Islam telah mewajibkan kepada kaum mukmin laki-laki dan kaum mukmin perempuan untuk menjaga pandangannya dari hal-hal yang diharamkan oleh Syara’. Allah swt Berfirman, yang artinya:

“Katakanlah kepada orang laki-laki yang beriman: Hendaklah mereka menahan pandanganya, dan memelihara kemaluannya; … Katakanlah kepada wanita yang beriman: Hendaklah mereka menahan pandangannya, dan kemaluannya, dan janganlah mereka Menampakkan perhiasannya, kecuali yang (biasa) nampak dari padanya. …” (QS. An-Nur [24]: 30-31)

Tobat!
                `)
        }

  });
}
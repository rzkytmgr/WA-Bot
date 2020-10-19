// import module from node module
const wa = require("@open-wa/wa-automate");

// import menu languages
const { menuId, botInfoId, gmenuId } = require("./lang/menuLang");

// import all api from api folder
const { getCovidInfo, showCovidInfo } = require("./api/covidInfo");
const { getQuran, showQuranInfo } = require("./api/quran");
const { getLyrics } = require("./api/songLyrics");
const { getGombal, getGay } = require("./api/getGombal");

// import helper function from helper folder
const { langCheck } = require("./helpers/helperFunction");
const { decryptMedia } = require("@open-wa/wa-automate");

const configObject = {
    chromiumArgs: ["--no-sandbox"],
    disableSpins: true,
    authTimeout: 0,
    headless: true,
    // useChrome: true,
    // executablePath: "/usr/bin/google-chrome-stable",
};

const ops = process.platform;
if (ops === "win32" || ops === "win64") configObject["executeablePath"] = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
else if (ops === "linux") configObject["executeablePath"] = "/usr/bin/google-chrome-stable";
else if (ops === "darwin") configObject["executeablePath"] = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// create whatsapp client
wa.create(configObject).then((client) => FnBot(client));

function FnBot(client) {
    client.onAnyMessage(async (message) => {
        const { chat, from, id, body } = message;

        if (!chat.isGroup && body[0] !== "!") client.reply(from, `Hai, Saya asisten kami ketik *!info* untuk menampilkan info bot dan ketika *!menu* untuk menampilkan perintah yang dimiliki bot terima kasih 😼`, id);
    });

    // client event when the client recieved a message
    client.onMessage(async (message) => {
        // declared object variable from message object
        const { id, author, from, body, caption, chat, sender, isGroup, groupMetadata } = message;
        const senderId = sender.id.split("@")[0];

        // declared text/command from message recieve
        let command, name, pesan, args, isAdmin, allAdmins;
        caption ? (command = caption) : (command = body);
        body[0] === "!" ? "" : (command = 0);

        if (command.trim().split(" ")[1]) args = command.trim().split(" ")[1];

        if (chat.isGroup) {
            // function checkadmin
            const checkAdmin = (number, admins) => {
                let isAdmin = admins.filter((res) => (res === number ? true : false));
                return isAdmin.toString();
            };

            allAdmins = await client.getGroupAdmins(from);
            checkAdmin(author, allAdmins) !== "" ? (isAdmin = true) : (isAdmin = false);

            switch (command.trim().split(" ")[0].slice(1)) {
                case "grevoke":
                    if (isAdmin) {
                        client
                            .revokeGroupInviteLink(from)
                            .then((res) => {
                                client.reply(from, `Berhasil Revoke Grup Link gunakan *!ginvitelink* untuk mendapatkan group invite link yang terbaru`, id);
                            })
                            .catch((err) => {
                                console.log(`[ERR] ${err}`);
                            });
                    }
                    break;

                case "join":
                    if (args) {
                        client.joinGroupViaLink(args);
                        console.log("[JOIN] BOT JOINED TO A GROUP");
                    }
                    break;

                case "ginvitelink":
                    client
                        .getGroupInviteLink(from)
                        .then((res) => {
                            client.reply(from, `Request Invite Link!\n*Link :* ${res}`, id);
                        })
                        .catch((err) => {
                            console.log(`[ERR] ${err}`);
                        });
                    break;

                case "gleave":
                    client
                        .removeParticipant(chat.groupMetadata.id, author)
                        .then(() => console.log("Success leave"))
                        .catch((err) => {
                            console.log(`[ERR] Kemungkinan nomor ini tidak member, atau bot tidak admin`);
                        });
                    break;

                case "gadmins":
                    client.getGroupAdmins(from).then((res) => {
                        let admins = res.map((admin) => `@${admin.split("@")[0]}`);
                        client.sendTextWithMentions(from, `🐨 *List seluruh Admin Grup :*\n\n${admins.join("\n")}`);
                    });
                    break;

                case "gmenu":
                    client.sendTextWithMentions(from, `Hai @${senderId},\n\n${gmenuId}`);
                    break;

                case "gstat":
                    console.log("gstat");
                    let groupData = {
                        owner: chat.groupMetadata.owner.split("@")[0],
                        name: chat.name,
                        cMember: chat.groupMetadata.participants.length,
                        desc: chat.groupMetadata.desc,
                    };
                    const { owner, name, cMember, desc } = groupData;
                    client.sendTextWithMentions(from, `Hai @${senderId} Selamat Datang 👋!\n🐻 *Tentang Group*\n\n*Nama Group* : ${name}\n*Owner* : @${owner}\n*Total Member* : ${cMember}\n*Deskripsi* : \n${desc}\n\nTerima Kasih,\nGunakan Command *!gmenu* untuk membuka semua perintah bot pada grup ini. 🦧`, id);
                    break;

                case "gadd":
                    if (args && isAdmin) {
                        if (args[0] === "0") {
                            args = args.split("");
                            args.splice(0, 1, 62);
                            args = args.join("");
                        }
                        client
                            .addParticipant(chat.groupMetadata.id, args + "@c.us")
                            .then((res) => {
                                client.sendTextWithMentions(from, `@${args} Berhasil Ditambahkan!`);
                            })
                            .catch((err) => {
                                console.log("[ERR] Nomor tidak ditemukan! atau bot tidak admin");
                            });
                    }
                    break;

                case "gkick":
                    if (args && isAdmin) {
                        let finalNumber = args;
                        if (args[0] === "@") finalNumber = args.slice(1);
                        client
                            .removeParticipant(chat.groupMetadata.id, finalNumber + "@c.us")
                            .then((res) => {
                                client.sendTextWithMentions(from, `${args} Berhasil dikirim keneraka!`);
                            })
                            .catch((err) => {
                                console.log(`[ERR] Kemungkinan nomor ini tidak member, atau bot tidak admin`);
                            });
                    }
                    break;

                case "gpromote":
                    if (args && isAdmin) {
                        let finalNumber = args;
                        if (args[0] === "@") finalNumber = args.slice(1);
                        client
                            .promoteParticipant(chat.groupMetadata.id, finalNumber + "@c.us")
                            .then((res) => {
                                client.sendTextWithMentions(from, `${args} Telah di Promote menjadi Admin!`);
                            })
                            .catch((err) => {
                                console.log(`[ERR] Kemungkinan nomor ini tidak member, atau bot tidak admin`);
                            });
                    }
                    break;

                case "gdemote":
                    if (args && isAdmin) {
                        let finalNumber = args;
                        if (args[0] === "@") finalNumber = args.slice(1);
                        client
                            .demoteParticipant(chat.groupMetadata.id, finalNumber + "@c.us")
                            .then((res) => {
                                client.sendTextWithMentions(from, `${args} Telah di Demote dari Admin!`);
                            })
                            .catch((err) => {
                                console.log(`[ERR] Kemungkinan nomor ini tidak member, atau bot tidak admin`);
                            });
                    }
                    break;

                case "p":
                case "ping":
                    if (chat.isGroup) {
                        client
                            .getGroupMembers(chat.groupMetadata.id)
                            .then((res) => {
                                let allMembersId = res.map((member) => `*@${member.id.split("@")[0]}*\n`);
                                let finalResult = allMembersId.join("");
                                client.sendTextWithMentions(from, `Summon no jutsu!\n\n${finalResult}\nFollow Instagram Developer *@rzkytmgrr* untuk info Update-an terbaru tentang Bot!`);
                            })
                            .catch((err) => console.log(err));
                    } else {
                        client.sendText(from, "Only Group!");
                    }
                    break;
            }
        } else {
            client.reply(`Sorry ya bang abang buat commandnya tidak di group, ini perintah hanya bisa dijalankan di grup.\nJika ada pertanyaan bisa tanyakan lewat instagram *@rzkytmgrr* makasih bang!`);
        }

        // conditional (switch), what will bot do
        switch (command.trim().split(" ")[0].slice(1)) {
            case "info":
                client.sendTextWithMentions(from, `Hai, *@${senderId}*\n${botInfoId}`, id);
                break;

            //  menu command section, will show all commands
            case "menu":
            case "command":
            case "perintah":
                client.reply(from, `Hai,${menuId}`, id);
                break;

            // voice command section, will make a request to google translate API and recieved voice data.
            case "voice":
                // get country language code
                if (body.split(" ").slice(1, 2).toString()) {
                    let lang = body.split(" ").slice(1, 2).toString();
                    lang = langCheck(lang);

                    let text = body.split(" ").slice(2).toString().replace(/,/g, " ");
                    if (lang === undefined) {
                        lang = "id";
                        text = body.split(" ").slice(1).toString().replace(/,/g, " ");
                    }

                    client
                        .sendFileFromUrl(from, `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${text}`, "voice", "voice chat", id)
                        .then((res) => console.log(`[INFO] ${from} Send Voice From google`))
                        .catch((err) => {
                            console.log(`[ERR] ${from} Failed sending voice note `);
                            client.reply(from, "Pengambilan Voice Gagal. Coba lagi! 🤖", id);
                        });
                } else {
                    // when there is no country language code
                    console.log(`[FAIL] ${from} Should input Language country code`);
                    client.reply(from, `*Pastikan anda memasukan kode Bahasa dan Pesan yang ingin di konversi ke voice!* 🤖`, id);
                }
                break;

            // covid command section, will show informationa about covid
            case "covid":
                let countryCode = body.split(" ").slice(1, 2).toString();
                let covidDataResult = {};
                getCovidInfo(`${countryCode !== "" ? countryCode : ""}`)
                    .then((res) => {
                        covidDataResult = {
                            confirmed: res.confirmed.value,
                            recovered: res.recovered.value,
                            deaths: res.deaths.value,
                        };
                        if (countryCode !== "") covidDataResult.name = countryCode;
                        console.log(`[OK] ${from} request Covid Info`);
                        client.reply(from, showCovidInfo(covidDataResult), id);
                    })
                    .catch((err) => {
                        console.log(`[ERR] ${from} Error when Request Covid Info`);
                    });
                break;

            // quran command section, will show ayah and surat.
            case "quran":
                let quranData = {},
                    inpSurah = body.split(" ").slice(1)[0].toString(),
                    inpAyat = body.split(" ").slice(2).toString();
                getQuran(inpSurah, inpAyat)
                    .then((res) => {
                        let ayat = res.ayat.data,
                            info = res.surat;

                        quranData = {
                            ayat: {
                                teks: ayat.ar[0].teks,
                                arti: ayat.id[0].teks,
                            },
                            nama: info.nama,
                            asma: info.asma,
                            arti: info.arti,
                            urut: `${inpSurah}:${inpAyat}`,
                        };

                        client.reply(from, showQuranInfo(quranData), id);
                        console.log(`[OK] ${from} Recieved Quran Data!`);
                    })
                    .catch((err) => {
                        console.log(`[ERR] ${from} Input Wrong Surat/Ayah`, err);
                    });
                break;

            // sticker command section, will convert from image to sticker
            case "sticker":
            case "stiker":
                const { mimetype } = message;
                if (mimetype) {
                    const mediaData = await decryptMedia(message);
                    const b64 = `data:${mimetype};base64,${mediaData.toString("base64")}`;
                    await client
                        .sendImageAsSticker(from, b64)
                        .then((res) => console.log("Sticker Send"))
                        .catch((err) => console.log("Failed send sticker, Error: ", err));
                }
                break;

            // song lyrics command section, will send response lyrics
            case "lirik":
            case "lyrics":
                if (body.split(" ").slice(1)) {
                    const query = body.split(" ").slice(1).join(" ").toString();
                    const songData = await getLyrics(query);

                    if (songData.lyrics !== undefined) {
                        client.reply(from, `*@${senderId}* lirik yang kamu request\n${songData.show}`, id);
                        console.log(`[INFO] ${from} Recieved the lyrics`);
                    } else {
                        client.reply(from, `*@${senderId}* Pastikan kamu memasukkan Judul yang benar! 🤖`, id);
                        console.log(`[FAIL] ${from} Failed recieve the lyrics`);
                    }
                } else {
                    client.reply(from, `Pastikan kamu memasukkan Judul lagu! 🤖`, id);
                    console.log(`[FAIL] ${from} Need Song Title`);
                }
                break;

            case "mirip":
                name = "*" + body.trim().split(" ").slice(1).toString().replace(/,/g, " ") + "*";
                let mirip = ["Mang Oleh", "Monyet", "Biawak", "Buaya", "Ngeteh Asw", "Mang Garox", "Yang Lek", "Uzumaki Bayu"];
                random = Math.floor(Math.random() * (mirip.length - 1) + 1);
                client.reply(from, `${name} mirip dengan ${mirip[random]}`, id);
                break;

            case "gay":
                name = "*" + body.trim().split(" ").slice(1).toString().replace(/,/g, " ") + "*";
                const { percentage, desc } = getGay();
                client.reply(from, `Tingkat Gay ${name} ${percentage}% ${desc}`);
                break;

            case "bucin":
            case "gombal":
                client.reply(from, await getGombal(), id);
                break;
        }
    });

    // client event when, the client/bot added to a group
    client.onAddedToGroup(async (message) => {
        const { id } = message;

        client.sendText(message.id, menuId);
        console.log(`[INFO] Bot success added to group! Group Id ${id}`);
    });

    // client event when, someone join or left from a group where client/bot at
    client.onGlobalParicipantsChanged(async (message) => {
        const { action, who, chat } = message;

        if (action === "add") {
            console.log(`[INFO] Added ${who} to ${chat}`);
            client.sendTextWithMentions(chat, `Selamat datang *@${who.split("@")[0]}* Di Grup! Selalu patuhi rules agar selamat dunia akhirat 🐼\n*!menu* untuk membuka perintah bot`);
        } else {
            console.log(`[INFO] Kicked ${who} from ${chat}`);
            client.sendTextWithMentions(chat, `*@${who.split("@")[0]}* Telah Meninggalkan Grup! Selalu patuhi rules agar selamat dunia akhirat 🐧`);
        }
    });
}

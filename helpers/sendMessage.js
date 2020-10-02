// helper function message to develoepr function
const fs = require('fs');

exports.sendMessage = async (name, number, message) => {
        const format = `
${name} - ${number}
→ ${message}
        `

        fs.appendFile('./tmp/message.txt', fromat, 'utf8', err => {
                if(err) throw err;

                console.log('[OK] Succed Sent a Message!')
        })
}
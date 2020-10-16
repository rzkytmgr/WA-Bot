// language checker
const langCheck = (lang) => {
    let allLanguages = [
        "id", // indonesia
        "en", // english
        "ar", // arabic
        "th", // thailand
        "ja", // japan
        "es", // spain
        "fr", // french
        "de", // deutch
        "ru", // russia
        "it", // italy
        "ca", // canada
        "nl", // netherland
        "tr", // turk
        "la", // latin
        "pl", // poland
        "af", // africa
        "sw", // sweden
        "jw", // jawa
        "su", // sunda
    ];

    return allLanguages.find((res) => res === lang);
};

exports.langCheck = langCheck;

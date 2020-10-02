// language checker
const langCheck = lang => {
        let allLanguages = [
                'id',
                'en',
                'ar'
        ];

        return allLanguages.find(res => res === lang);
}



exports.langCheck = langCheck;
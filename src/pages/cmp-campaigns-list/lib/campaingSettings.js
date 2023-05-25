function getTextAfterWord(word) {
    let currentURL = window.location.href;
    // возвращает текст после заданного слова в адресной строке, не обращая внимание на s'/'
    return currentURL.split('/')[currentURL.split('/').indexOf(word) + 1];
}

function getCookiesValue(key) {
    let cookies = document.cookie;
    let cookiesString = cookies.split(';');
    let keyValueArray = cookiesString.map((item) => item.split('='));

    let searchItem = keyValueArray.find(function (item) {
        if (item[0].includes(key)) {
            return item;
        }
    });

    if (searchItem) {
        return searchItem[1];
    } else {
        return null;
    }
}

export function setCampaingSettings() {
    let afterWord = null;
    let campaign = {
        campaignId: null,
        supplierId: null,
        type: null,
    };

    if (location.href.includes('edit/carousel-auction')) {
        campaign.type = 'cmpcard';
        afterWord = 'carousel-auction';
    }
    if (location.href.includes('edit/search')) {
        campaign.type = 'cmpsearch';
        afterWord = 'search';
    }

    campaign.campaignId = getTextAfterWord(afterWord);
    campaign.supplierId = getCookiesValue('x-supplier-id-external');

    Object.keys(campaign).forEach((key) => {
        if (campaign[key] == null) {
            return setTimeout(setCampaingSettings, 1000);
        }
    });

    return campaign;
}

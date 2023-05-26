export function shouldShowPhrases(showFunc) {
    const tabsList = document.querySelector('.tabs-list');
    if (
        document.querySelector('.ng-star-inserted') &&
        document.querySelector('.ssl-panel-select-box--check') &&
        tabsList
    ) {
        if (tabsList.children.length == 1) {
            showFunc();
        }
        onPhrasesToggle(showFunc);
        onPhrasesTabs(showFunc);
    } else {
        setTimeout(() => shouldShowPhrases(showFunc), 1011);
    }
}

function onPhrasesToggle(showFunc) {
    const keywordsToggle = document.querySelectorAll('.more__text');
    keywordsToggle[0].addEventListener('click', () => {
        onPhrasesTabs(showFunc);
        const tabsList = document.querySelector('.tabs-list');
        if (!tabsList) {
            return;
        }
        if (Array.from(tabsList.children).length != 1) {
            return;
        }
        showFunc();
    });
}

function onPhrasesTabs(showFunc) {
    const tabsHead = document.querySelector('.tabs-head.ex');
    console.log('onPhrasesTabs')

    if (tabsHead) {
        Array.from(tabsHead.children)[1].addEventListener('click', () => {
            console.log('onPhrasesTabs click')
            const tabsList = document.querySelector('.tabs-list');
            if (!tabsList) {
                return;
            }
            if (Array.from(tabsList.children).length != 1) {
                return;
            }
            showFunc();
        });
    } else {
        return setTimeout(onPhrasesTabs, 1000);
    }
}
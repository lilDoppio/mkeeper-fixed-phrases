import './phrases.css';

const Button = ({ title, id }) => {
    return `<button class="button" id="${id}">${title}</button>`;
};

async function postPhrasesList(campaignId, data) {
    const xUserId = localStorage.getItem('_wb-ads-intro-id');
    const response = await fetch(`https://cmp.wildberries.ru/backend/api/v2/search/${campaignId}/set-plus`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'X-User-Id': xUserId,
        },
        body: JSON.stringify(data),
    });
    return response.json();
}

function savePhraseInput() {
    const saveButton = document.querySelector('#mk-phrase-save');

    if (!saveButton.disabled) return;

    saveButton.disabled = false;
}

async function setPhrasesList(inputValue, campaignId) {
    const fixedPhrases = [];
    const phrasesLists = document.querySelectorAll('.ng-trigger-showView');
    Array.from(phrasesLists[1].children).forEach((child) => {
        fixedPhrases.push(child.textContent.trim());
    });

    const string = inputValue.replace('\r', '').split('\n');
    const words = string.map((item) => item.split(',')).flat();
    words.forEach((word) => fixedPhrases.push(word.trim()));

    const response = await postPhrasesList(campaignId, { pluse: fixedPhrases });
    if (response) {
        location.reload();
    }
}

function initKeywordsFilterPhrases(campaignId) {
    const openButton = document.querySelector('#open-phrase-input');
    openButton.addEventListener('click', () => {
        searchInputsContainer.style.display = 'block';
    });

    const searchInputsContainer = document.querySelector('#phrase-input-popup');
    const closeButton = document.querySelector('#mk-phrase-close');
    closeButton.addEventListener('click', () => {
        searchInputsContainer.style.display = 'none';
    });

    const searchInputs = document.querySelector('#phrase-input');
    searchInputs.addEventListener('input', () => savePhraseInput());
    searchInputsContainer.style.display = 'none';

    const saveButton = document.querySelector('#mk-phrase-save');
    saveButton.disabled = true;
    saveButton.addEventListener('click', () => {
        setPhrasesList(searchInputs.value, campaignId);

        saveButton.disabled = true;
    });
}

export function KeywordsFilterPhrases({ containerClass, campaignId }) {
    const container = document.querySelector(containerClass);
    container.style.zIndex = 1000;

    const phraseInputContainer = document.createElement('div');
    phraseInputContainer.classList.add('mk-phrase-input-container');
    phraseInputContainer.innerHTML = `
        <div class="mk-box">
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg" id="open-phrase-input"
            width="39px" height="39px" viewBox="0 0 1280.000000 1280.000000"
            preserveAspectRatio="xMidYMid meet">
                <g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)" fill="#ffb400" stroke="none">
                    <path d="M5736 12774 c-205 -55 -353 -189 -424 -384 l-27 -75 -5 -2395 -5
                    -2395 -2390 -5 c-1835 -4 -2400 -8 -2432 -18 -126 -36 -248 -118 -319 -214
                    -63 -86 -81 -124 -109 -233 l-25 -95 0 -559 c0 -529 1 -563 20 -640 51 -203
                    152 -334 326 -420 34 -17 81 -36 105 -43 35 -10 562 -14 2434 -18 l2390 -5 5
                    -2395 5 -2395 25 -70 c13 -38 47 -104 75 -145 87 -128 206 -208 374 -249 80
                    -20 110 -21 641 -21 528 0 562 1 639 20 107 27 171 56 249 114 94 70 179 196
                    214 317 10 35 14 559 18 2434 l5 2390 2390 5 c2626 6 2418 1 2546 64 166 84
                    269 218 319 417 19 77 20 111 20 639 0 528 -1 562 -20 639 -27 107 -56 171
                    -114 249 -71 96 -193 178 -319 214 -32 10 -597 14 -2432 18 l-2390 5 -5 2395
                    -5 2395 -27 75 c-51 140 -150 257 -278 328 -31 17 -99 43 -153 57 l-97 25
                    -568 -1 c-565 -1 -567 -1 -656 -25z"/>
                </g>
            </svg>
        </div>
        <div class="mk-box">
            <div id="phrase-input-popup">
                <textarea 
                    rows="5" 
                    class="mk-form-input" 
                    id="phrase-input" 
                    placeholder="Введите фиксированные фразы через запятую или каждую с новой строки"
                ></textarea>
                <div class='phrase-input-popup-tools'>
                    ${Button({
                        title: 'Закрыть',
                        id: 'mk-phrase-close',
                    })}
                    ${Button({
                        title: 'Добавить',
                        id: 'mk-phrase-save',
                    })}
                </div>
            </div>
        </div>
    `;

    container.appendChild(phraseInputContainer);

    initKeywordsFilterPhrases(campaignId);
}

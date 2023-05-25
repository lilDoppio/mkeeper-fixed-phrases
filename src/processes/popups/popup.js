const postData = async ({ url, data, headers, isReturn = true }) => {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: headers,
        body: JSON.stringify(data),
    });
    if (isReturn) return response.json();
};

const getCookies = async (domain, name) => {
    var p = new Promise(function (resolve, reject) {
        chrome.cookies.get({ url: domain, name: name }, function (cookie) {
            if (cookie) {
                resolve(cookie.value);
            } else {
                resolve('no_cookie');
            }
        });
    });

    const res = await p;
    return res;
};

(() => {
    chrome.storage.local.get(['key', 'key2', 'bot'], function (e) {
        if ('key' in e) {
            showKeyInfo(e.key, e.key2, e.bot);
        } else {
            showInputKey();
        }
    });
})();

function showInputKey() {
    gldiv = document.getElementById('mk_gldiv');
    gldiv.innerHTML = `
  <div class='div-input-key'>
    <input class='input-key' id="key" placeholder="Укажите свой ключ" name="key" />
    <button class='save'>Сохранить</button>
  </div>

  `;
    document.querySelector('.save').addEventListener('click', function () {
        var key = document.querySelector('input[name="key"]').value.trim();
        if (key === '') {
            error('Введите ключ!');
        } else {
            validKey(key);
        }
    });
}

async function showKeyInfo(key, key2, bot) {
    let panelVisibility = {};

    chrome.storage.local.get(['isSearchPanelVisible', 'isCardPanelVisible'], function (result) {
        panelVisibility['isSearch'] = result.isSearchPanelVisible != null ? result.isSearchPanelVisible : true;
        panelVisibility['isCard'] = result.isCardPanelVisible != null ? result.isCardPanelVisible : true;
    });

    chrome.storage.local.set({
        bot: true,
        key: key,
        key2: key2,
    });

    gldiv = document.getElementById('mk_gldiv');
    gldiv.innerHTML = `

        <div class='div-key'>
          <div>
            <b>${key}</b>
            <span id="mk_comment_key" style="display:block"></span>
          </div>
          <div class='del_svg'>
            <svg class="deleteBtn" id="deleteBtn" fill="none" height="24" viewBox="-2 -1 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M7 0H13C14.1046 0 15 0.89543 15 2V3H18C19.1046 3 20 3.89543 20 5V7C20 8.10457 19.1046 9 18 9H17.9199L17 20C17 21.1046 16.1046 22 15 22H5C3.89543 22 3 21.1046 3.00345 20.083L2.07987 9H2C0.89543 9 0 8.10457 0 7V5C0 3.89543 0.89543 3 2 3H5V2C5 0.89543 5.89543 0 7 0ZM2 5H5H15H18V7H2V5ZM4.08649 9H15.9132L15.0035 19.917L15 20H5L4.08649 9ZM13 2V3H7V2H13Z" fill="#4e4e53" fill-rule="evenodd"></path></svg>   
          </div>
        </div>
        <div class='settings'>
            <div class='settings-block'>
                <input type="checkbox" class="switch" id="search-panel-visibility">
                <label for="search-panel-visibility">Скрыть биддер в поиске </label>
            </div>
            <div class='settings-block'>
                <input type="checkbox" class="switch" id="card-panel-visibility">
                <label for="card-panel-visibility">Скрыть биддер в карточке</label>
            </div>
        </div>
        `;

    // <div class='settings-block'>
    //     <input type="checkbox" class="switch" id="adv-bot" checked>
    //     <label for="adv-bot">Включить рекламного робота</label>
    // </div>
    // <div data-tooltip="Включая данную опцию, вы даете согласие на предоставление доступа к вашему рекламному кабинету сервису mkeeper">
    //   <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    //   <path d="M15.5 8C15.5 12.1421 12.1421 15.5 8 15.5C3.85786 15.5 0.5 12.1421 0.5 8C0.5 3.85786 3.85786 0.5 8 0.5C12.1421 0.5 15.5 3.85786 15.5 8Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
    //   <path d="M8 4H8.01" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
    //   <path d="M8 7V12" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
    //   </svg>
    // </div>

    // document.getElementById('adv-bot').checked = bot;

    let manifestData = chrome.runtime.getManifest();
    let data = {};
    data['ver'] = manifestData.version;
    data['key'] = key;
    data['key2'] = key2;

    const result = await postData({
        url: `https://api.mkeeper.ru/Direct/hs/licenseinfo`,
        data: data,
    });

    document.getElementById('mk_comment_key').textContent = result.text;

    let deleteBtn = document.getElementById('deleteBtn');
    deleteBtn.addEventListener('click', deleteKey);
    deleteBtn.key = key;
    deleteBtn.key2 = key2;

    let searchVisibility = document.getElementById('search-panel-visibility');
    let cardVisibility = document.getElementById('card-panel-visibility');
    searchVisibility.checked = !panelVisibility.isSearch;
    cardVisibility.checked = !panelVisibility.isCard;

    const setPanelVisibility = async (campaignType) => {
        if (campaignType == 'search') {
            chrome.storage.local.set({
                isSearchPanelVisible: !searchVisibility.checked,
            });
        }
        if (campaignType == 'card') {
            chrome.storage.local.set({
                isCardPanelVisible: !cardVisibility.checked,
            });
        }
        const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        const response = await chrome.tabs.sendMessage(tab.id, { name: 'visiblitySettings' });
    };

    searchVisibility.addEventListener('change', () => setPanelVisibility('search'));
    cardVisibility.addEventListener('change', () => setPanelVisibility('card'));

    // let AdvBotCbx = document.getElementById('adv-bot');
    // AdvBotCbx.addEventListener('change', checkAdvBot);

    setCookies();
}

async function deleteKey(evt) {
    data = {};
    data['key'] = evt.currentTarget.key;
    data['key2'] = evt.currentTarget.key2;

    postData({
        url: `https://api.mkeeper.ru/Direct/hs/licensedel`,
        data: data,
        isReturn: false,
    });

    chrome.storage.local.remove('key');
    chrome.storage.local.remove('key2');
    document.querySelector('.div-key').remove();
    showInputKey();
}

function checkAdvBot() {
    let botvalue = document.getElementById('adv-bot').checked;

    chrome.storage.local.set({
        bot: botvalue,
    });
    // if (botvalue == true) {
    //     setCookiesProd();
    // }
}

function setCookies() {
    const sendCookies = async () => {
        let [WBToken_Cookie] = await Promise.allSettled([getCookies('https://seller.wildberries.ru', 'WBToken')]);

        chrome.storage.local.set(
            {
                WBToken: WBToken_Cookie.value,
            },
            function () {}
        );
    };
    sendCookies();
}

function setCookiesProd() {
    const sendCookies = async () => {
        let [WBTokenCMP_Cookie, um] = await Promise.allSettled([
            getCookies('https://cmp.wildberries.ru', 'WBToken'),
            getCookies('https://wildberries.ru', 'um'),
        ]);
        if (WBTokenCMP_Cookie.value == 'no_cookie' || !um.value) {
            alert('Для работы с рекламным кабинетом необходимо авторизоваться в кабинете ПОКУПАТЕЛЯ!');
            chrome.storage.local.set({ bot: false });
            // document.getElementById('adv-bot').checked = false;
        } else {
            chrome.storage.local.get(['key', 'key2'], function (result) {
                const userId = um.value.split('%')[1];
                let wbuserData = {
                    key: result.key,
                    key2: result.key2,
                    cmp_token: WBTokenCMP_Cookie.value,
                    wb_user_id: userId.slice(2),
                };

                let wbtokenData = {
                    key: result.key,
                    key2: result.key2,
                    token: WBTokenCMP_Cookie.value,
                    type: 'cmp',
                };

                const headers = {
                    Accept: '*/*',
                    'Content-Type': 'application/json;charset=utf-8',
                };

                postData({
                    url: 'https://prod.mkeeper.ru/wbuser/',
                    data: wbuserData,
                    headers: headers,
                    isReturn: false,
                });

                postData({
                    url: 'https://prod.mkeeper.ru/api/wbtoken/',
                    data: wbtokenData,
                    headers: headers,
                    isReturn: false,
                });
            });
        }
    };
    sendCookies();
}

async function validKey(key) {
    var obj = {
        key: key,
    };

    try {
        var response = await fetch('https://api.mkeeper.ru/Direct/hs/license', {
            method: 'post',
            mode: 'cors',
            body: JSON.stringify(obj),
        });

        if (response.status === 200) {
            var res = await response.json();
            if (res.error == false) {
                let keyId = document.getElementById('key');

                setTimeout(function () {
                    chrome.storage.local.set(
                        {
                            key: key,
                            key2: res.key2,
                            t: 0,
                        },
                        function () {}
                    );

                    chrome.runtime.onMessage.addListener(
                        chrome.storage.local.get(['key'], function (r) {
                            chrome.runtime.setUninstallURL(`https://api.mkeeper.ru/Direct/hs/del?key=${r.key}`);
                        })
                    );

                    showKeyInfo(key, res.key2);
                }, 1000);
            } else {
                error(res.text);
            }
        } else {
            error('Введен невалидный ключ!');
        }
    } catch (err) {
        error('Проверьте соединение с интернетом!');
        console.log(err);
    }
}

function error(mes) {
    document.querySelector('.error').innerText = mes;
    setTimeout(function () {
        document.querySelector('.error').innerText = '';
    }, 2000);
}

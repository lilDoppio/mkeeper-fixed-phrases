export function ifExistsRemove(id) {
    const existElements = document.querySelector(id);
    if (existElements) {
        existElements.remove();
    }
}

export function shouldShow(showFunc) {
    if (document.querySelector('.wrapper__body__content')) {
        ifExistsRemove('#mk_gldiv');
        ifExistsRemove('#mk_gldiv');

        showFunc();
    } else {
        return setTimeout(() => shouldShow(showFunc), 500);
    }
}
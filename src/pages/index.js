import { CamapignsListPage } from "./cmp-campaigns-list";
import icon from '../icon/icon.png';
import './style.css'

let pageStartUrl = null;

function initApp() {
    if (location.href.includes('cmp.wildberries')) {
        var intervalOne = setInterval(function () {
            let pageNewUrl = location.href;
            if (pageStartUrl != pageNewUrl) {
                pageStartUrl = pageNewUrl;

                if (pageStartUrl.includes('edit/carousel-auction') || pageStartUrl.includes('edit/search')) {
                    CamapignsListPage();
                }
            }
        }, 1000);
    }
}

initApp()


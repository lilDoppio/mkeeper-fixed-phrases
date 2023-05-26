import { KeywordsFilter } from '../../../widgets';
import { setCampaingSettings } from '../lib';
import { shouldShow } from '../model';

let chromeKeys = {};

chrome.storage.local.get(['key', 'key2', 'bot'], function (result) {
    chromeKeys['key'] = result.key;
    chromeKeys['key2'] = result.key2;
    chromeKeys['bot'] = result.bot;
});

export const CamapignsListPage = () =>
    shouldShow(() => {
        const campaignSettings = setCampaingSettings();

        pageScript(campaignSettings);
    });

async function pageScript(campaignSettings) {
    if (campaignSettings.type == 'cmpsearch') {
        KeywordsFilter({
            campaignId: campaignSettings.campaignId,
        });
    }
}
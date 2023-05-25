import { KeywordsFilterStats } from '../../../entities';
import { KeywordsFilterPhrases, keywordsFilterPhrasesModel } from '../../../features';

const getKeywordFilterStat = async (campaignId) => {
    const response = await fetch(`https://cmp.wildberries.ru/backend/api/v2/search/${campaignId}/stat-words`, {
        method: 'GET',
        headers: {
            'X-User-Id': localStorage.getItem('_wb-ads-intro-id'),
        },
    });
    return response.json();
};

export async function KeywordsFilter({ type, campaignId }) {
    const data = await getKeywordFilterStat(campaignId);

    keywordsFilterPhrasesModel.shouldShow(type, () => {
        KeywordsFilterStats({
            containerClass: '.ssl-panel-select-box--check',
            data: data,
        });

        KeywordsFilterPhrases({
            containerClass: '.tabs-list',
            campaignId: campaignId,
        });
    });
}

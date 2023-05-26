import { KeywordsFilterPhrases, keywordsFilterPhrasesModel } from '../../../features';

export async function KeywordsFilter({ campaignId }) {
    keywordsFilterPhrasesModel.shouldShowPhrases(() => {
        KeywordsFilterPhrases({
            containerClass: '.tabs-list',
            campaignId: campaignId,
        });
    });
}

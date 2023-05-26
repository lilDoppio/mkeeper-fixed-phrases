export function KeywordsFilterStats({ containerClass, data }) {
    if (data.stat === null) return;

    const keywordsContainer = document.querySelectorAll(containerClass);
    keywordsContainer.forEach((container) => {
        for (let child of container.children) {
            let keyword = child.querySelector('.checkbox.flex.flex--align-items-center')
    
            // if (keywordsContainer.querySelector('.mk-phrase-stats')) return

            if (!keyword) continue
            
            for (let count = 0; count < data.stat.length; count++) {
                if (keyword.innerHTML.match(/(?<=<\/div>).*?(?=(<|\\))/m)[0].trim() == data.stat[count].keyword) {
                    keyword.style = 'display:flex;justify-content:space-between;';

                    const stats = document.createElement('span');
                    stats.classList.add('mk-phrase-stats');
                    stats.style.fontSize = '12px';
                    stats.innerHTML = `
                        <span id="stats-sort-approved"></span>
                        (Просмотры: <span id="views">${data.stat[count].views}</span>; 
                        Клики: <span id="clicks">${data.stat[count].clicks}</span>; 
                        CTR: <span id="ctr">${data.stat[count].ctr}</span>; 
                        CPC: <span id="cpc">${data.stat[count].cpc}</span>)
                    `;
                    keyword.appendChild(stats);
                }
            }
        }
    });
}

// 卡片内容数据
const CARDS = {
    happy: [
        {
            id: 'happy_1',
            text: '在党岭的时候，当下有点不舒服，本来想接着接水的契机，出去走走消化消化，站在客栈边，看着山尖映衬在蓝调的暮色中，他出来找我，我当下其实没想好怎么办，但他非要说，我一说出来，我情绪上就好了；事后开玩笑再聊，让我觉得这好像不是什么大事。',
            icon: '🏔️'
        },
        {
            id: 'happy_2',
            text: '打麻将抽烟之后的那天晚上，聊了抽样的这个事情，他说 我答应你 的时候。',
            icon: '🤝'
        },
        {
            id: 'happy_3',
            text: '那次周末安排不下来，我觉得很难受之后的第二天，他约我周天晚上去看开心麻花的剧场，很惊喜，是我很没想到的。',
            icon: '🎭'
        },
        {
            id: 'happy_4',
            text: '我从成都回北京，他说要来机场接我，那天到北京也是晚上十一二点了。我每次从成都回北京、或者之前回上海的时候，都会略微有些惆怅，但这一次没有啦，反而很期待巴不得再早点起飞哈哈哈',
            icon: '✈️'
        },
        {
            id: 'happy_5',
            text: '还有每一次在工作日下班，他说要过来找我，都会让我在那一天都很期待。特别是他过来的时候还带花，会更加有开心的小惊喜感',
            icon: '💐'
        },
        {
            id: 'happy_6',
            text: '我感觉自己确实是看脸的，早上起来看到他的脸，五官，还有他笑起来卧蚕很明显的时候，我还真挺吃这一套。',
            icon: '😊'
        }
    ],
    
    friction: [
        {
            id: 'friction_1',
            text: '有次周末想要安排好我的活动，但是你的周末空不空很难定，我周末也就定不下来，J人真的很痛苦。',
            icon: '📅'
        },
        {
            id: 'friction_2',
            text: '国庆前，对于国庆去川西哪里，他经常觉得这个也好，那个也好，我每次看到就认为是一时兴起，没有仔细思考过可行性。 后面发现我们的优先级没有对齐，我就是 西安、成都、然后川西出去玩，这个路子，但他把出去玩看得更加重要。 可能因为他比较少有周末双休，而我周末经常出去满足了不少旅游出去跑的诉求 ？',
            icon: '🗺️'
        },
        {
            id: 'friction_3',
            text: '党岭那次，不高兴他替我做决定',
            icon: '🤔'
        },
        {
            id: 'friction_4',
            text: '国庆在成都打麻将，一根接一根，超过第三根的时候，开始觉得抽烟有点烦',
            icon: '🚬'
        },
        {
            id: 'friction_5',
            text: '有一点不开心的：大国崛起群里，介意和他和那位赵女士有单独交流',
            icon: '💭'
        }
    ],
    
    discovery: [
        {
            id: 'discovery_1',
            text: '我比他恋家。 住在建设路附近的时候聊过，可能跟小时候的成长经历有关，我一直在父母身边长大',
            icon: '🏠'
        },
        {
            id: 'discovery_2',
            text: '我对于徒步，爬山，的爱好没有他那么强烈。他在于更多在于山本身和景色？ 我在于路上一起的人和景色，期待感没有他那么强。',
            icon: '⛰️'
        },
        {
            id: 'discovery_3',
            text: '他在西安，在家里，在朋友面前的时候，能明显感觉到在我身上的注意力会变少。 后面仔细想想，我也是一样。',
            icon: '👥'
        }
    ]
};

// 获取所有卡片总数
function getTotalCardsCount() {
    return CARDS.happy.length + CARDS.friction.length + CARDS.discovery.length;
}

// 获取某个类别的卡片总数
function getCategoryCount(category) {
    return CARDS[category] ? CARDS[category].length : 0;
}

// 随机获取指定类别的一张卡片
function getRandomCard(category) {
    const cards = CARDS[category];
    if (!cards || cards.length === 0) {
        return null;
    }
    
    const randomIndex = Math.floor(Math.random() * cards.length);
    return cards[randomIndex];
}

// 根据ID获取卡片
function getCardById(cardId) {
    for (const category in CARDS) {
        const card = CARDS[category].find(c => c.id === cardId);
        if (card) {
            return { ...card, category };
        }
    }
    return null;
}

// 获取类别的中文名称
function getCategoryName(category) {
    const names = {
        happy: '开心时刻',
        friction: '小摩擦',
        discovery: '新发现'
    };
    return names[category] || category;
}

// 获取类别的图标
function getCategoryIcon(category) {
    const icons = {
        happy: '🎁',
        friction: '💙',
        discovery: '✨'
    };
    return icons[category] || '❤️';
}


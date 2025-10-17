// 问题库
const QUESTIONS = {
    // 价值观类的
    values: [
        "你认为生命中最重要的是什么？（例如：家庭、自由、成就、体验、爱…），顺便排个序吧",
        "哪些事情会让你发自内心地感到快乐和满足？",
        "感情中，什么是绝对无法妥协的底线？",
        "在做重大决定时，你最看重的是什么？（例如：关键角色的建议、自己的感觉、利弊分析…）",
        "你最欣赏的人是谁？欣赏他们身上的哪些点？",
    ],
    
    // 未来类的
    future: [
        "在事业或个人成长上，你有什么想要实现的目标？",
        "有哪个特别想去生活或体验的城市吗？ 或者很想要爬的山、户外活动等等",
        "你对金钱的看法是什么样的？（例如：更倾向于储蓄还是享受当下？）",
        "如果有小孩，你希望ta成为一个什么样的人？",
    ],
    
    // 矛盾处理
    conflict: [
        '对你来说，"健康的争吵"是什么样的？',
    ],
    
    // 亲密关系表达
    intimacy: [
        "在亲密关系中，最重要的三个元素是什么？",
        '如何看待两个人之间的"个人空间"和"共同时间"？ 比如占比，这两类事件的定义',
        "在你看来，维系一段长期关系的秘诀可能是什么？",
    ],
    
    // 过去
    past: [
        "从小到大，你记忆里，最开心的时刻有哪些？",
        "有没有一本书、一部电影、一首歌、一个人，深刻地影响了你？",
    ],
    
    // 其他的
    others: [
        '心目中"完美的一天"会如何度过 ？',
        "十年后，你的一天会是怎么样度过的？",
    ]
};

// 获取随机问题
function getRandomQuestion() {
    const categories = ['values', 'future', 'conflict', 'intimacy', 'past', 'others'];
    const weights = [0.25, 0.2, 0.1, 0.2, 0.15, 0.1]; // 权重
    
    // 根据权重随机选择类别
    const random = Math.random();
    let sum = 0;
    let selectedCategory;
    
    for (let i = 0; i < categories.length; i++) {
        sum += weights[i];
        if (random <= sum) {
            selectedCategory = categories[i];
            break;
        }
    }
    
    // 从选中的类别中随机选择一个问题
    const questionsInCategory = QUESTIONS[selectedCategory];
    const randomIndex = Math.floor(Math.random() * questionsInCategory.length);
    
    return {
        category: selectedCategory,
        question: questionsInCategory[randomIndex]
    };
}

// 获取所有问题（用于测试）
function getAllQuestions() {
    const allQuestions = [];
    for (const category in QUESTIONS) {
        allQuestions.push(...QUESTIONS[category]);
    }
    return allQuestions;
}


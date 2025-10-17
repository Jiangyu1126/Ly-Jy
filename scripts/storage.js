// 本地存储管理

// 存储键名
const STORAGE_KEYS = {
    ANSWERS: 'love_box_answers',
    PROGRESS: 'love_box_progress',
    DRAWN_CARDS: 'love_box_drawn_cards'
};

// ========== 回答记录相关 ==========

// 保存回答
function saveAnswer(answerData) {
    const answers = getAnswers();
    answers.push({
        id: Date.now(),
        question: answerData.question,
        answer: answerData.answer,
        wordCount: answerData.answer.length,
        date: new Date().toISOString(),
        cardDrawn: answerData.cardDrawn || null,
        author: answerData.author || 'me' // 'me' 或 'him'
    });
    
    localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(answers));
    return answers;
}

// 获取所有回答
function getAnswers() {
    const data = localStorage.getItem(STORAGE_KEYS.ANSWERS);
    return data ? JSON.parse(data) : [];
}

// 获取最新的回答
function getLatestAnswer() {
    const answers = getAnswers();
    return answers.length > 0 ? answers[answers.length - 1] : null;
}

// 删除指定回答
function deleteAnswer(answerId) {
    const answers = getAnswers();
    const filtered = answers.filter(a => a.id !== answerId);
    localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(filtered));
    return filtered;
}

// 清空所有回答
function clearAllAnswers() {
    localStorage.removeItem(STORAGE_KEYS.ANSWERS);
}

// ========== 抽卡进度相关 ==========

// 保存抽卡记录
function saveDrawnCard(cardId, category) {
    const drawn = getDrawnCards();
    
    // 检查是否已经抽过
    if (!drawn.includes(cardId)) {
        drawn.push(cardId);
        localStorage.setItem(STORAGE_KEYS.DRAWN_CARDS, JSON.stringify(drawn));
    }
    
    // 更新进度
    updateProgress();
    return drawn;
}

// 获取已抽取的卡片
function getDrawnCards() {
    const data = localStorage.getItem(STORAGE_KEYS.DRAWN_CARDS);
    return data ? JSON.parse(data) : [];
}

// 检查卡片是否已抽取
function isCardDrawn(cardId) {
    const drawn = getDrawnCards();
    return drawn.includes(cardId);
}

// 获取某个类别已抽取的卡片数量
function getCategoryDrawnCount(category) {
    const drawnCards = getDrawnCards();
    const categoryCards = CARDS[category] || [];
    
    let count = 0;
    categoryCards.forEach(card => {
        if (drawnCards.includes(card.id)) {
            count++;
        }
    });
    
    return count;
}

// 更新进度
function updateProgress() {
    const drawnCards = getDrawnCards();
    const totalCards = getTotalCardsCount();
    
    const progress = {
        total: totalCards,
        drawn: drawnCards.length,
        percentage: Math.round((drawnCards.length / totalCards) * 100),
        lastUpdate: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
    return progress;
}

// 获取进度
function getProgress() {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (data) {
        return JSON.parse(data);
    }
    
    // 如果没有进度数据，初始化一个
    return updateProgress();
}

// 重置进度（清空所有已抽取的卡片）
function resetProgress() {
    localStorage.removeItem(STORAGE_KEYS.DRAWN_CARDS);
    return updateProgress();
}

// 重置所有数据
function resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.ANSWERS);
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.DRAWN_CARDS);
}

// ========== 统计相关 ==========

// 获取统计数据
function getStatistics() {
    const answers = getAnswers();
    const progress = getProgress();
    
    return {
        totalAnswers: answers.length,
        totalWords: answers.reduce((sum, a) => sum + a.wordCount, 0),
        averageWords: answers.length > 0 
            ? Math.round(answers.reduce((sum, a) => sum + a.wordCount, 0) / answers.length)
            : 0,
        cardsProgress: progress,
        myAnswers: answers.filter(a => a.author === 'me').length,
        hisAnswers: answers.filter(a => a.author === 'him').length
    };
}

// 导出所有数据（用于备份）
function exportAllData() {
    return {
        answers: getAnswers(),
        progress: getProgress(),
        drawnCards: getDrawnCards(),
        exportDate: new Date().toISOString()
    };
}

// 导入数据（用于恢复）
function importData(data) {
    if (data.answers) {
        localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(data.answers));
    }
    if (data.drawnCards) {
        localStorage.setItem(STORAGE_KEYS.DRAWN_CARDS, JSON.stringify(data.drawnCards));
    }
    updateProgress();
}


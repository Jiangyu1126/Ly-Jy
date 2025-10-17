// 主逻辑控制

// ========== 全局变量 ==========
let currentQuestion = null;
let currentAnswer = null;
let currentCard = null;
let hasDrawnCard = false; // 标记是否已经抽过卡

// ========== 页面初始化 ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('💝 应用启动');
    
    // 初始化页面
    initQuestionPage();
    initCardPage();
    initHistoryPage();
    updateAllProgress();
    
    // 绑定事件
    bindEvents();
});

// ========== 问答页面 ==========
function initQuestionPage() {
    console.log('📋 初始化问答页面');
    
    // 加载随机问题
    try {
        const questionData = getRandomQuestion();
        currentQuestion = questionData.question;
        console.log('✅ 问题加载成功:', currentQuestion);
    } catch (error) {
        console.error('❌ 问题加载失败:', error);
        currentQuestion = '今天有什么想和TA分享的吗？'; // 默认问题
    }
    
    const questionElement = document.getElementById('questionText');
    if (questionElement) {
        questionElement.textContent = currentQuestion;
    } else {
        console.error('❌ 问题元素未找到');
    }
    
    // 清空输入框
    const answerInput = document.getElementById('answerInput');
    if (answerInput) {
        answerInput.value = '';
        updateCharCount();
    } else {
        console.error('❌ 输入框元素未找到');
    }
}

// 更新字数统计
function updateCharCount() {
    const answerInput = document.getElementById('answerInput');
    const charCount = document.getElementById('charCount');
    const charTip = document.getElementById('charTip');
    const submitBtn = document.getElementById('submitAnswerBtn');
    
    if (!answerInput || !charCount || !submitBtn) {
        console.log('⚠️ 字数统计元素未找到');
        return;
    }
    
    const count = answerInput.value.length;
    charCount.textContent = count;
    
    // 更新提示文字
    if (count < 30) {
        const remaining = 30 - count;
        charTip.textContent = `还差 ${remaining} 字就可以抽卡`;
        charTip.style.color = '#86868b'; // Apple 风格颜色
        
        // 禁用按钮
        submitBtn.disabled = true;
        submitBtn.classList.add('disabled');
        submitBtn.classList.remove('ready');
    } else {
        charTip.textContent = `太棒了！可以抽卡了 ✨`;
        charTip.style.color = '#007AFF'; // Apple 蓝色
        
        // 启用按钮
        submitBtn.disabled = false;
        submitBtn.classList.remove('disabled');
        submitBtn.classList.add('ready');
    }
    
    console.log(`📝 字数: ${count}/30`);
}

// 提交回答
async function submitAnswer() {
    const answerInput = document.getElementById('answerInput');
    const answer = answerInput.value.trim();
    
    if (answer.length < 30) {
        alert('回答至少需要 30 字哦~');
        return;
    }
    
    // 保存当前回答（暂时不包含卡片信息）
    currentAnswer = {
        question: currentQuestion,
        answer: answer,
        wordCount: answer.length,
        author: 'me'
    };
    
    // 重置抽卡标记，允许本次抽卡
    hasDrawnCard = false;
    
    // 显示加载动画
    showLoading('正在保存...');
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    hideLoading();
    
    // 切换到抽卡页面
    showPage('cardPage');
    
    console.log('📝 回答已提交，进入抽卡页面，允许抽取一张卡');
    
    // 添加进入动画
    setTimeout(() => {
        document.querySelectorAll('.mystery-box').forEach((box, index) => {
            box.style.animation = `boxFloat 0.6s ease-out ${index * 0.1}s both`;
        });
    }, 100);
}

// ========== 抽卡页面 ==========
function initCardPage() {
    updateAllProgress();
}

// 更新所有进度显示
function updateAllProgress() {
    const progress = getProgress();
    
    // 更新总进度
    const collectedCount = document.getElementById('collectedCount');
    const totalCount = document.getElementById('totalCount');
    const progressFill = document.getElementById('progressFill');
    
    if (collectedCount) collectedCount.textContent = progress.drawn;
    if (totalCount) totalCount.textContent = progress.total;
    if (progressFill) progressFill.style.width = progress.percentage + '%';
    
    // 更新各类别进度
    updateCategoryProgress('happy');
    updateCategoryProgress('friction');
    updateCategoryProgress('discovery');
}

// 更新类别进度
function updateCategoryProgress(category) {
    const drawnCount = getCategoryDrawnCount(category);
    const totalCount = getCategoryCount(category);
    const countElement = document.getElementById(`${category}Count`);
    
    if (countElement) {
        countElement.textContent = `${drawnCount}/${totalCount}`;
    }
}

// 抽卡
function drawCard(category) {
    // 检查是否已经抽过卡
    if (hasDrawnCard) {
        alert('本次已经抽过卡啦！请先完成新的回答 😊');
        return;
    }
    
    // 获取随机卡片
    const card = getRandomCard(category);
    
    if (!card) {
        alert('这个类别暂时没有卡片');
        return;
    }
    
    // 标记已抽卡
    hasDrawnCard = true;
    
    // 保存抽卡记录
    saveDrawnCard(card.id, category);
    
    // 如果有未保存的回答，现在保存
    if (currentAnswer && !currentAnswer.saved) {
        currentAnswer.cardDrawn = {
            id: card.id,
            category: category,
            text: card.text
        };
        saveAnswer(currentAnswer);
        currentAnswer.saved = true;
        
        // 发送邮件通知
        sendEmailNotification(currentAnswer).then(result => {
            if (result.success) {
                console.log('✅ 邮件已发送');
            } else {
                console.log('⚠️ 邮件发送失败（可能未配置）');
            }
        });
    }
    
    // 显示卡片
    showCard(card, category);
    
    // 更新进度
    updateAllProgress();
    
    console.log('🎴 已抽卡，标记 hasDrawnCard = true');
}

// 显示卡片
function showCard(card, category) {
    const modal = document.getElementById('cardModal');
    const cardIcon = document.getElementById('cardIcon');
    const cardCategory = document.getElementById('cardCategory');
    const cardText = document.getElementById('cardText');
    const cardNumber = document.getElementById('cardNumber');
    const displayCard = document.getElementById('displayCard');
    
    // 设置卡片内容
    if (cardIcon) cardIcon.textContent = card.icon || getCategoryIcon(category);
    if (cardCategory) cardCategory.textContent = getCategoryName(category);
    if (cardText) cardText.textContent = card.text;
    if (cardNumber) cardNumber.textContent = `#${card.id}`;
    
    // 设置卡片样式
    if (displayCard) {
        displayCard.className = 'card';
        displayCard.classList.add(`card-${category}`);
    }
    
    // 显示模态框
    if (modal) {
        modal.classList.add('show');
        
        // 卡片翻转动画
        setTimeout(() => {
            if (displayCard) {
                displayCard.classList.add('flip');
            }
        }, 300);
    }
    
    currentCard = { card, category };
}

// 关闭卡片模态框
function closeCardModal() {
    const modal = document.getElementById('cardModal');
    const displayCard = document.getElementById('displayCard');
    
    if (displayCard) {
        displayCard.classList.remove('flip');
    }
    
    setTimeout(() => {
        if (modal) {
            modal.classList.remove('show');
        }
        // 关闭后返回问答页面，开始新的回答
        backToQuestionPageAndReset();
    }, 300);
}

// 返回问答页面并重置状态
function backToQuestionPageAndReset() {
    // 重置状态
    hasDrawnCard = false;
    currentAnswer = null;
    
    // 返回问答页面（会自动生成新问题）
    showPage('questionPage');
    
    console.log('🔄 返回问答页面，重置状态，生成新问题');
}

// 再抽一张（已废弃，现在一次只能抽一张）
function drawAgain() {
    alert('一次填写只能抽一张卡哦！请完成新的回答后继续 😊');
}

// ========== 历史记录页面 ==========
function initHistoryPage() {
    loadHistory();
}

// 加载历史记录
function loadHistory(filter = 'all') {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    const answers = getAnswers();
    
    // 根据过滤器筛选
    let filteredAnswers = answers;
    if (filter === 'mine') {
        filteredAnswers = answers.filter(a => a.author === 'me');
    } else if (filter === 'his') {
        filteredAnswers = answers.filter(a => a.author === 'him');
    }
    
    // 倒序显示（最新的在前）
    filteredAnswers.reverse();
    
    // 清空列表
    historyList.innerHTML = '';
    
    // 如果没有记录
    if (filteredAnswers.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📝</div>
                <p>还没有${filter === 'all' ? '' : (filter === 'mine' ? '你的' : 'TA的')}回答记录</p>
                <p class="empty-hint">开始写下第一条心情吧~</p>
            </div>
        `;
        return;
    }
    
    // 渲染每条记录
    filteredAnswers.forEach(answer => {
        const item = createHistoryItem(answer);
        historyList.appendChild(item);
    });
}

// 创建历史记录项
function createHistoryItem(answer) {
    const item = document.createElement('div');
    item.className = 'history-item';
    
    const date = new Date(answer.date);
    const dateStr = formatDateChinese(date);
    const authorName = answer.author === 'me' ? '我' : 'TA';
    const authorClass = answer.author === 'me' ? 'author-me' : 'author-him';
    
    item.innerHTML = `
        <div class="history-header">
            <span class="history-author ${authorClass}">${authorName}</span>
            <span class="history-date">${dateStr}</span>
        </div>
        <div class="history-question">${answer.question}</div>
        <div class="history-answer">${answer.answer}</div>
        <div class="history-footer">
            <span class="history-word-count">${answer.wordCount} 字</span>
            ${answer.cardDrawn ? `
                <span class="history-card">
                    抽到了：${getCategoryName(answer.cardDrawn.category)}
                </span>
            ` : ''}
        </div>
    `;
    
    return item;
}

// 格式化日期（中文）
function formatDateChinese(date) {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours === 0) {
            const minutes = Math.floor(diff / (1000 * 60));
            return minutes < 1 ? '刚刚' : `${minutes}分钟前`;
        }
        return `${hours}小时前`;
    } else if (days === 1) {
        return '昨天';
    } else if (days < 7) {
        return `${days}天前`;
    } else {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${month}月${day}日`;
    }
}

// 清空历史记录
function clearHistory() {
    if (confirm('确定要清空所有回答记录吗？此操作不可恢复。')) {
        clearAllAnswers();
        loadHistory();
        alert('已清空所有记录');
    }
}

// ========== 页面切换 ==========
function showPage(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // 显示目标页面
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // 页面特定的初始化
    if (pageId === 'questionPage') {
        // 每次回到问答页面都重新生成问题
        initQuestionPage();
        console.log('🔄 切换到问答页面，生成新问题');
    } else if (pageId === 'cardPage') {
        updateAllProgress();
        console.log('🎴 切换到抽卡页面');
    } else if (pageId === 'historyPage') {
        loadHistory();
        console.log('📖 切换到历史记录页面');
    }
}

// ========== 事件绑定 ==========
function bindEvents() {
    console.log('🔗 绑定事件');
    
    // 问答页面
    const answerInput = document.getElementById('answerInput');
    if (answerInput) {
        answerInput.addEventListener('input', updateCharCount);
        console.log('✅ 输入框事件已绑定');
    } else {
        console.error('❌ 输入框元素未找到');
    }
    
    const submitAnswerBtn = document.getElementById('submitAnswerBtn');
    if (submitAnswerBtn) {
        submitAnswerBtn.addEventListener('click', submitAnswer);
        console.log('✅ 提交按钮事件已绑定');
    } else {
        console.error('❌ 提交按钮未找到');
    }
    
    const viewHistoryBtn = document.getElementById('viewHistoryBtn');
    if (viewHistoryBtn) {
        viewHistoryBtn.addEventListener('click', () => showPage('historyPage'));
        console.log('✅ 历史记录按钮事件已绑定');
    } else {
        console.error('❌ 历史记录按钮未找到');
    }
    
    // 抽卡页面
    document.querySelectorAll('.mystery-box').forEach(box => {
        box.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            drawCard(category);
        });
    });
    
    const backToQuestionBtn = document.getElementById('backToQuestionBtn');
    if (backToQuestionBtn) {
        backToQuestionBtn.addEventListener('click', () => {
            // 如果还没抽卡就返回，重置状态
            if (!hasDrawnCard && currentAnswer) {
                if (confirm('还没有抽卡哦，确定要返回吗？')) {
                    backToQuestionPageAndReset();
                }
            } else {
                backToQuestionPageAndReset();
            }
        });
        console.log('✅ 返回首页按钮事件已绑定');
    }
    
    // 卡片模态框
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeCardModal);
        console.log('✅ 完成按钮事件已绑定');
    }
    
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeCardModal);
        console.log('✅ 模态框背景事件已绑定');
    }
    
    // 历史记录页面
    const backFromHistoryBtn = document.getElementById('backFromHistoryBtn');
    if (backFromHistoryBtn) {
        backFromHistoryBtn.addEventListener('click', () => showPage('questionPage'));
    }
    
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', clearHistory);
    }
    
    // 历史记录筛选
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // 更新按钮状态
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 加载对应的记录
            const filter = this.getAttribute('data-filter');
            loadHistory(filter);
        });
    });
}

// ========== 辅助函数 ==========
function showLoading(message = '加载中...') {
    // 简单的加载提示
    console.log('⏳', message);
}

function hideLoading() {
    console.log('✅ 加载完成');
}

// ========== 键盘快捷键 ==========
document.addEventListener('keydown', function(e) {
    // ESC 关闭模态框
    if (e.key === 'Escape') {
        const modal = document.getElementById('cardModal');
        if (modal && modal.classList.contains('show')) {
            closeCardModal();
        }
    }
});


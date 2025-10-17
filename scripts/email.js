// 邮件发送功能（使用 EmailJS）

// ========== 配置信息 ==========
// 请在 https://www.emailjs.com/ 注册并获取这些信息
const EMAIL_CONFIG = {
    serviceId: 'service_a76w6wu',     // ✅ 已配置
    templateId: 'template_kxk42oa',   // ✅ 已配置
    publicKey: 'faVQisfpF1g-B4GpB',   // ✅ 已配置
    recipientEmail: 'jiangyu.novernight@gmail.com'  // ✅ 已配置
};

// 初始化 EmailJS
function initEmailJS() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAIL_CONFIG.publicKey);
        console.log('📧 EmailJS 初始化成功');
        return true;
    } else {
        console.warn('⚠️ EmailJS 未加载');
        return false;
    }
}

// 发送邮件通知
async function sendEmailNotification(answerData) {
    console.log('📧 开始发送邮件...');
    console.log('📋 回答数据:', answerData);
    
    // 检查是否配置了邮件服务
    if (EMAIL_CONFIG.serviceId === 'YOUR_SERVICE_ID') {
        console.warn('⚠️ 邮件服务未配置，跳过发送');
        return { success: false, message: '邮件服务未配置' };
    }
    
    console.log('✅ 邮件配置已完成');
    console.log('   Service ID:', EMAIL_CONFIG.serviceId);
    console.log('   Template ID:', EMAIL_CONFIG.templateId);
    console.log('   收件人:', EMAIL_CONFIG.recipientEmail);
    
    try {
        // 准备邮件参数
        const templateParams = {
            to_email: EMAIL_CONFIG.recipientEmail,
            from_name: answerData.author === 'me' ? '我' : 'TA',
            question: answerData.question,
            answer: answerData.answer,
            word_count: answerData.wordCount,
            date: formatDate(new Date()),
            card_category: answerData.cardDrawn ? getCategoryName(answerData.cardDrawn.category) : '未抽卡',
            card_text: answerData.cardDrawn ? answerData.cardDrawn.text : '未抽卡',
            reply_to: EMAIL_CONFIG.recipientEmail
        };
        
        console.log('📨 邮件参数准备完成:', templateParams);
        console.log('🚀 正在调用 EmailJS 发送...');
        
        // 发送邮件
        const response = await emailjs.send(
            EMAIL_CONFIG.serviceId,
            EMAIL_CONFIG.templateId,
            templateParams
        );
        
        console.log('✅ EmailJS 返回成功!', response);
        console.log('   状态码:', response.status);
        console.log('   响应文本:', response.text);
        return { success: true, message: '邮件已发送' };
        
    } catch (error) {
        console.error('❌ EmailJS 发送失败!');
        console.error('   错误类型:', error.name);
        console.error('   错误信息:', error.message);
        console.error('   完整错误:', error);
        return { success: false, message: '邮件发送失败', error };
    }
}

// 格式化日期
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 测试邮件发送
function testEmail() {
    const testData = {
        author: 'me',
        question: '这是一个测试问题',
        answer: '这是一个测试回答，用来验证邮件服务是否正常工作。'.repeat(5),
        wordCount: 100,
        cardDrawn: {
            category: 'happy',
            text: '这是一张测试卡片'
        }
    };
    
    return sendEmailNotification(testData);
}

// 页面加载时初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEmailJS);
} else {
    initEmailJS();
}


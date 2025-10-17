# 📧 邮件功能配置指南

## 为什么需要配置邮件？

当你或他写完回答并抽卡后，系统会自动发送邮件到你的邮箱，这样你就能收到对方的回答啦！💌

## 配置步骤（超简单！）

### 第一步：注册 EmailJS

1. 访问 [EmailJS 官网](https://www.emailjs.com/)
2. 点击右上角 **Sign Up** 注册（可以用 Google 账号快速登录）
3. 免费账户每月可发送 **200 封邮件**，完全够用！

### 第二步：创建邮件服务

1. 登录后，点击左侧菜单的 **Email Services**
2. 点击 **Add New Service**
3. 选择你的邮箱服务商（推荐 Gmail 或 Outlook）
4. 按提示连接你的邮箱账号
5. 完成后会得到一个 **Service ID**（类似 `service_xxxxxx`）

### 第三步：创建邮件模板

1. 点击左侧菜单的 **Email Templates**
2. 点击 **Create New Template**
3. 复制以下模板内容：

#### 邮件主题（Subject）：
```
💝 {{from_name}}的新回答
```

#### 邮件内容（Content）：
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fef9f5;">
  <h2 style="color: #ff69b4; text-align: center;">💝 我们的小确幸</h2>
  
  <div style="background: white; border-radius: 12px; padding: 24px; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <h3 style="color: #333; margin-bottom: 16px;">📝 今天的问题</h3>
    <p style="color: #666; font-size: 16px; line-height: 1.6;">{{question}}</p>
  </div>
  
  <div style="background: white; border-radius: 12px; padding: 24px; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <h3 style="color: #333; margin-bottom: 16px;">💭 {{from_name}}的回答</h3>
    <p style="color: #555; font-size: 15px; line-height: 1.8; white-space: pre-wrap;">{{answer}}</p>
    <p style="color: #999; font-size: 14px; margin-top: 16px;">字数：{{word_count}} 字</p>
  </div>
  
  <div style="background: linear-gradient(135deg, #ffe4e1, #fff); border-radius: 12px; padding: 24px; margin: 20px 0; border: 2px solid #ffe4e1;">
    <h3 style="color: #333; margin-bottom: 16px;">🎁 抽到的卡片</h3>
    <p style="color: #ff69b4; font-weight: 600; margin-bottom: 8px;">【{{card_category}}】</p>
    <p style="color: #555; font-size: 15px; line-height: 1.8;">{{card_text}}</p>
  </div>
  
  <div style="text-align: center; color: #999; font-size: 14px; margin-top: 24px; padding-top: 24px; border-top: 1px solid #e0e0e0;">
    <p>时间：{{date}}</p>
    <p style="margin-top: 8px;">💕 珍藏每一个瞬间</p>
  </div>
</div>
```

4. 保存模板，会得到一个 **Template ID**（类似 `template_xxxxxx`）

### 第四步：获取 Public Key

1. 点击左侧菜单的 **Account**
2. 在页面中找到 **Public Key**（类似 `xxxxxxxxxxxxxxx`）
3. 复制这个 Key

### 第五步：配置到项目中

打开 `scripts/email.js` 文件，找到这几行：

```javascript
const EMAIL_CONFIG = {
    serviceId: 'YOUR_SERVICE_ID',     // 替换为你的 Service ID
    templateId: 'YOUR_TEMPLATE_ID',   // 替换为你的 Template ID
    publicKey: 'YOUR_PUBLIC_KEY',     // 替换为你的 Public Key
    recipientEmail: 'YOUR_EMAIL@example.com'  // 你的邮箱地址
};
```

替换成你刚才获取的信息：

```javascript
const EMAIL_CONFIG = {
    serviceId: 'service_abc123',           // 第二步获得的
    templateId: 'template_xyz456',         // 第三步获得的
    publicKey: 'your_public_key_here',     // 第四步获得的
    recipientEmail: 'your_email@gmail.com' // 你想接收通知的邮箱
};
```

### 第六步：测试

1. 在浏览器中打开 `index.html`
2. 按 `F12` 打开开发者工具
3. 在 Console 中输入：`testEmail()`
4. 如果配置正确，你会收到一封测试邮件！

## 常见问题

### Q: 邮件没收到怎么办？
A: 
1. 检查垃圾邮件箱
2. 确认 Service ID、Template ID、Public Key 都填写正确
3. 检查 EmailJS 账号是否激活
4. 打开浏览器控制台查看错误信息

### Q: 可以发给两个人吗？
A: 可以！在模板设置中添加多个收件人，或者修改代码调用两次 `sendEmailNotification`

### Q: 想要更好看的邮件样式？
A: 可以在 EmailJS 的模板编辑器中自定义 HTML 和 CSS

### Q: 免费额度不够用怎么办？
A: 
- 免费版每月 200 封，一天写 6 次才会用完
- 如果需要更多，可以升级到付费版（$7/月）

### Q: 不想用邮件，有其他方案吗？
A: 可以！项目已经支持本地存储，所有回答都保存在浏览器中，可以在"回答记录"页面查看

## 完全不配置可以吗？

**可以！** 如果不配置邮件服务：
- ✅ 游戏功能完全正常
- ✅ 回答会保存到浏览器本地
- ✅ 可以在"回答记录"页面查看所有历史
- ❌ 只是不会收到邮件通知

本地使用完全没问题，只是看不到对方的回答（除非你们共用一个浏览器）。

## 安全提示

⚠️ **请注意**：
- Public Key 可以公开，不是隐私信息
- 不要分享你的 Private Key（如果有的话）
- EmailJS 会记录发送的邮件，注意隐私
- 建议定期更换密钥

---

配置完成后，每次写完回答并抽卡，你都会收到一封精美的邮件！💌

祝你们幸福~ 💕


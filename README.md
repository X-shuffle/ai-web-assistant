# AI 文本总结助手

一个 Chrome 浏览器扩展，可以使用 AI 快速总结选中的文本内容。通过选中网页上的文本，一键生成核心内容总结。

## 功能特点

1. 右键菜单快速调用
2. 自定义 AI 提示词
3. 可配置 API 参数
4. 支持调整 AI 响应温度
5. Markdown 格式输出结果
6. 界面简洁直观

## 使用方法

### 基础使用
1. 在网页中选中要总结的文本
2. 右键选择 "AI 总结选中内容"
3. 等待 AI 生成总结结果

### 配置选项
点击扩展图标，可以展开配置面板：
- API 密钥：用于访问 AI 服务
- API 端点：默认为 `https://api.uniapi.io`
- API 路径：默认为 `/v1/chat/completions`
- 模型名称：默认为 `deepseek-chat`
- 温度参数：可调范围 0-1，默认 0.7

### 提示词配置
可以自定义 AI 总结的提示词模板，默认配置为：
```
作为文本总结助手，请将用户输入的文本进行总结。要求：
1. 总结文章内容，对于文章的提到的解答，进行完善
2. 使用简体中文，保持专业术语
3. 输出格式为 markdown 列表
4. 相关内容合并为一点
5. 删除重复信息
6. 按重要性排序
```

## 安装方法

1. 下载源代码
2. 打开 Chrome 浏览器，访问 `chrome://extensions/`
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目文件夹

## 项目结构

```
.
├── manifest.json      # 扩展配置文件
├── popup.html        # 弹出窗口界面
├── popup.js          # 弹出窗口逻辑
├── background.js     # 后台服务脚本
├── content.js        # 内容脚本
└── icons/            # 图标文件
    └── icon.svg      # 扩展图标
```

## 技术实现

### content.js
- 负责获取用户选中的文本内容
- 通过消息传递机制与 popup.js 通信

### popup.js
- 处理用户界面交互
- 管理配置信息的保存和加载
- 与 background.js 通信发送总结请求

### background.js
- 处理 API 请求
- 管理系统提示词
- 处理右键菜单功能
- 处理错误和异常情况

## 注意事项

1. 首次使用需要配置有效的 API 密钥
2. 选中文本不要过长，建议在 4000 字以内
3. 如遇到问题，请查看浏览器控制台的错误信息
4. 确保网络连接正常

## 开发计划

### 已实现功能
- [x] 基本的文本选择和总结
- [x] 可配置的 API 参数
- [x] 自定义提示词支持
- [x] 温度参数调节
- [x] 右键菜单快速调用
- [x] 界面折叠优化

### 待实现功能
- [ ] 历史记录保存
- [ ] 快捷键支持
- [ ] 更多的输出格式选项
- [ ] 批量处理功能

## License

MIT License
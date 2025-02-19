// 默认配置
const DEFAULT_CONFIG = {
    apiKey: 'sk-vmxSDuixD4FRyKi_Eg1a1blINMcyReRySf3EXZGvEJ1HWCvRuQ5ENrd6fhQ',
    apiEndpoint: 'https://api.uniapi.io',
    apiPath: '/v1/chat/completions',
    modelName: 'deepseek-chat',
    temperature: 0.7,
    systemPrompt: `作为文本总结助手，请将用户输入的文本进行总结。要求：
1. 总结文章内容，对于文章的提到的解答，进行完善
2. 使用简体中文，保持专业术语
3. 输出格式为 markdown 列表
4. 相关内容合并为一点
5. 删除重复信息
6. 按重要性排序`
};

// 加载配置
async function loadConfig() {
    const config = await chrome.storage.sync.get(DEFAULT_CONFIG);
    document.getElementById('apiKey').value = config.apiKey;
    document.getElementById('apiEndpoint').value = config.apiEndpoint;
    document.getElementById('apiPath').value = config.apiPath;
    document.getElementById('modelName').value = config.modelName;
    document.getElementById('temperature').value = config.temperature;
    document.getElementById('temperatureValue').textContent = config.temperature;
    document.getElementById('systemPrompt').value = config.systemPrompt;
}

// 保存配置
async function saveConfig() {
    const config = {
        apiKey: document.getElementById('apiKey').value,
        apiEndpoint: document.getElementById('apiEndpoint').value,
        apiPath: document.getElementById('apiPath').value,
        modelName: document.getElementById('modelName').value,
        temperature: parseFloat(document.getElementById('temperature').value),
        systemPrompt: document.getElementById('systemPrompt').value
    };
    await chrome.storage.sync.set(config);
}

// 初始化事件监听
document.addEventListener('DOMContentLoaded', () => {
    loadConfig();

    // 监听配置变化
    document.getElementById('temperature').addEventListener('input', (e) => {
        document.getElementById('temperatureValue').textContent = e.target.value;
        saveConfig();
    });

    ['apiKey', 'apiEndpoint', 'apiPath', 'modelName'].forEach(id => {
        document.getElementById(id).addEventListener('change', saveConfig);
    });

    // 添加提示词变化监听
    document.getElementById('systemPrompt').addEventListener('change', saveConfig);

    // 总结按钮点击事件
    document.getElementById('summarize').addEventListener('click', async () => {
        const summaryDiv = document.getElementById('summary');
        summaryDiv.textContent = '正在生成总结...';
        summaryDiv.className = 'loading';

        try {
            // 获取当前标签页
            const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
            
            // 确保标签页存在
            if (!tab) {
                throw new Error('无法获取当前标签页');
            }

            // 注入content script
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js']
            });

            // 从内容脚本获取页面内容
            const pageContent = await chrome.tabs.sendMessage(tab.id, {action: 'getPageContent'})
                .catch(error => {
                    throw new Error('无法连接到页面，请刷新页面后重试');
                });
            
            if (!pageContent) {
                throw new Error('无法获取页面内容');
            }

            // 发送到后台进行 AI 总结
            chrome.runtime.sendMessage(
                {
                    action: 'summarize',
                    content: pageContent.content
                },
                response => {
                    if (chrome.runtime.lastError) {
                        summaryDiv.textContent = '生成总结时发生错误：' + chrome.runtime.lastError.message;
                        summaryDiv.className = '';
                        return;
                    }
                    if (response.error) {
                        summaryDiv.textContent = response.error;
                        summaryDiv.className = '';
                        return;
                    }
                    summaryDiv.textContent = response.summary;
                    summaryDiv.className = '';
                }
            );
        } catch (error) {
            summaryDiv.textContent = '发生错误：' + error.message;
            summaryDiv.className = '';
        }
    });
}); 
async function getConfig() {
    return await chrome.storage.sync.get({
        apiKey: 'sk-vmxSDuixD4FRyKi_Eg1a1blINMcyReRySf3EXZGvEJ1HWCvRuQ5ENrd6fhQ',
        apiEndpoint: 'https://api.uniapi.io',
        apiPath: '/v1/chat/completions',
        modelName: 'gpt-4o-mini',
        temperature: 0.7,
        systemPrompt: `作为文本总结助手，请将用户输入的文本进行总结。要求：
1. 只关注问题本身，不提供解决方案
2. 使用简体中文，保持专业术语
3. 输出格式为 markdown 列表
4. 相关内容合并为一点
5. 删除重复信息
6. 按重要性排序`
    });
}

async function summarizeContent(content) {
    try {
        const config = await getConfig();
        console.log('content:', content);
        
        // 检查 API 密钥是否存在
        if (!config.apiKey) {
            throw new Error('请先配置 API 密钥');
        }

        console.log('Sending request to:', `${config.apiEndpoint}${config.apiPath}`);
        console.log('Using config:', {
            model: config.modelName,
            temperature: config.temperature
        });

        const response = await fetch(`${config.apiEndpoint}${config.apiPath}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify({
                model: config.modelName,
                temperature: config.temperature,
                messages: [
                    {
                        role: 'system',
                        content: config.systemPrompt
                    },
                    {
                        role: 'user',
                        content: content
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('API response error:', response.status, errorData);
            throw new Error(`API 请求失败: ${response.status} ${errorData}`);
        }

        const data = await response.json();
        console.log('API response:', data);

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('API 返回数据格式错误');
        }

        return data.choices[0].message.content;
    } catch (error) {
        console.error('AI 总结出错:', error);
        throw new Error(error.message || '生成总结时发生错误，请稍后重试');
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'summarize') {
        summarizeContent(request.content)
            .then(summary => {
                console.log('Sending summary back to popup');
                sendResponse({summary});
            })
            .catch(error => {
                console.error('Error in summarizeContent:', error);
                sendResponse({error: error.message});
            });
        return true;
    }
}); 
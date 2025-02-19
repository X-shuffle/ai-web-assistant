// 确保代码在页面加载完成后执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeContentScript);
} else {
    initializeContentScript();
}

function initializeContentScript() {
    function extractPageContent() {
        // 获取选中的文本
        const selectedText = window.getSelection().toString().trim();
        
        // 如果没有选中文本，提示用户
        if (!selectedText) {
            throw new Error('请先选择要总结的文本内容');
        }
        
        // 只返回选中的内容
        return {
            content: selectedText
        };
    }

    // 监听来自 popup 或 background 的消息
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log('Content script received message:', request);
        if (request.action === 'getPageContent') {
            try {
                const content = extractPageContent();
                console.log('Extracted content:', content);
                sendResponse(content);
            } catch (error) {
                console.error('Error extracting content:', error);
                sendResponse({ error: error.message });
            }
        }
        return true; // 保持消息通道开放
    });
} 
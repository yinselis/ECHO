// 这是一个后台服务执照，用于激活安卓手机的系统通知，并处理点击事件
self.addEventListener('fetch', function(event) {
    // 保持空的 fetch 监听，骗过浏览器的 PWA 校验
});

// 监听用户点击系统通知的事件
self.addEventListener('notificationclick', function(event) {
    // 1. 点击后，先关闭屏幕上弹出的这条通知横幅
    event.notification.close(); 
    
    // 2. 告诉手机：去后台找找看我们的聊天网页还在不在
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                // 如果网页已经在后台打开了，直接把它强行拉到前台（聚焦）
                if (client.url.includes(self.registration.scope) && 'focus' in client) {
                    return client.focus();
                }
            }
            // 如果你在后台把浏览器彻底划掉杀死了，那就重新打开这个网页
            if (clients.openWindow) {
                return clients.openWindow(self.registration.scope); 
            }
        })
    );
});
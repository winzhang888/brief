// 登录验证管理
class LoginManager {
    constructor() {
        this.credentials = {
            username: 'win.zhang',
            password: 'admin'
        };
        this.init();
    }

    // 初始化登录页面
    init() {
        this.bindEvents();
        this.checkLoginStatus();
        this.addKeyboardSupport();
    }

    // 绑定事件
    bindEvents() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // 输入框焦点事件
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                this.clearMessages();
            });
        });
    }

    // 处理登录
    handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const loginBtn = document.querySelector('.login-btn');

        // 验证输入
        if (!username || !password) {
            this.showMessage('请填写完整的登录信息', 'error');
            return;
        }

        // 显示加载状态
        this.setLoadingState(loginBtn, true);

        // 模拟网络延迟
        setTimeout(() => {
            if (this.validateCredentials(username, password)) {
                this.loginSuccess();
            } else {
                this.loginFailed();
            }
            this.setLoadingState(loginBtn, false);
        }, 1000);
    }

    // 验证凭据
    validateCredentials(username, password) {
        // 检查用户名
        if (username !== this.credentials.username) {
            return false;
        }
        
        // 检查是否有自定义密码
        const customPassword = localStorage.getItem('adminPassword');
        if (customPassword) {
            return password === customPassword;
        }
        
        // 使用默认密码
        return password === this.credentials.password;
    }

    // 登录成功
    loginSuccess() {
        // 保存登录状态到sessionStorage（关闭窗口后失效）
        sessionStorage.setItem('adminLoggedIn', 'true');
        
        this.showMessage('登录成功！正在跳转...', 'success');
        
        // 延迟跳转到管理界面
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1500);
    }

    // 登录失败
    loginFailed() {
        this.showMessage('用户名或密码错误，请重试', 'error');
        
        // 清空密码字段
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
        
        // 添加抖动效果
        this.shakeForm();
    }

    // 检查登录状态
    checkLoginStatus() {
        const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
        
        if (isLoggedIn) {
            // 如果已登录，直接跳转到管理界面
            window.location.href = 'admin.html';
        }
    }

    // 清除登录状态
    clearLoginStatus() {
        sessionStorage.removeItem('adminLoggedIn');
    }

    // 显示消息
    showMessage(message, type = 'info') {
        this.clearMessages();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.textContent = message;
        
        const form = document.querySelector('.login-form');
        form.insertBefore(messageDiv, form.firstChild);
        
        // 自动移除消息
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    // 清除消息
    clearMessages() {
        const messages = document.querySelectorAll('.error-message, .success-message');
        messages.forEach(msg => msg.remove());
    }

    // 设置加载状态
    setLoadingState(button, isLoading) {
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 登录中...';
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-sign-in-alt"></i> 登录';
        }
    }

    // 表单抖动效果
    shakeForm() {
        const form = document.querySelector('.login-form');
        form.style.animation = 'errorShake 0.5s ease-in-out';
        
        setTimeout(() => {
            form.style.animation = '';
        }, 500);
    }

    // 添加键盘支持
    addKeyboardSupport() {
        document.addEventListener('keydown', (e) => {
            // Enter键提交表单
            if (e.key === 'Enter') {
                const activeElement = document.activeElement;
                if (activeElement.tagName === 'INPUT') {
                    const form = document.getElementById('loginForm');
                    if (form) {
                        form.dispatchEvent(new Event('submit'));
                    }
                }
            }
            
            // Escape键清空表单
            if (e.key === 'Escape') {
                this.clearForm();
            }
        });
    }

    // 清空表单
    clearForm() {
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('username').focus();
        this.clearMessages();
    }

    // 自动填充测试账号（仅开发环境）
    autoFillTestCredentials() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            document.getElementById('username').value = this.credentials.username;
            document.getElementById('password').value = this.credentials.password;
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.loginManager = new LoginManager();
    
    // 开发环境自动填充测试账号
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setTimeout(() => {
            window.loginManager.autoFillTestCredentials();
        }, 1000);
    }
});

// 防止表单重复提交
let isSubmitting = false;

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            if (isSubmitting) {
                e.preventDefault();
                return;
            }
            
            isSubmitting = true;
            setTimeout(() => {
                isSubmitting = false;
            }, 2000);
        });
    }
});

// 输入验证增强
document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    if (usernameInput) {
        usernameInput.addEventListener('input', (e) => {
            const value = e.target.value;
            if (value.length > 20) {
                e.target.value = value.substring(0, 20);
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
            const value = e.target.value;
            if (value.length > 50) {
                e.target.value = value.substring(0, 50);
            }
        });
    }
});

// 记住用户名功能
document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
        // 加载保存的用户名
        const savedUsername = localStorage.getItem('rememberedUsername');
        if (savedUsername) {
            usernameInput.value = savedUsername;
        }
        
        // 保存用户名
        usernameInput.addEventListener('blur', () => {
            const username = usernameInput.value.trim();
            if (username) {
                localStorage.setItem('rememberedUsername', username);
            }
        });
    }
});

// 安全增强：防止暴力破解
class SecurityManager {
    constructor() {
        this.failedAttempts = 0;
        this.maxAttempts = 5;
        this.lockoutDuration = 15 * 60 * 1000; // 15分钟
        this.init();
    }

    init() {
        this.loadFailedAttempts();
        this.checkLockoutStatus();
    }

    recordFailedAttempt() {
        this.failedAttempts++;
        this.saveFailedAttempts();
        
        if (this.failedAttempts >= this.maxAttempts) {
            this.lockoutAccount();
        }
    }

    recordSuccessfulAttempt() {
        this.failedAttempts = 0;
        this.saveFailedAttempts();
        localStorage.removeItem('lockoutTime');
    }

    lockoutAccount() {
        const lockoutTime = Date.now() + this.lockoutDuration;
        localStorage.setItem('lockoutTime', lockoutTime.toString());
        this.showLockoutMessage();
    }

    checkLockoutStatus() {
        const lockoutTime = localStorage.getItem('lockoutTime');
        if (lockoutTime) {
            const currentTime = Date.now();
            const lockoutEnd = parseInt(lockoutTime);
            
            if (currentTime < lockoutEnd) {
                this.showLockoutMessage();
                this.disableForm();
            } else {
                localStorage.removeItem('lockoutTime');
                this.enableForm();
            }
        }
    }

    showLockoutMessage() {
        const remainingTime = Math.ceil((parseInt(localStorage.getItem('lockoutTime')) - Date.now()) / 1000 / 60);
        const message = `账户已被锁定，请等待 ${remainingTime} 分钟后重试`;
        window.loginManager.showMessage(message, 'error');
    }

    disableForm() {
        const form = document.getElementById('loginForm');
        const inputs = form.querySelectorAll('input, button');
        inputs.forEach(input => {
            input.disabled = true;
        });
    }

    enableForm() {
        const form = document.getElementById('loginForm');
        const inputs = form.querySelectorAll('input, button');
        inputs.forEach(input => {
            input.disabled = false;
        });
    }

    loadFailedAttempts() {
        const saved = localStorage.getItem('failedAttempts');
        if (saved) {
            this.failedAttempts = parseInt(saved);
        }
    }

    saveFailedAttempts() {
        localStorage.setItem('failedAttempts', this.failedAttempts.toString());
    }
}

// 初始化安全管理器
document.addEventListener('DOMContentLoaded', () => {
    window.securityManager = new SecurityManager();
});

// 修改登录验证逻辑以集成安全管理
const originalValidateCredentials = LoginManager.prototype.validateCredentials;
LoginManager.prototype.validateCredentials = function(username, password) {
    const isValid = originalValidateCredentials.call(this, username, password);
    
    if (isValid) {
        window.securityManager.recordSuccessfulAttempt();
    } else {
        window.securityManager.recordFailedAttempt();
    }
    
    return isValid;
};

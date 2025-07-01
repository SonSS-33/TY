(function () {
    'use strict';

    const CONFIG = {
        loginPage: 'login.html',
        homePage: 'index.html',
        validUsers: window.AUTH_USERS || {}
      };

    window.auth = {
        isLoggedIn: function () {
            return sessionStorage.getItem('isLoggedIn') === 'true';
        },

        getCurrentUser: function () {
            return sessionStorage.getItem('currentUser');
        },

        login: function (username, password) {
            if (CONFIG.validUsers[username] && CONFIG.validUsers[username] === password) {
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('currentUser', username);
                sessionStorage.setItem('loginTime', new Date().toISOString());
                return { success: true, message: 'Đăng nhập thành công!' };
            }
            return { success: false, message: 'Sai tài khoản hoặc mật khẩu!' };
        },

        logout: function () {
            sessionStorage.clear();
            this.showLogoutMessage();
            setTimeout(() => {
                window.location.href = CONFIG.loginPage;
            }, 1500);
        },

        checkAuth: function () {
            const currentPage = window.location.pathname.split('/').pop() || CONFIG.homePage;
            if (currentPage === CONFIG.loginPage && this.isLoggedIn()) {
                const returnUrl = sessionStorage.getItem('returnUrl') || CONFIG.homePage;
                sessionStorage.removeItem('returnUrl');
                window.location.href = returnUrl;
            } else if (!this.isLoggedIn() && currentPage !== CONFIG.loginPage) {
                sessionStorage.setItem('returnUrl', currentPage);
                this.showLoginRequired();
            } else if (this.isLoggedIn()) {
                this.showWelcome();
            }
        },

        showLoginRequired: function () {
            document.body.style.filter = 'blur(5px)';
            document.body.style.pointerEvents = 'none';
            const overlay = document.createElement('div');
            overlay.innerHTML = `
                <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:9999;font-family:'Segoe UI',sans-serif;">
                    <div style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:40px;border-radius:20px;text-align:center;box-shadow:0 25px 50px rgba(0,0,0,0.3);animation:bounceIn 0.6s ease;max-width:400px;">
                        <div style="font-size:60px;margin-bottom:20px;">🔐</div>
                        <h2 style="margin:0 0 15px;font-size:24px;">Yêu cầu đăng nhập</h2>
                        <p style="margin:0 0 25px;opacity:0.9;">Bạn cần đăng nhập để truy cập trang này</p>
                        <div id="countdown" style="background:rgba(255,255,255,0.1);padding:15px;border-radius:10px;font-size:14px;">Chuyển hướng trong <span id="timer">3</span> giây...</div>
                    </div>
                </div>
                <style>@keyframes bounceIn {0%{opacity:0;transform:scale(0.3);}50%{opacity:1;transform:scale(1.05);}70%{transform:scale(0.9);}100%{transform:scale(1);}}</style>`;
            document.body.appendChild(overlay);
            let countdown = 3;
            const timerInterval = setInterval(() => {
                countdown--;
                document.getElementById('timer').textContent = countdown;
                if (countdown <= 0) {
                    clearInterval(timerInterval);
                    window.location.href = CONFIG.loginPage;
                }
            }, 1000);
        },

        showLogoutMessage: function () {
            const overlay = document.createElement('div');
            overlay.innerHTML = `
                <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:9999;font-family:'Segoe UI',sans-serif;">
                    <div style="background:linear-gradient(135deg,#ff6b6b,#ee5a24);color:white;padding:40px;border-radius:20px;text-align:center;box-shadow:0 25px 50px rgba(0,0,0,0.3);animation:bounceIn 0.6s ease;">
                        <div style="font-size:60px;margin-bottom:20px;">👋</div>
                        <h2 style="margin:0 0 15px;">Đã đăng xuất</h2>
                        <p style="margin:0;opacity:0.9;">Cảm ơn bạn đã sử dụng!</p>
                    </div>
                </div>`;
            document.body.appendChild(overlay);
        },

        showWelcome: function () {
            if (sessionStorage.getItem('welcomed') === 'true') return;
            const welcome = document.createElement('div');
            welcome.innerHTML = `
                <div style="position:fixed;top:20px;right:20px;background:linear-gradient(135deg,#4CAF50,#45a049);color:white;padding:15px 25px;border-radius:50px;box-shadow:0 10px 25px rgba(76,175,80,0.3);z-index:1000;animation:slideInRight 0.5s ease;cursor:pointer;font-weight:600;font-family:'Segoe UI',sans-serif;" onclick="this.remove()">
                    👋 Xin chào, ${this.getCurrentUser()}!
                </div>
                <style>@keyframes slideInRight {from {transform:translateX(100%);opacity:0;} to {transform:translateX(0);opacity:1;}}</style>`;
            document.body.appendChild(welcome);
            sessionStorage.setItem('welcomed', 'true');
            setTimeout(() => { if (welcome.parentNode) welcome.remove(); }, 5000);
        },

        createLogoutButton: function () {
            if (document.getElementById('logout-btn')) return;
            const logoutBtn = document.createElement('div');
            logoutBtn.innerHTML = `
                <button id="logout-btn" onclick="auth.logout()" style="position:fixed;top:20px;left:20px;background:linear-gradient(135deg,#ff6b6b,#ee5a24);color:white;border:none;padding:12px 20px;border-radius:25px;cursor:pointer;font-weight:600;z-index:1000;box-shadow:0 5px 15px rgba(255,107,107,0.3);transition:all 0.3s ease;font-family:'Segoe UI',sans-serif;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'"><span>🚪 Đăng xuất</span></button>`;
            document.body.appendChild(logoutBtn);
        },

        redirectToHome: function () {
            window.location.href = "index.html";
        }
    };

    function init() {
        auth.checkAuth();
        if (!auth.isLoggedIn()) {
            document.querySelectorAll('a[href]').forEach(link => {
                link.addEventListener('click', function (event) {
                    event.preventDefault();
                    sessionStorage.setItem('returnUrl', this.getAttribute('href'));
                    auth.showLoginRequired();
                });
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init(); 
    }
})();

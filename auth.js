// auth-check.js
// (function checkAuth() {
//     if (localStorage.getItem("isLoggedIn") !== "true") {
//       window.location.href = "login.html";
//     }
//   })();

// auth.js - Tệp JavaScript chung cho authentication
(function() {
  'use strict';

  // Kiểm tra authentication khi trang load
  function checkAuthentication() {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const expireTime = parseInt(localStorage.getItem('loginExpire'));
      const userName = localStorage.getItem('userName');

      // Kiểm tra xem đã đăng nhập và chưa hết hạn
      if (!isLoggedIn || !expireTime || Date.now() > expireTime) {
          // Xóa dữ liệu cũ
          localStorage.clear();
          
          // Hiển thị thông báo và chuyển hướng
          showLoginAlert('🔒 Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 'warning');
          
          setTimeout(() => {
              window.location.href = 'login.html';
          }, 2000);
          
          return false;
      }

      // Nếu đã đăng nhập, hiển thị thông tin user
      displayUserInfo(userName);
      return true;
  }

  // Hiển thị thông tin user đã đăng nhập
  function displayUserInfo(userName) {
      // Tạo user info bar
      const userInfoBar = document.createElement('div');
      userInfoBar.className = 'user-info-bar';
      userInfoBar.innerHTML = `
          <div class="user-welcome">
              <span class="welcome-text">💕 Xin chào, ${userName}!</span>
              <button class="logout-btn" onclick="logout()">Đăng xuất</button>
          </div>
      `;

      // Thêm CSS cho user info bar
      const userInfoStyle = document.createElement('style');
      userInfoStyle.textContent = `
          .user-info-bar {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              background: linear-gradient(135deg, #667eea, #764ba2);
              color: white;
              padding: 10px 20px;
              z-index: 1001;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              animation: slideDown 0.5s ease-out;
          }

          .user-welcome {
              display: flex;
              justify-content: space-between;
              align-items: center;
              max-width: 400px;
              margin: 0 auto;
          }

          .welcome-text {
              font-size: 14px;
              font-weight: 600;
          }

          .logout-btn {
              background: rgba(255, 255, 255, 0.2);
              color: white;
              border: none;
              padding: 5px 12px;
              border-radius: 15px;
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
          }

          .logout-btn:hover {
              background: rgba(255, 255, 255, 0.3);
              transform: translateY(-1px);
          }

          @keyframes slideDown {
              from {
                  transform: translateY(-100%);
                  opacity: 0;
              }
              to {
                  transform: translateY(0);
                  opacity: 1;
              }
          }

          /* Điều chỉnh container để tránh bị che */
          body {
              padding-top: 45px;
          }

          @media (max-width: 480px) {
              .user-info-bar {
                  padding: 8px 15px;
              }
              
              .welcome-text {
                  font-size: 13px;
              }
              
              .logout-btn {
                  padding: 4px 10px;
                  font-size: 11px;
              }
              
              body {
                  padding-top: 40px;
              }
          }
      `;

      document.head.appendChild(userInfoStyle);
      document.body.prepend(userInfoBar);

      // Auto-hide sau 10 giây
      setTimeout(() => {
          userInfoBar.style.animation = 'slideUp 0.5s ease-in forwards';
          userInfoBar.addEventListener('animationend', () => {
              userInfoBar.style.transform = 'translateY(-100%)';
              document.body.style.paddingTop = '0';
          });
      }, 10000);

      // Thêm animation slideUp
      const slideUpStyle = document.createElement('style');
      slideUpStyle.textContent = `
          @keyframes slideUp {
              from {
                  transform: translateY(0);
                  opacity: 1;
              }
              to {
                  transform: translateY(-100%);
                  opacity: 0;
              }
          }
      `;
      document.head.appendChild(slideUpStyle);
  }

  // Hiển thị alert đăng nhập
  function showLoginAlert(message, type = 'info') {
      const alertDiv = document.createElement('div');
      alertDiv.className = 'auth-alert';

      let bgColor;
      switch(type) {
          case 'success':
              bgColor = 'linear-gradient(135deg, #27ae60, #2ecc71)';
              break;
          case 'error':
              bgColor = 'linear-gradient(135deg, #e74c3c, #c0392b)';
              break;
          case 'warning':
              bgColor = 'linear-gradient(135deg, #f39c12, #e67e22)';
              break;
          default:
              bgColor = 'linear-gradient(135deg, #667eea, #764ba2)';
      }

      alertDiv.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: ${bgColor};
          color: white;
          padding: 20px 30px;
          border-radius: 15px;
          font-weight: 600;
          font-size: 16px;
          z-index: 10000;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
          animation: alertFadeIn 0.5s ease-out;
          text-align: center;
          max-width: 90%;
          backdrop-filter: blur(10px);
      `;

      alertDiv.textContent = message;

      // Thêm CSS animation
      const alertStyle = document.createElement('style');
      alertStyle.textContent = `
          @keyframes alertFadeIn {
              from {
                  opacity: 0;
                  transform: translate(-50%, -50%) scale(0.8);
              }
              to {
                  opacity: 1;
                  transform: translate(-50%, -50%) scale(1);
              }
          }
      `;
      document.head.appendChild(alertStyle);

      document.body.appendChild(alertDiv);

      setTimeout(() => {
          alertDiv.style.animation = 'alertFadeOut 0.5s ease-in forwards';
          setTimeout(() => {
              alertDiv.remove();
          }, 500);
      }, 3000);

      // Thêm fade out animation
      const fadeOutStyle = document.createElement('style');
      fadeOutStyle.textContent = `
          @keyframes alertFadeOut {
              from {
                  opacity: 1;
                  transform: translate(-50%, -50%) scale(1);
              }
              to {
                  opacity: 0;
                  transform: translate(-50%, -50%) scale(0.8);
              }
          }
      `;
      document.head.appendChild(fadeOutStyle);
  }

  // Hàm đăng xuất
  window.logout = function() {
      // Hiển thị confirmation
      const confirmed = confirm('💔 Bạn có chắc muốn đăng xuất không?');
      
      if (confirmed) {
          // Xóa dữ liệu đăng nhập
          localStorage.clear();
          
          // Hiển thị thông báo
          showLoginAlert('👋 Đã đăng xuất thành công. Hẹn gặp lại!', 'success');
          
          // Chuyển hướng về trang login sau 2 giây
          setTimeout(() => {
              window.location.href = 'login.html';
          }, 2000);
      }
  };

  // Refresh token trước khi hết hạn
  function refreshSession() {
      const expireTime = parseInt(localStorage.getItem('loginExpire'));
      const currentTime = Date.now();
      const timeLeft = expireTime - currentTime;

      // Nếu còn ít hơn 10 phút, gia hạn session
      if (timeLeft < 10 * 60 * 1000 && timeLeft > 0) {
          const newExpireTime = Date.now() + 60 * 60 * 1000; // Gia hạn thêm 1 giờ
          localStorage.setItem('loginExpire', newExpireTime.toString());
          showLoginAlert('⏰ Phiên đăng nhập đã được gia hạn', 'info');
      }
  }

  // Kiểm tra session mỗi 5 phút
  setInterval(() => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (isLoggedIn) {
          refreshSession();
      }
  }, 5 * 60 * 1000);

  // Chạy kiểm tra khi trang load
  document.addEventListener('DOMContentLoaded', function() {
      // Chỉ kiểm tra nếu không phải trang login
      if (!window.location.pathname.includes('login.html')) {
          checkAuthentication();
      }
  });

  // Export functions để có thể sử dụng ở nơi khác
  window.AuthSystem = {
      checkAuth: checkAuthentication,
      showAlert: showLoginAlert,
      logout: window.logout
  };

})();
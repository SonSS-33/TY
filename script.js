
// Tạo trái tim bay
function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.innerHTML = "💖";
  heart.innerHTML = "🥰";
  heart.style.left = Math.random() * 100 + "%";
  heart.style.animationDuration = Math.random() * 3 + 3 + "s";
  heart.style.fontSize = Math.random() * 20 + 15 + "px";

  document.getElementById("heartsContainer").appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 6000);
}

// Tạo trái tim liên tục
setInterval(createHeart, 400);

// Đếm thời gian yêu nhau (từ 2024-09-04)
function updateLoveCounter() {
  const startDate = new Date("2024-09-04");
  const now = new Date();
  const diff = now - startDate;

  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));

  document.getElementById("years").textContent = years;
  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = hours.toLocaleString();
  document.getElementById("minutes").textContent =
    minutes.toLocaleString();
}

// Cập nhật counter mỗi phút
updateLoveCounter();
setInterval(updateLoveCounter, 60000);

// Hiệu ứng click cho ảnh gallery
document.querySelectorAll(".photo-item").forEach((item) => {
  item.addEventListener("click", function () {
    this.style.transform = "scale(0.95)";
    setTimeout(() => {
      this.style.transform = "scale(1.05)";
    }, 100);
    setTimeout(() => {
      this.style.transform = "scale(1)";
    }, 200);
  });
});

// Hiệu ứng scroll cho timeline items
function animateOnScroll() {
  const items = document.querySelectorAll(".timeline-item");
  items.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisible) {
      item.style.opacity = "1";
      item.style.transform = "translateY(0)";
    }
  });
}

// Khởi tạo opacity cho timeline items
document.querySelectorAll(".timeline-item").forEach((item) => {
  item.style.opacity = "0";
  item.style.transform = "translateY(50px)";
  item.style.transition = "opacity 0.6s ease, transform 0.6s ease";
});

// Lắng nghe scroll event
window.addEventListener("scroll", animateOnScroll);
window.addEventListener("load", animateOnScroll);

const toggle = document.getElementById("mobileToggle");
const links = document.getElementById("navLinks");

toggle.addEventListener("click", () => {
  links.classList.toggle("show");
});


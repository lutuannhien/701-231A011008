// js/script.js
document.addEventListener("DOMContentLoaded", () => {
    // --- BÀI 1: DANH SÁCH SẢN PHẨM & TÌM KIẾM ---
    const products = [
        { id: 1, name: "Laptop Gaming ASUS ROG", price: "22.500.000 VNĐ" },
        { id: 2, name: "Chuột Không Dây Logitech MX", price: "450.000 VNĐ" },
        { id: 3, name: "Bàn Phím Cơ RGB Keychron", price: "1.200.000 VNĐ" },
        { id: 4, name: "Màn Hình Dell UltraSharp 27\"", price: "5.800.000 VNĐ" },
        { id: 5, name: "Tai Nghe Chống Ồn Sony WH", price: "3.200.000 VNĐ" }
    ];

    const productContainer = document.getElementById("productContainer");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const searchError = document.getElementById("searchError");

    function renderProducts(list) {
        if (!productContainer) return;
        productContainer.innerHTML = "";
        if (list.length === 0) {
            searchError.style.display = "block";
            return;
        }
        searchError.style.display = "none";
        list.forEach(p => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `<h3><i class="fa-solid fa-box-open" style="color:var(--primary)"></i> ${escapeHTML(p.name)}</h3><p>${escapeHTML(p.price)}</p>`;
            productContainer.appendChild(card);
        });
    }

    // Chống XSS Injection cho input người dùng
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    function handleSearch() {
        if (!searchInput) return;
        const keyword = searchInput.value.trim().toLowerCase();
        const filtered = products.filter(p => p.name.toLowerCase().includes(keyword));
        renderProducts(filtered);
    }

    if (searchBtn && searchInput) {
        searchBtn.addEventListener("click", handleSearch);
        searchInput.addEventListener("keyup", handleSearch);
        renderProducts(products);
    }

    // --- BÀI 2: ĐĂNG KÝ NGƯỜI DÙNG & LOCALSTORAGE ---
    const registerForm = document.getElementById("registerForm");
    const regAlert = document.getElementById("regAlert");

    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("regName").value.trim();
            const email = document.getElementById("regEmail").value.trim();
            const password = document.getElementById("regPassword").value;
            const terms = document.getElementById("regTerms").checked;

            // Validate mật khẩu: ít nhất 8 ký tự, có chữ hoa, chữ thường, số
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

            if (!passwordRegex.test(password)) {
                showAlert(regAlert, "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số!", "danger");
                return;
            }

            if (!terms) {
                showAlert(regAlert, "Bạn phải đồng ý với điều khoản sử dụng!", "danger");
                return;
            }

            // Lưu dữ liệu vào LocalStorage
            const userData = { name, email, registeredAt: new Date().toISOString() };
            localStorage.setItem("currentUser", JSON.stringify(userData));

            showAlert(regAlert, "Đăng ký thành công và đã lưu dữ liệu cục bộ!", "success");
            registerForm.reset();
        });
    }

    function showAlert(element, message, type) {
        if (!element) return;
        element.innerHTML = `<i class="fa-solid ${type === "success" ? "fa-circle-check" : "fa-triangle-exclamation"}"></i> ${message}`;
        element.className = `alert-msg alert-${type === "success" ? "success" : "danger"}`;
        element.style.display = "block";
    }

    // --- BÀI 3: ĐỒNG HỒ ĐẾM NGƯỢC (10 PHÚT) ---
    const timerDisplay = document.getElementById("timerDisplay");
    const startTimerBtn = document.getElementById("startTimer");
    const resetTimerBtn = document.getElementById("resetTimer");

    let totalSeconds = 10 * 60;
    let timerInterval = null;

    function updateTimerDisplay() {
        if (!timerDisplay) return;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        // Hiệu ứng cảnh báo khi dưới 1 phút
        if (totalSeconds < 60) {
            timerDisplay.classList.add("warning-anim");
        } else {
            timerDisplay.classList.remove("warning-anim");
        }
    }

    if (startTimerBtn) {
        startTimerBtn.addEventListener("click", () => {
            if (timerInterval) return; // Tránh tạo nhiều interval gây memory leak
            timerInterval = setInterval(() => {
                if (totalSeconds > 0) {
                    totalSeconds--;
                    updateTimerDisplay();
                } else {
                    clearInterval(timerInterval);
                    timerInterval = null;
                    alert("⏰ Đã hết thời gian làm bài!");
                }
            }, 1000);
        });

        resetTimerBtn.addEventListener("click", () => {
            clearInterval(timerInterval);
            timerInterval = null;
            totalSeconds = 10 * 60;
            updateTimerDisplay();
            if (timerDisplay) timerDisplay.classList.remove("warning-anim");
        });
    }
});
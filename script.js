// ========================================
// ข้อมูลตัวอย่าง
// ========================================

const recentPolls = [
    {
        id: 1,
        title: "ดัชนีความเชื่อมั่นทางการเมือง ประจำเดือนพฤศจิกายน 2567",
        category: "การเมือง",
        date: "15 พ.ย. 2567",
        respondents: 1842,
        description: "สำรวจความเชื่อมั่นของประชาชนต่อสถานการณ์ทางการเมืองในปัจจุบัน"
    },
    {
        id: 2,
        title: "ทัศนคติต่อการท่องเที่ยวในช่วงปลายปี",
        category: "เศรษฐกิจ",
        date: "10 พ.ย. 2567",
        respondents: 2156,
        description: "ความพร้อมและแผนการท่องเที่ยวของคนไทยในช่วงสิ้นปี"
    },
    {
        id: 3,
        title: "ความคาดหวังต่อการศึกษาไทยในอนาคต",
        category: "การศึกษา",
        date: "5 พ.ย. 2567",
        respondents: 1634,
        description: "ประเมินความคิดเห็นต่อทิศทางการศึกษาไทยในอีก 5 ปีข้างหน้า"
    },
    {
        id: 4,
        title: "พฤติกรรมการใช้โซเชียลมีเดียของคนไทย",
        category: "สังคม",
        date: "1 พ.ย. 2567",
        respondents: 2341,
        description: "วิเคราะห์รูปแบบการใช้สื่อออนไลน์ในยุคดิจิทัล"
    }
];

const allPolls = [
    ...recentPolls,
    {
        id: 5,
        title: "ความพึงพอใจต่อระบบขนส่งสาธารณะ",
        category: "สังคม",
        date: "28 ต.ค. 2567",
        respondents: 1923,
        year: "2567"
    },
    {
        id: 6,
        title: "ทัศนคติต่อพลังงานสะอาด",
        category: "เศรษฐกิจ",
        date: "20 ต.ค. 2567",
        respondents: 1756,
        year: "2567"
    },
    {
        id: 7,
        title: "ความคิดเห็นต่อระบบสุขภาพไทย",
        category: "สังคม",
        date: "15 ต.ค. 2567",
        respondents: 2087,
        year: "2567"
    }
];

const insights = [
    {
        id: 1,
        title: "บทวิเคราะห์: ปัจจัยที่ส่งผลต่อความเชื่อมั่นทางการเมือง",
        excerpt: "วิเคราะห์เชิงลึกถึงปัจจัยต่างๆ ที่มีผลต่อดัชนีความเชื่อมั่นทางการเมืองของประชาชน รวมถึงแนวโน้มในอนาคต...",
        date: "18 พ.ย. 2567",
        icon: "📊"
    },
    {
        id: 2,
        title: "บทวิเคราะห์: เศรษฐกิจไทยในมุมมองประชาชน",
        excerpt: "สำรวจความคิดเห็นและความกังวลของประชาชนต่อสถานการณ์เศรษฐกิจ พร้อมข้อเสนอแนะเชิงนโยบาย...",
        date: "12 พ.ย. 2567",
        icon: "💰"
    },
    {
        id: 3,
        title: "บทวิเคราะห์: การศึกษาไทยในยุคดิจิทัล",
        excerpt: "ทิศทางและความท้าทายของระบบการศึกษาไทยในยุคที่เทคโนโลยีเข้ามามีบทบาทสำคัญ...",
        date: "8 พ.ย. 2567",
        icon: "🎓"
    }
];

const news = [
    {
        id: 1,
        title: "ThaiPoll เปิดตัวแพลตฟอร์มใหม่",
        description: "พัฒนาระบบแสดงผลสำรวจแบบ Interactive ให้ง่ายต่อการเข้าถึงและเข้าใจมากขึ้น",
        date: "19 พ.ย. 2567",
        icon: "🚀"
    },
    {
        id: 2,
        title: "ความร่วมมือกับมหาวิทยาลัยชั้นนำ",
        description: "ลงนามบันทึกความเข้าใจกับ 5 มหาวิทยาลัยเพื่อพัฒนาการวิจัยเชิงสำรวจร่วมกัน",
        date: "14 พ.ย. 2567",
        icon: "🤝"
    },
    {
        id: 3,
        title: "จัดอบรมเชิงปฏิบัติการ",
        description: "เปิดอบรมหลักสูตร 'การทำโพลอย่างมืออาชีพ' สำหรับนักศึกษาและบุคคลทั่วไป",
        date: "7 พ.ย. 2567",
        icon: "📚"
    }
];

// ========================================
// Utility Functions
// ========================================

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Number animation (count up)
function animateNumber(element, target) {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, duration / steps);
}

// Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('.lazy-image');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ========================================
// Loading Screen
// ========================================
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 800);
}

// ========================================
// Scroll to Top Button
// ========================================
function setupScrollTopButton() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// Header Scroll Effect
// ========================================
function setupHeaderScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ========================================
// Animate Numbers in Hero
// ========================================
function animateHeroStats() {
    const statNumbers = document.querySelectorAll('.hero-stat-item .stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                animateNumber(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// ========================================
// Animate Progress Bars
// ========================================
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.dataset.progress;
                setTimeout(() => {
                    entry.target.style.width = progress + '%';
                }, 200);
                observer.unobserve(entry.target);
            }
        });
    });
    
    progressBars.forEach(bar => observer.observe(bar));
}

// ========================================
// SweetAlert2 Functions
// ========================================
function showPollDetail() {
    Swal.fire({
        title: 'รายงานฉบับเต็ม',
        html: `
            <div style="text-align: left; line-height: 1.8;">
                <h3 style="color: #26513C; margin-bottom: 15px;">ความคิดเห็นต่อนโยบายเศรษฐกิจดิจิทัลวอลเล็ต</h3>
                <p><strong>ระยะเวลาสำรวจ:</strong> 20-21 พฤศจิกายน 2567</p>
                <p><strong>จำนวนตัวอย่าง:</strong> 2,156 คน</p>
                <p><strong>วิธีการเก็บข้อมูล:</strong> สัมภาษณ์ทางโทรศัพท์</p>
                <p><strong>ค่าความคลาดเคลื่อน:</strong> ±2.13% ที่ระดับความเชื่อมั่น 95%</p>
                <hr style="margin: 20px 0;">
                <h4 style="color: #26513C;">สรุปผลสำรวจ</h4>
                <p>ผลการสำรวจพบว่าประชาชนส่วนใหญ่ (54.3%) เห็นด้วยกับนโยบายดังกล่าว โดยเฉพาะในกลุ่มผู้มีรายได้น้อยและปานกลาง ขณะที่ผู้ไม่เห็นด้วย (28.7%) ส่วนใหญ่กังวลเรื่องความยั่งยืนและผลกระทบต่อการคลัง</p>
                <p style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #26513C;">
                    <strong>หมายเหตุ:</strong> นี่เป็นข้อมูลตัวอย่างเท่านั้น ในการใช้งานจริงควรเชื่อมต่อกับฐานข้อมูลหรือ API
                </p>
            </div>
        `,
        icon: 'info',
        confirmButtonText: 'ปิด',
        confirmButtonColor: '#26513C',
        width: '600px'
    });
}

function showSuccessMessage(message) {
    Swal.fire({
        icon: 'success',
        title: 'สำเร็จ!',
        text: message,
        confirmButtonColor: '#27ae60',
        timer: 2000,
        timerProgressBar: true
    });
}

function showErrorMessage(message) {
    Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: message,
        confirmButtonColor: '#e74c3c'
    });
}

// ========================================
// Render Functions
// ========================================

function renderRecentPolls() {
    const container = document.getElementById('recentPolls');
    
    container.innerHTML = recentPolls.map(poll => `
        <div class="poll-card-small" data-aos="fade-up">
            <span class="poll-category">${poll.category}</span>
            <div class="poll-date">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                ${poll.date}
            </div>
            <h3 class="poll-title" style="font-size: 1.2em; margin: 15px 0;">${poll.title}</h3>
            <p class="poll-description">${poll.description}</p>
            <div class="poll-meta" style="margin-top: 20px; color: #7f8c8d; display: flex; align-items: center; gap: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>${poll.respondents.toLocaleString()} คน</span>
            </div>
        </div>
    `).join('');
}

function renderAllPolls(filters = {}) {
    const container = document.getElementById('allPolls');
    
    let filteredPolls = [...allPolls];
    
    if (filters.year && filters.year !== 'all') {
        filteredPolls = filteredPolls.filter(poll => 
            poll.year === filters.year || poll.date?.includes(filters.year.slice(-2))
        );
    }
    
    if (filters.category && filters.category !== 'all') {
        filteredPolls = filteredPolls.filter(poll => 
            poll.category?.toLowerCase() === getCategoryName(filters.category)
        );
    }
    
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredPolls = filteredPolls.filter(poll => 
            poll.title.toLowerCase().includes(searchTerm) ||
            poll.description?.toLowerCase().includes(searchTerm)
        );
    }
    
    if (filteredPolls.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #7f8c8d; padding: 60px 20px; font-size: 1.1em;">ไม่พบผลสำรวจที่ตรงกับเงื่อนไข</p>';
        return;
    }
    
    container.innerHTML = filteredPolls.map((poll, index) => `
        <div class="poll-item" data-aos="fade-up" data-aos-delay="${index * 50}">
            <div class="poll-info">
                <span class="poll-category">${poll.category}</span>
                <h3>${poll.title}</h3>
                <div class="poll-meta">
                    <span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 5px;">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        ${poll.date}
                    </span>
                    <span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 5px;">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        ${poll.respondents.toLocaleString()} คน
                    </span>
                </div>
            </div>
            <button class="btn btn-primary" onclick="showPollDetail()">
                <span>ดูรายงาน</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </button>
        </div>
    `).join('');
}

function getCategoryName(category) {
    const categories = {
        'politics': 'การเมือง',
        'economy': 'เศรษฐกิจ',
        'social': 'สังคม',
        'education': 'การศึกษา'
    };
    return categories[category] || category;
}

function renderInsights() {
    const container = document.getElementById('insightsList');
    
    container.innerHTML = insights.map((insight, index) => `
        <div class="insight-card" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="insight-image">${insight.icon}</div>
            <div class="insight-content">
                <h3 class="insight-title">${insight.title}</h3>
                <p class="insight-excerpt">${insight.excerpt}</p>
                <span class="insight-date">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle;">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    ${insight.date}
                </span>
            </div>
        </div>
    `).join('');
}

function renderNews() {
    const container = document.getElementById('newsList');
    
    container.innerHTML = news.map((item, index) => `
        <div class="news-item" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="news-icon">${item.icon}</div>
            <div class="news-content">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <span class="news-date">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 5px;">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    ${item.date}
                </span>
            </div>
        </div>
    `).join('');
}

// ========================================
// Navigation
// ========================================
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const footerLinks = document.querySelectorAll('.footer-section a[data-page]');
    
    function handleNavClick(e) {
        e.preventDefault();
        
        // Remove active from all nav links
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Add active to clicked link (only for header nav)
        if (this.classList.contains('nav-link')) {
            this.classList.add('active');
        }
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        const pageId = this.getAttribute('data-page');
        document.getElementById(pageId).classList.add('active');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Reinitialize AOS for new content
        setTimeout(() => {
            AOS.refresh();
        }, 100);
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    footerLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
}

// ========================================
// Filters
// ========================================
function setupFilters() {
    const yearFilter = document.getElementById('yearFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const searchInput = document.getElementById('searchPoll');
    
    function applyFilters() {
        const filters = {
            year: yearFilter?.value,
            category: categoryFilter?.value,
            search: searchInput?.value
        };
        renderAllPolls(filters);
    }
    
    yearFilter?.addEventListener('change', applyFilters);
    categoryFilter?.addEventListener('change', applyFilters);
    searchInput?.addEventListener('input', debounce(applyFilters, 300));
}

// ========================================
// Mobile Menu Toggle
// ========================================
function setupMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const nav = document.querySelector('.main-nav');
    
    toggle?.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
}

// ========================================
// Initialize
// ========================================
function init() {
    console.log('🚀 Initializing ThaiPoll Website');
    
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true,
        offset: 100
    });
    
    // Render all content
    renderRecentPolls();
    renderAllPolls();
    renderInsights();
    renderNews();
    
    // Setup interactions
    setupNavigation();
    setupFilters();
    setupScrollTopButton();
    setupHeaderScroll();
    setupMobileMenu();
    
    // Animate elements
    animateHeroStats();
    animateProgressBars();
    
    // Lazy load images
    lazyLoadImages();
    
    // Hide loading screen
    hideLoadingScreen();
    
    console.log('✅ Website loaded successfully');
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', init);
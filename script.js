// 数据管理系统
class FrontendDataManager {
    constructor() {
        this.data = this.loadData();
        this.init();
    }

    // 加载数据
    loadData() {
        const savedData = localStorage.getItem('personalWebsiteData');
        if (savedData) {
            return JSON.parse(savedData);
        }
        return null;
    }

    // 初始化
    init() {
        if (this.data) {
            this.updateCarousel();
            this.updatePersonalInfo();
            this.updateSocialLinks();
        } else {
            // 如果没有数据，也要绑定轮播事件
            this.bindCarouselEvents();
        }
        
        // 启动数据同步
        this.startDataSync();
    }

    // 更新轮播图
    updateCarousel() {
        const carousel = document.querySelector('.carousel');
        if (!carousel || !this.data.photos) return;

        // 清空现有内容
        carousel.innerHTML = '';

        // 重新生成轮播图
        this.data.photos.forEach((photo, index) => {
            const slide = document.createElement('div');
            slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
            slide.innerHTML = `
                <img src="${photo.url}" alt="${photo.title}" class="carousel-image">
                <div class="carousel-caption">
                    <h3>${photo.title}</h3>
                    <p>${photo.description}</p>
                </div>
            `;
            carousel.appendChild(slide);
        });

        // 更新轮播点
        this.updateCarouselDots();
        
        // 重新初始化轮播功能
        this.initCarousel();
        
        // 重新绑定轮播按钮事件
        this.bindCarouselEvents();
    }

    // 更新轮播点
    updateCarouselDots() {
        const dotsContainer = document.querySelector('.carousel-dots');
        if (!dotsContainer || !this.data.photos) return;

        dotsContainer.innerHTML = '';
        this.data.photos.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = `dot ${index === 0 ? 'active' : ''}`;
            dot.onclick = () => goToSlide(index + 1);
            dotsContainer.appendChild(dot);
        });
    }

    // 更新个人信息
    updatePersonalInfo() {
        if (!this.data.personalInfo) return;

        const { personalInfo } = this.data;
        
        // 更新头像
        const avatarImage = document.querySelector('.avatar-image');
        if (avatarImage && this.data.avatar) {
            avatarImage.src = this.data.avatar;
        }

        // 更新个人介绍文本
        const aboutText = document.querySelector('.about-text p');
        if (aboutText) {
            aboutText.textContent = personalInfo.intro;
        }

        // 更新技能标签
        this.updateSkills();
    }

    // 更新技能标签
    updateSkills() {
        if (!this.data.personalInfo || !this.data.personalInfo.skills) return;

        const skillsContainer = document.querySelector('.skill-tags');
        if (!skillsContainer) return;

        skillsContainer.innerHTML = '';
        this.data.personalInfo.skills.forEach(skill => {
            const skillTag = document.createElement('span');
            skillTag.className = 'skill-tag';
            skillTag.textContent = skill;
            skillsContainer.appendChild(skillTag);
        });
    }

    // 更新社交媒体链接
    updateSocialLinks() {
        if (!this.data.contactInfo || !this.data.contactInfo.social) return;

        const { social } = this.data.contactInfo;
        
        // 更新Instagram链接
        const instagramLink = document.querySelector('a[href*="instagram.com"]');
        if (instagramLink && social.instagram) {
            instagramLink.href = social.instagram;
        }

        // 更新X链接
        const twitterLink = document.querySelector('a[href*="x.com"]');
        if (twitterLink && social.twitter) {
            twitterLink.href = social.twitter;
        }

        // 更新Telegram链接
        const telegramLink = document.querySelector('a[href*="t.me"]');
        if (telegramLink && social.telegram) {
            telegramLink.href = social.telegram;
        }
    }

    // 重新初始化轮播
    initCarousel() {
        // 重新获取元素引用
        window.currentSlide = 0;
        window.slides = document.querySelectorAll('.carousel-slide');
        window.dots = document.querySelectorAll('.dot');
        
        if (window.slides.length > 0) {
            showSlide(0);
        }
        
        // 重新启动自动播放
        if (window.carouselInterval) {
            clearInterval(window.carouselInterval);
        }
        window.carouselInterval = setInterval(() => {
            changeSlide(1);
        }, 5000);
    }

    // 绑定轮播按钮事件
    bindCarouselEvents() {
        // 绑定左右切换按钮
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        
        if (prevBtn) {
            prevBtn.onclick = () => changeSlide(-1);
        }
        
        if (nextBtn) {
            nextBtn.onclick = () => changeSlide(1);
        }
        
        // 绑定轮播点点击事件
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.onclick = () => goToSlide(index + 1);
        });
    }

    // 监听数据变化
    startDataSync() {
        // 监听storage事件（跨标签页同步）
        window.addEventListener('storage', (e) => {
            if (e.key === 'personalWebsiteData') {
                this.data = JSON.parse(e.newValue || '{}');
                this.init();
            }
        });

        // 定期检查数据变化（同标签页同步）
        setInterval(() => {
            const newData = this.loadData();
            if (newData && JSON.stringify(newData) !== JSON.stringify(this.data)) {
                this.data = newData;
                this.init();
            }
        }, 1000); // 每秒检查一次
    }
}

// 轮播功能
let currentSlide = 0;
let slides = document.querySelectorAll('.carousel-slide');
let dots = document.querySelectorAll('.dot');

// 初始化轮播
function initCarousel() {
    if (slides.length === 0) return;
    
    // 显示第一张幻灯片
    showSlide(currentSlide);
    
    // 自动播放轮播
    setInterval(() => {
        changeSlide(1);
    }, 5000);
}

// 显示指定幻灯片
function showSlide(n) {
    // 隐藏所有幻灯片
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // 显示当前幻灯片
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

// 切换幻灯片
function changeSlide(direction) {
    showSlide(currentSlide + direction);
}

// 跳转到指定幻灯片
function goToSlide(n) {
    showSlide(n - 1);
}

// 移动端导航菜单
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // 点击导航链接后关闭菜单
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// 平滑滚动到锚点
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // 减去导航栏高度
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 滚动时导航栏样式变化
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });
}

// 页面加载动画
function initPageAnimations() {
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
}

// 技能标签动画
function initSkillAnimations() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach((tag, index) => {
        tag.style.opacity = '0';
        tag.style.transform = 'translateY(20px)';
        tag.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            tag.style.opacity = '1';
            tag.style.transform = 'translateY(0)';
        }, index * 100);
    });
}



// 社交媒体链接点击效果
function initSocialEffects() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // 创建点击波纹效果
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.width = '100px';
            ripple.style.height = '100px';
            ripple.style.marginLeft = '-50px';
            ripple.style.marginTop = '-50px';
            
            link.style.position = 'relative';
            link.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}



// 添加CSS动画
function addCSSAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        

        
        .fade-in-up {
            animation: fadeInUp 0.8s ease-out;
        }
        
        .slide-in-left {
            animation: slideInLeft 0.8s ease-out;
        }
        
        .slide-in-right {
            animation: slideInRight 0.8s ease-out;
        }
    `;
    document.head.appendChild(style);
}

// 键盘导航支持
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowLeft':
                changeSlide(-1);
                break;
            case 'ArrowRight':
                changeSlide(1);
                break;
            case 'Escape':
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    document.querySelector('.hamburger').classList.remove('active');
                }
                break;
        }
    });
}

// 触摸滑动支持（移动端）
function initTouchSupport() {
    let startX = 0;
    let endX = 0;
    const carousel = document.querySelector('.carousel');
    
    if (!carousel) return;
    
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    carousel.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // 向左滑动，下一张
                changeSlide(1);
            } else {
                // 向右滑动，上一张
                changeSlide(-1);
            }
        }
    }
}

// 性能优化：防抖函数
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

// 优化滚动事件
const optimizedScrollEffects = debounce(initScrollEffects, 10);

// 页面加载完成后初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    // 添加CSS动画
    addCSSAnimations();
    
    // 初始化数据管理器（优先于其他功能）
    window.frontendDataManager = new FrontendDataManager();
    
    // 初始化各个功能模块
    initCarousel();
    initMobileNav();
    initSmoothScroll();
    optimizedScrollEffects();
    initPageAnimations();
    initSkillAnimations();
    initSocialEffects();
    initKeyboardNavigation();
    initTouchSupport();
    
    // 页面加载完成后的额外效果
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// 窗口大小改变时的响应式处理
window.addEventListener('resize', debounce(() => {
    // 在移动端时关闭导航菜单
    if (window.innerWidth > 768) {
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }
}, 250));

// 页面可见性变化时的处理
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // 页面隐藏时暂停轮播
        clearInterval(window.carouselInterval);
    } else {
        // 页面显示时恢复轮播
        window.carouselInterval = setInterval(() => {
            changeSlide(1);
        }, 5000);
    }
});

// 错误处理
window.addEventListener('error', (e) => {
    console.error('页面错误:', e.error);
});

// 控制台日志（开发时使用）
console.log('个人网站已加载完成！');
console.log('功能包括：轮播、响应式导航、平滑滚动、动画效果等');

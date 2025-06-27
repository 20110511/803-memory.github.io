// 主JavaScript文件 - 全局功能和初始化
class MemoryWebsite {
    constructor() {
        this.init();
    }
    
    init() {
        // 页面加载完成后的初始化
        this.setupGlobalEvents();
        this.addScrollEffects();
        this.addLoadingAnimation();
        this.setupKeyboardShortcuts();
        
        // 显示欢迎信息
        this.showWelcomeMessage();
    }
    
    setupGlobalEvents() {
        // 页面滚动优化
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // 窗口大小变化处理
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
    }
    
    handleScroll() {
        const scrollY = window.scrollY;
        const header = document.querySelector('.header');
        
        // 头部滚动效果
        if (scrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    }
    
    handleResize() {
        // 响应式处理
        const isMobile = window.innerWidth <= 767;
        document.body.classList.toggle('mobile-view', isMobile);
        document.body.classList.toggle('desktop-view', !isMobile);
    }
    
    addScrollEffects() {
        // 平滑滚动
        const style = document.createElement('style');
        style.textContent = `
            html {
                scroll-behavior: smooth;
            }
            
            .scroll-indicator {
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 3px;
                background: linear-gradient(90deg, #667eea, #764ba2);
                z-index: 1000;
                transition: width 0.1s ease;
            }
        `;
        document.head.appendChild(style);
        
        // 添加滚动进度指示器
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        document.body.appendChild(indicator);
        
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            indicator.style.width = scrollPercent + '%';
        });
    }
    
    addLoadingAnimation() {
        // 页面加载动画
        const sections = document.querySelectorAll('section');
        
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                section.style.transition = 'all 0.6s ease-out';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
    
    setupKeyboardShortcuts() {
        // 菜单导航点击事件
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const target = item.getAttribute('href');
                this.smoothScrollTo(target);
            });
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            // 只有当焦点不在输入框时才响应快捷键
            if (e.target.tagName !== 'INPUT' && !e.ctrlKey && !e.altKey) {
                switch(e.key.toLowerCase()) {
                    case 'h':
                        e.preventDefault();
                        this.scrollToTop();
                        break;
                    case 'g':
                        e.preventDefault();
                        this.scrollToGallery();
                        break;
                    case 'c':
                        e.preventDefault();
                        this.scrollToCountdown();
                        break;
                    case 'm':
                        e.preventDefault();
                        this.scrollToMusic();
                        break;
                    case '?':
                        e.preventDefault();
                        this.showShortcutHelp();
                        break;
                }
            }
        });
    }
    
    smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    scrollToCountdown() {
        const countdown = document.querySelector('#countdown');
        if (countdown) {
            countdown.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    scrollToGallery() {
        const gallery = document.querySelector('#gallery');
        if (gallery) {
            gallery.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    scrollToMusic() {
        const music = document.querySelector('#music');
        if (music) {
            music.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    showShortcutHelp() {
        const helpModal = document.createElement('div');
        helpModal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 15px; max-width: 400px;">
                <h3>键盘快捷键</h3>
                <p><kbd>H</kbd> - 回到顶部</p>
                <p><kbd>C</kbd> - 跳转到中考倒计时</p>
                <p><kbd>G</kbd> - 跳转到回忆册</p>
                <p><kbd>M</kbd> - 跳转到背景音乐</p>
                <p><kbd>?</kbd> - 显示帮助</p>
                <hr style="margin: 15px 0;">
                <h4>功能说明</h4>
                <p>• 点击任意位置产生水波纹效果</p>
                <p>• 点击"献花"按钮飘洒鲜花</p>
                <p>• 首次点击自动播放背景音乐</p>
                <button onclick="this.parentElement.parentElement.remove()">关闭</button>
            </div>
        `;
        
        helpModal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.8); display: flex;
            justify-content: center; align-items: center; z-index: 10000;
        `;
        
        document.body.appendChild(helpModal);
    }
    
    showWelcomeMessage() {
        const hasVisited = localStorage.getItem('memoryWebsiteVisited');
        
        if (!hasVisited) {
            setTimeout(() => {
                this.displayWelcome();
                localStorage.setItem('memoryWebsiteVisited', 'true');
            }, 1000);
        }
    }
    
    displayWelcome() {
        const welcome = document.createElement('div');
        welcome.innerHTML = `
            <div style="background: white; padding: 40px; border-radius: 20px; text-align: center;">
                <h3>欢迎来到八年级三班回忆录！</h3>
                <p>这里记录着我们班级的美好回忆</p>
                <button onclick="this.parentElement.parentElement.remove()">开始浏览</button>
            </div>
        `;
        
        welcome.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(102, 126, 234, 0.95); display: flex;
            justify-content: center; align-items: center; z-index: 10000;
        `;
        
        document.body.appendChild(welcome);
    }
    
    // 工具函数
    debounce(func, wait) {
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
}

// 页面加载完成后初始化主功能
document.addEventListener('DOMContentLoaded', () => {
    new MemoryWebsite();
}); 
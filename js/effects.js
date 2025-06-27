// 特效管理器
class EffectsManager {
    constructor() {
        this.rippleContainer = document.getElementById('rippleContainer');
        this.flowerContainer = document.getElementById('flowerContainer');
        this.init();
    }
    
    init() {
        this.setupRippleEffect();
        this.setupFlowerEffect();
    }
    
    // 水波纹效果
    setupRippleEffect() {
        document.addEventListener('click', (e) => {
            this.createRipple(e.clientX, e.clientY);
        });
        
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                this.createRipple(e.touches[0].clientX, e.touches[0].clientY);
            }
        });
    }
    
    createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        
        const size = 100;
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = (x - size / 2) + 'px';
        ripple.style.top = (y - size / 2) + 'px';
        
        this.rippleContainer.appendChild(ripple);
        
        // 动画结束后移除元素
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 800);
    }
    
    // 鲜花效果
    setupFlowerEffect() {
        const flowerBtn = document.getElementById('flowerBtn');
        if (flowerBtn) {
            flowerBtn.addEventListener('click', () => {
                this.createFlowerShower();
            });
        }
    }
    
    createFlowerShower() {
        const flowers = ['🌸', '🌺', '🌻', '🌷', '🌹', '💐', '🏵️', '🌼'];
        const flowerCount = 15;
        
        for (let i = 0; i < flowerCount; i++) {
            setTimeout(() => {
                this.createFlower(flowers[Math.floor(Math.random() * flowers.length)]);
            }, i * 100);
        }
    }
    
    createFlower(flowerEmoji, x = null, y = null) {
        const flower = document.createElement('div');
        flower.className = 'flower';
        flower.textContent = flowerEmoji || '🌸';
        
        // 设置位置
        if (x !== null && y !== null) {
            flower.style.left = x + 'px';
            flower.style.top = y + 'px';
            flower.style.position = 'fixed';
        } else {
            // 随机位置
            flower.style.left = Math.random() * window.innerWidth + 'px';
            flower.style.top = '-50px';
            flower.style.position = 'fixed';
        }
        
        flower.style.animationDuration = (2 + Math.random() * 2) + 's';
        flower.style.animationDelay = Math.random() * 0.5 + 's';
        flower.style.zIndex = '10000';
        
        this.flowerContainer.appendChild(flower);
        
        // 动画结束后移除元素
        setTimeout(() => {
            if (flower.parentNode) {
                flower.parentNode.removeChild(flower);
            }
        }, 4000);
    }
    
    // 在指定位置创建鲜花雨
    createFlowerRain(centerX, centerY) {
        const flowers = ['🌸', '🌺', '🌻', '🌷', '🌹', '💐', '🏵️', '🌼'];
        const flowerCount = 20;
        
        for (let i = 0; i < flowerCount; i++) {
            setTimeout(() => {
                const flower = flowers[Math.floor(Math.random() * flowers.length)];
                const offsetX = (Math.random() - 0.5) * 300;
                const offsetY = (Math.random() - 0.5) * 200;
                const x = centerX + offsetX;
                const y = centerY + offsetY;
                
                this.createFlower(flower, x, y);
            }, i * 80);
        }
    }
    
    // 创建详细查看模态框
    createDetailModal(imageSrc, imageAlt) {
        const modal = document.createElement('div');
        modal.className = 'detail-modal';
        
        const content = document.createElement('div');
        content.className = 'detail-content';
        
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = imageAlt;
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'detail-close';
        closeBtn.innerHTML = '×';
        closeBtn.onclick = () => {
            document.body.removeChild(modal);
        };
        
        content.appendChild(img);
        content.appendChild(closeBtn);
        modal.appendChild(content);
        
        // 点击背景关闭
        modal.onclick = (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        };
        
        // ESC键关闭
        const closeOnEsc = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', closeOnEsc);
            }
        };
        document.addEventListener('keydown', closeOnEsc);
        
        document.body.appendChild(modal);
    }
    
    // 下载图片
    downloadImage(imageSrc, filename) {
        const link = document.createElement('a');
        link.href = imageSrc;
        link.download = filename || 'memory-photo.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// 页面加载完成后初始化特效
document.addEventListener('DOMContentLoaded', () => {
    window.effectsManager = new EffectsManager();
    
    // 暴露鲜花函数到全局
    window.createFlower = (x, y) => {
        if (window.effectsManager) {
            window.effectsManager.createFlowerRain(x, y);
        }
    };
    
    // 暴露水波纹函数到全局
    window.addRipple = (x, y) => {
        if (window.effectsManager) {
            window.effectsManager.createRipple(x, y);
        }
    };
}); 
// 弹窗回忆册控制器
class GalleryModal {
    constructor() {
        this.modal = document.getElementById('galleryModal');
        this.openBtn = document.getElementById('openGalleryBtn');
        this.closeBtn = document.getElementById('closeGalleryBtn');
        this.imageContainer = document.getElementById('galleryImageContainer');
        this.indicators = document.getElementById('galleryModalIndicators');
        this.flowerBtn = document.getElementById('modalFlowerBtn');
        this.downloadBtn = document.getElementById('modalDownloadBtn');
        
        this.images = [];
        this.currentIndex = 0;
        this.isAnimating = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }
    
    async init() {
        if (!this.modal) return;
        
        await this.loadImages();
        this.bindEvents();
        this.createIndicators();
    }
    
    async loadImages() {
        // 动态扫描img文件夹
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        this.images = [];
        
        // 尝试加载图片（从1开始编号）
        for (let i = 1; i <= 20; i++) {
            for (const ext of imageExtensions) {
                try {
                    const imgPath = `img/${i}.${ext}`;
                    const img = new Image();
                    img.src = imgPath;
                    
                    await new Promise((resolve, reject) => {
                        img.onload = () => {
                            this.images.push({
                                src: imgPath,
                                name: `回忆 ${i}`
                            });
                            resolve();
                        };
                        img.onerror = reject;
                        
                        // 设置超时
                        setTimeout(reject, 1000);
                    });
                    break; // 找到图片就跳出扩展名循环
                } catch (error) {
                    // 继续尝试下一个扩展名或下一个编号
                }
            }
        }
        
        console.log(`加载了 ${this.images.length} 张图片`);
        
        if (this.images.length === 0) {
            // 如果没有找到图片，使用默认图片
            this.images = [
                { src: 'img/1.jpg', name: '回忆 1' },
                { src: 'img/2.jpg', name: '回忆 2' },
                { src: 'img/3.jpg', name: '回忆 3' }
            ];
        }
    }
    
    bindEvents() {
        // 打开弹窗
        this.openBtn?.addEventListener('click', () => {
            this.openModal();
        });
        
        // 关闭弹窗
        this.closeBtn?.addEventListener('click', () => {
            this.closeModal();
        });
        
        // 点击遮罩关闭
        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
                this.closeModal();
            }
            if (this.modal?.classList.contains('active')) {
                if (e.key === 'ArrowLeft') {
                    this.prevImage();
                } else if (e.key === 'ArrowRight') {
                    this.nextImage();
                }
            }
        });
        
        // 图片点击切换
        this.imageContainer?.addEventListener('click', () => {
            this.nextImage();
        });
        
        // 触摸滑动支持
        this.imageContainer?.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        });
        
        this.imageContainer?.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe();
        });
        
        // 鼠标滑动支持
        let isMouseDown = false;
        let mouseStartX = 0;
        
        this.imageContainer?.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            mouseStartX = e.clientX;
        });
        
        this.imageContainer?.addEventListener('mouseup', (e) => {
            if (isMouseDown) {
                const mouseEndX = e.clientX;
                const diff = mouseStartX - mouseEndX;
                
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        this.nextImage();
                    } else {
                        this.prevImage();
                    }
                }
            }
            isMouseDown = false;
        });
        
        this.imageContainer?.addEventListener('mouseleave', () => {
            isMouseDown = false;
        });
        
        // 功能按钮
        this.flowerBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showFlowers();
        });
        
        this.downloadBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.downloadCurrentImage();
        });
    }
    
    handleSwipe() {
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                this.nextImage();
            } else {
                this.prevImage();
            }
        }
    }
    
    createIndicators() {
        if (!this.indicators) return;
        
        this.indicators.innerHTML = '';
        
        this.images.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            if (index === this.currentIndex) {
                indicator.classList.add('active');
            }
            
            indicator.addEventListener('click', () => {
                this.goToImage(index);
            });
            
            this.indicators.appendChild(indicator);
        });
    }
    
    openModal() {
        if (!this.modal) return;
        
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // 显示第一张图片
        this.showImage(this.currentIndex);
        
        // 添加水波纹效果
        if (window.addRipple) {
            const rect = this.openBtn.getBoundingClientRect();
            window.addRipple(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
    }
    
    closeModal() {
        if (!this.modal) return;
        
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    showImage(index, direction = 'next') {
        if (this.isAnimating || !this.imageContainer) return;
        
        this.isAnimating = true;
        this.currentIndex = index;
        
        const currentImg = this.imageContainer.querySelector('img');
        const newImg = document.createElement('img');
        newImg.src = this.images[index].src;
        newImg.alt = this.images[index].name;
        newImg.style.opacity = '0';
        newImg.style.transform = direction === 'next' ? 'translateX(50px)' : 'translateX(-50px)';
        
        // 预加载图片
        newImg.onload = () => {
            if (currentImg) {
                // 淡出当前图片
                currentImg.style.opacity = '0';
                currentImg.style.transform = direction === 'next' ? 'translateX(-50px)' : 'translateX(50px)';
                
                setTimeout(() => {
                    currentImg.remove();
                }, 500);
            }
            
            this.imageContainer.appendChild(newImg);
            
            // 淡入新图片
            setTimeout(() => {
                newImg.style.opacity = '1';
                newImg.style.transform = 'translateX(0)';
                newImg.style.transition = 'all 0.5s ease';
            }, 50);
            
            setTimeout(() => {
                this.isAnimating = false;
            }, 500);
        };
        
        // 更新指示器
        this.updateIndicators();
    }
    
    updateIndicators() {
        if (!this.indicators) return;
        
        const indicators = this.indicators.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    nextImage() {
        if (this.images.length === 0) return;
        
        const nextIndex = (this.currentIndex + 1) % this.images.length;
        this.showImage(nextIndex, 'next');
    }
    
    prevImage() {
        if (this.images.length === 0) return;
        
        const prevIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.showImage(prevIndex, 'prev');
    }
    
    goToImage(index) {
        if (index === this.currentIndex || this.isAnimating) return;
        
        const direction = index > this.currentIndex ? 'next' : 'prev';
        this.showImage(index, direction);
    }
    
    showFlowers() {
        // 调用全局的鲜花动画
        if (window.createFlower) {
            // 在弹窗中心创建鲜花
            const rect = this.imageContainer.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            for (let i = 0; i < 15; i++) {
                setTimeout(() => {
                    const x = centerX + (Math.random() - 0.5) * 200;
                    const y = centerY + (Math.random() - 0.5) * 200;
                    window.createFlower(x, y);
                }, i * 100);
            }
        }
    }
    
    downloadCurrentImage() {
        if (this.images.length === 0) return;
        
        const currentImage = this.images[this.currentIndex];
        const link = document.createElement('a');
        link.href = currentImage.src;
        link.download = `${currentImage.name}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 显示下载提示
        this.showToast('图片下载已开始');
    }
    
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 0.9rem;
            z-index: 10001;
            animation: fadeInOut 2s ease-out forwards;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 2000);
    }
}

// 添加toast动画CSS
const toastStyle = document.createElement('style');
toastStyle.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
`;
document.head.appendChild(toastStyle);

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    const galleryModal = new GalleryModal();
    
    // 将实例挂载到全局
    window.galleryModal = galleryModal;
}); 
// 全局音乐控制器
class GlobalMusicController {
    constructor() {
        this.audio = document.getElementById('globalAudioPlayer');
        this.btn = document.getElementById('globalMusicBtn');
        this.isPlaying = false;
        this.isMuted = false;
        
        this.init();
    }
    
    init() {
        if (!this.audio || !this.btn) return;
        
        // 设置音频属性
        this.audio.volume = 0.3; // 较低的默认音量
        this.audio.loop = true;
        
        // 从localStorage恢复状态
        this.restoreState();
        
        // 绑定事件
        this.bindEvents();
        
        // 设置智能自动播放
        this.setupAutoPlay();
        
        // 尝试立即播放（如果用户之前允许过）
        this.tryAutoPlay();
    }
    
    bindEvents() {
        // 音乐控制按钮点击
        this.btn.addEventListener('click', () => {
            this.toggleMute();
        });
        
        // 音频事件
        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.updateButtonState();
        });
        
        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updateButtonState();
        });
        
        this.audio.addEventListener('error', () => {
            console.warn('音频加载失败');
            this.btn.style.display = 'none';
        });
        
        // 页面卸载时保存状态
        window.addEventListener('beforeunload', () => {
            this.saveState();
        });
    }
    
    setupAutoPlay() {
        // 检查是否已经有播放状态
        const hasPlayedBefore = localStorage.getItem('globalMusicHasPlayed') === 'true';
        
        // 监听用户首次交互
        const startPlayback = (e) => {
            // 排除音乐按钮本身的点击
            if (e.target && e.target.closest('#globalMusicBtn')) {
                return;
            }
            
            if (!this.isPlaying && !this.isMuted) {
                this.play();
                localStorage.setItem('globalMusicHasPlayed', 'true');
            }
            // 移除事件监听器
            document.removeEventListener('click', startPlayback);
            document.removeEventListener('touchstart', startPlayback);
            document.removeEventListener('keydown', startPlayback);
        };
        
        // 如果之前播放过且未静音，尝试继续播放
        if (hasPlayedBefore && !this.isMuted) {
            setTimeout(() => {
                this.play();
            }, 500);
        }
        
        // 总是添加交互事件监听（因为浏览器策略可能阻止自动播放）
        document.addEventListener('click', startPlayback);
        document.addEventListener('touchstart', startPlayback);
        document.addEventListener('keydown', startPlayback);
    }
    
    play() {
        if (this.audio && !this.isMuted) {
            const playPromise = this.audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn('自动播放被阻止:', error);
                });
            }
        }
    }
    
    pause() {
        if (this.audio) {
            this.audio.pause();
        }
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.pause();
        } else {
            this.play();
        }
        
        this.updateButtonState();
        this.saveState();
    }
    
    updateButtonState() {
        if (!this.btn) return;
        
        if (this.isMuted) {
            this.btn.textContent = '🔇';
            this.btn.classList.add('muted');
            this.btn.title = '点击开启音乐';
        } else {
            this.btn.textContent = '🔊';
            this.btn.classList.remove('muted');
            this.btn.title = '点击静音';
        }
    }
    
    saveState() {
        try {
            localStorage.setItem('globalMusicMuted', this.isMuted.toString());
        } catch (error) {
            console.warn('无法保存音乐状态:', error);
        }
    }
    
    restoreState() {
        try {
            const savedMuted = localStorage.getItem('globalMusicMuted');
            if (savedMuted !== null) {
                this.isMuted = savedMuted === 'true';
                this.updateButtonState();
            }
        } catch (error) {
            console.warn('无法恢复音乐状态:', error);
        }
    }
    
    tryAutoPlay() {
        // 如果用户之前允许过播放，尝试自动播放
        const hasPlayedBefore = localStorage.getItem('globalMusicHasPlayed') === 'true';
        
        if (hasPlayedBefore && !this.isMuted) {
            // 延迟一点时间再尝试播放
            setTimeout(() => {
                this.play();
            }, 1000);
        }
    }
    
    // 页面可见性变化处理
    handleVisibilityChange() {
        if (document.hidden) {
            if (this.isPlaying) {
                this.pause();
                this.wasPlayingBeforeHidden = true;
            }
        } else {
            if (this.wasPlayingBeforeHidden && !this.isMuted) {
                this.play();
                this.wasPlayingBeforeHidden = false;
            }
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    const globalMusic = new GlobalMusicController();
    
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', () => {
        globalMusic.handleVisibilityChange();
    });
    
    // 将实例挂载到全局，方便其他模块访问
    window.globalMusicController = globalMusic;
}); 
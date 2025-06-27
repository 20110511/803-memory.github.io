// 中考倒计时功能
class CountdownTimer {
    constructor() {
        // 设置中考日期 (2025年6月中旬，具体日期可调整)
        this.targetDate = new Date('2026-06-26 09:00:00');
        this.elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };
        
        this.init();
    }
    
    init() {
        // 立即更新一次
        this.updateCountdown();
        
        // 每秒更新一次
        this.interval = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }
    
    updateCountdown() {
        const now = new Date().getTime();
        const distance = this.targetDate.getTime() - now;
        
        if (distance < 0) {
            // 如果中考已过，显示已结束
            this.displayFinished();
            clearInterval(this.interval);
            return;
        }
        
        // 计算时间差
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // 更新显示
        this.updateDisplay(days, hours, minutes, seconds);
    }
    
    updateDisplay(days, hours, minutes, seconds) {
        // 添加动画效果
        this.animateNumber(this.elements.days, days);
        this.animateNumber(this.elements.hours, hours);
        this.animateNumber(this.elements.minutes, minutes);
        this.animateNumber(this.elements.seconds, seconds);
    }
    
    animateNumber(element, newValue) {
        if (element.textContent !== newValue.toString()) {
            element.style.transform = 'scale(1.2)';
            element.style.color = '#e74c3c';
            
            setTimeout(() => {
                element.textContent = newValue;
                element.style.transform = 'scale(1)';
                element.style.color = '#e74c3c';
            }, 150);
        }
    }
    
    displayFinished() {
        this.elements.days.textContent = '0';
        this.elements.hours.textContent = '0';
        this.elements.minutes.textContent = '0';
        this.elements.seconds.textContent = '0';
        
        // 添加完成提示
        const countdownSection = document.querySelector('.countdown-section');
        const finishedMessage = document.createElement('div');
        finishedMessage.className = 'finished-message';
        finishedMessage.innerHTML = '<h3>中考已结束，祝愿同学们都能取得好成绩！</h3>';
        finishedMessage.style.cssText = `
            text-align: center;
            color: white;
            background: rgba(46, 204, 113, 0.9);
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
            font-size: 1.2rem;
        `;
        countdownSection.appendChild(finishedMessage);
    }
}

// 页面加载完成后初始化倒计时
document.addEventListener('DOMContentLoaded', () => {
    new CountdownTimer();
}); 
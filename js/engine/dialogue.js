// Dialogue System
const Dialogue = {
    textElement: null,
    typeSpeed: 30,
    currentText: '',
    isTyping: false,
    onComplete: null,
    
    init() {
        this.textElement = document.getElementById('dialogue-text');
    },
    
    // Type text with typewriter effect
    async typeText(text, callback) {
        this.currentText = text;
        this.isTyping = true;
        this.onComplete = callback;
        this.textElement.textContent = '';
        
        for (let i = 0; i < text.length; i++) {
            if (!this.isTyping) {
                // Skip to end
                this.textElement.textContent = text;
                break;
            }
            this.textElement.textContent += text[i];
            await this.wait(this.typeSpeed);
        }
        
        this.isTyping = false;
        if (this.onComplete) this.onComplete();
    },
    
    // Instantly show text
    showText(text) {
        this.isTyping = false;
        this.textElement.textContent = text;
    },
    
    // Skip typing animation
    skip() {
        if (this.isTyping) {
            this.isTyping = false;
            this.textElement.textContent = this.currentText;
        }
    },
    
    // Clear dialogue
    clear() {
        this.textElement.textContent = '';
    },
    
    // Helper
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

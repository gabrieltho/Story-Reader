// Novel Reader App Logic
class NovelReader {
    constructor() {
        this.novelText = '';
        this.fileName = '';
        this.sentences = [];
        this.currentSentenceIndex = 0;
        this.isReading = false;
        this.isPaused = false;
        
        // Speech synthesis
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.currentUtterance = null;
        
        // Settings
        this.speed = 1.0;
        this.pitch = 1.0;
        this.selectedVoice = null;
        
        // Initialize
        this.initializeElements();
        this.initializeVoices();
        this.attachEventListeners();
    }

    initializeElements() {
        // Sections
        this.importSection = document.getElementById('importSection');
        this.textDisplay = document.getElementById('textDisplay');
        this.controlsSection = document.getElementById('controlsSection');
        this.fileNameDisplay = document.getElementById('fileName');
        
        // Buttons
        this.playBtn = document.getElementById('playBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.skipBtn = document.getElementById('skipBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.changeFileBtn = document.getElementById('changeFileBtn');
        this.pasteBtn = document.getElementById('pasteBtn');
        this.sampleBtn = document.getElementById('sampleBtn');
        this.fileInput = document.getElementById('fileInput');
        
        // Modal
        this.pasteModal = document.getElementById('pasteModal');
        this.closeModal = document.getElementById('closeModal');
        this.pasteTextarea = document.getElementById('pasteTextarea');
        this.importTextBtn = document.getElementById('importTextBtn');
        
        // Settings
        this.speedSlider = document.getElementById('speedSlider');
        this.pitchSlider = document.getElementById('pitchSlider');
        this.voiceSelect = document.getElementById('voiceSelect');
        this.speedValue = document.getElementById('speedValue');
        this.pitchValue = document.getElementById('pitchValue');
        
        // Progress
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
    }

    initializeVoices() {
        const loadVoices = () => {
            this.voices = this.synth.getVoices();
            this.populateVoiceList();
        };

        loadVoices();
        
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = loadVoices;
        }
    }

    populateVoiceList() {
        this.voiceSelect.innerHTML = '';
        
        // Filter for English voices
        const englishVoices = this.voices.filter(voice => 
            voice.lang.startsWith('en')
        );

        if (englishVoices.length === 0) {
            this.voiceSelect.innerHTML = '<option>No English voices available</option>';
            return;
        }

        englishVoices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${voice.name} (${voice.lang})`;
            this.voiceSelect.appendChild(option);
        });

        // Select first voice by default
        if (englishVoices.length > 0) {
            this.selectedVoice = englishVoices[0];
        }
    }

    attachEventListeners() {
        // File input
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Buttons
        this.playBtn.addEventListener('click', () => this.togglePlayPause());
        this.stopBtn.addEventListener('click', () => this.stopReading());
        this.skipBtn.addEventListener('click', () => this.skipForward());
        this.clearBtn.addEventListener('click', () => this.clearText());
        this.changeFileBtn.addEventListener('click', () => this.showImportSection());
        this.pasteBtn.addEventListener('click', () => this.showPasteModal());
        this.sampleBtn.addEventListener('click', () => this.loadSample());
        
        // Modal
        this.closeModal.addEventListener('click', () => this.hidePasteModal());
        this.importTextBtn.addEventListener('click', () => this.importPastedText());
        this.pasteModal.addEventListener('click', (e) => {
            if (e.target === this.pasteModal) {
                this.hidePasteModal();
            }
        });
        
        // Settings
        this.speedSlider.addEventListener('input', (e) => {
            this.speed = parseFloat(e.target.value);
            this.speedValue.textContent = this.speed.toFixed(1) + 'x';
        });
        
        this.pitchSlider.addEventListener('input', (e) => {
            this.pitch = parseFloat(e.target.value);
            this.pitchValue.textContent = this.pitch.toFixed(1);
        });
        
        this.voiceSelect.addEventListener('change', (e) => {
            const englishVoices = this.voices.filter(voice => 
                voice.lang.startsWith('en')
            );
            this.selectedVoice = englishVoices[e.target.value];
        });
    }

    async handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        this.fileName = file.name;
        this.progressText.textContent = 'Loading file...';

        try {
            const text = await this.extractTextFromFile(file);
            this.loadText(text, file.name);
        } catch (error) {
            alert('Error loading file: ' + error.message);
            this.progressText.textContent = 'Error loading file';
        }
    }

    async extractTextFromFile(file) {
        const extension = file.name.split('.').pop().toLowerCase();

        switch (extension) {
            case 'txt':
                return await file.text();
            
            case 'pdf':
                return await this.extractTextFromPDF(file);
            
            case 'epub':
                alert('EPUB support is limited in web browsers. Please convert to TXT or paste the text.');
                return '';
            
            default:
                // Try to read as text
                return await file.text();
        }
    }

    async extractTextFromPDF(file) {
        // Note: Full PDF parsing requires a library like PDF.js
        // For now, we'll show a message
        alert('PDF support requires additional libraries. Please:\n1. Copy text from the PDF\n2. Use the "Paste Text" option\n\nOr convert the PDF to TXT format first.');
        return '';
    }

    loadText(text, filename) {
        if (!text || text.trim().length === 0) {
            alert('No text found in the file');
            return;
        }

        this.novelText = text;
        this.fileName = filename;
        this.sentences = this.splitIntoSentences(text);
        this.currentSentenceIndex = 0;
        
        this.showTextDisplay();
        this.updateProgress();
    }

    splitIntoSentences(text) {
        // Split by sentence-ending punctuation
        const sentences = text
            .split(/(?<=[.!?])\s+/)
            .map(s => s.trim())
            .filter(s => s.length > 3);
        
        return sentences;
    }

    showTextDisplay() {
        this.importSection.classList.add('hidden');
        this.textDisplay.classList.add('active');
        this.controlsSection.classList.add('active');
        this.fileNameDisplay.classList.add('active');
        
        this.textDisplay.textContent = this.novelText.substring(0, 1000) + 
            (this.novelText.length > 1000 ? '...' : '');
        this.fileNameDisplay.textContent = '📄 ' + this.fileName;
        
        this.progressText.textContent = 'Ready to read';
    }

    showImportSection() {
        this.importSection.classList.remove('hidden');
        this.textDisplay.classList.remove('active');
        this.controlsSection.classList.remove('active');
        this.fileNameDisplay.classList.remove('active');
        
        this.stopReading();
        this.novelText = '';
        this.fileName = '';
    }

    showPasteModal() {
        this.pasteModal.classList.add('active');
        this.pasteTextarea.value = '';
        this.pasteTextarea.focus();
    }

    hidePasteModal() {
        this.pasteModal.classList.remove('active');
    }

    importPastedText() {
        const text = this.pasteTextarea.value.trim();
        
        if (text.length === 0) {
            alert('Please paste some text first');
            return;
        }

        this.loadText(text, 'Pasted Text');
        this.hidePasteModal();
    }

    loadSample() {
        const sampleText = `Chapter One: The Beginning

It was a bright cold day in April, and the clocks were striking thirteen. The protagonist walked down the cobblestone street, lost in thought about the adventures that lay ahead.

The morning sun cast long shadows across the pavement, and a gentle breeze rustled through the trees. Everything seemed peaceful, yet there was an undercurrent of excitement in the air.

As they turned the corner, something unexpected caught their eye. A small bookshop with an old wooden sign creaked in the wind. The windows were dusty, but through them, countless volumes promised untold stories and knowledge.

Without hesitation, they pushed open the heavy door. A bell chimed softly overhead, and the musty smell of old paper filled their nostrils. This was the beginning of something extraordinary.

The shopkeeper looked up from behind a towering stack of books, smiled knowingly, and said, "We've been expecting you."

Chapter Two: The Discovery

The shop was much larger than it appeared from the outside. Rows upon rows of bookshelves stretched into the dim recesses of the building, creating a labyrinth of literary treasures. Each shelf seemed to lean slightly, as if weighted down by the centuries of knowledge they contained.

"Welcome," the shopkeeper said, his voice warm and inviting. "I'm Mr. Wordsworth. What brings you to my humble establishment?"

The protagonist hesitated, unsure how to explain the inexplicable pull that had drawn them to this place. "I'm not entirely certain," they admitted. "I was just walking by when something made me stop."

Mr. Wordsworth nodded sagely, as if this was the most natural explanation in the world. "Ah yes, the books called to you. They have a way of doing that with special individuals."

He gestured toward the endless aisles. "Feel free to browse. I suspect you'll know the right book when you see it."`;

        this.loadText(sampleText, 'Sample Novel');
    }

    clearText() {
        if (confirm('Are you sure you want to clear the current text?')) {
            this.showImportSection();
        }
    }

    togglePlayPause() {
        if (this.isReading) {
            this.pauseReading();
        } else if (this.isPaused) {
            this.resumeReading();
        } else {
            this.startReading();
        }
    }

    startReading() {
        if (this.sentences.length === 0) return;

        this.isReading = true;
        this.isPaused = false;
        this.playBtn.textContent = '⏸️';
        this.stopBtn.disabled = false;
        this.skipBtn.disabled = false;
        
        this.speakCurrentSentence();
    }

    pauseReading() {
        this.synth.pause();
        this.isReading = false;
        this.isPaused = true;
        this.playBtn.textContent = '▶️';
        this.progressText.textContent = 'Paused';
    }

    resumeReading() {
        this.synth.resume();
        this.isReading = true;
        this.isPaused = false;
        this.playBtn.textContent = '⏸️';
        this.updateProgressText();
    }

    stopReading() {
        this.synth.cancel();
        this.isReading = false;
        this.isPaused = false;
        this.currentSentenceIndex = 0;
        this.playBtn.textContent = '▶️';
        this.stopBtn.disabled = true;
        this.skipBtn.disabled = true;
        this.updateProgress();
        this.progressText.textContent = 'Stopped';
    }

    skipForward() {
        if (this.currentSentenceIndex < this.sentences.length - 1) {
            this.synth.cancel();
            this.currentSentenceIndex++;
            this.updateProgress();
            
            if (this.isReading) {
                this.speakCurrentSentence();
            }
        }
    }

    speakCurrentSentence() {
        if (this.currentSentenceIndex >= this.sentences.length) {
            this.stopReading();
            this.progressText.textContent = 'Finished reading';
            return;
        }

        const sentence = this.sentences[this.currentSentenceIndex];
        const utterance = new SpeechSynthesisUtterance(sentence);
        
        utterance.rate = this.speed;
        utterance.pitch = this.pitch;
        utterance.voice = this.selectedVoice;
        
        utterance.onend = () => {
            if (this.isReading) {
                this.currentSentenceIndex++;
                this.updateProgress();
                
                // Small delay between sentences
                setTimeout(() => {
                    if (this.isReading) {
                        this.speakCurrentSentence();
                    }
                }, 200);
            }
        };

        utterance.onerror = (event) => {
            console.error('Speech error:', event);
            this.stopReading();
            this.progressText.textContent = 'Error occurred';
        };

        this.currentUtterance = utterance;
        this.synth.speak(utterance);
        this.updateProgressText();
    }

    updateProgress() {
        if (this.sentences.length === 0) {
            this.progressFill.style.width = '0%';
            return;
        }

        const progress = (this.currentSentenceIndex / this.sentences.length) * 100;
        this.progressFill.style.width = progress + '%';
        
        if (!this.isReading && !this.isPaused) {
            this.progressText.textContent = 'Ready to read';
        }
    }

    updateProgressText() {
        const progress = Math.round((this.currentSentenceIndex / this.sentences.length) * 100);
        this.progressText.textContent = `Reading: ${progress}% complete`;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new NovelReader();
    console.log('Novel Reader initialized');
});

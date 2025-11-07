// Novel Reader App Logic - Enhanced with Multiple Format Support
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
        this.initializePDFJS();
    }

    initializePDFJS() {
        // Set PDF.js worker
        if (typeof pdfjsLib !== 'undefined') {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
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
        let englishVoices = this.voices.filter(voice => 
            voice.lang.startsWith('en')
        );

        if (englishVoices.length === 0) {
            this.voiceSelect.innerHTML = '<option>No English voices available</option>';
            return;
        }

        // Prioritize high-quality voices
        const qualityVoices = this.selectBestVoices(englishVoices);
        
        qualityVoices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = index;
            const gender = this.guessVoiceGender(voice.name);
            option.textContent = `${voice.name} ${gender}`;
            this.voiceSelect.appendChild(option);
        });

        // Store filtered voices for selection
        this.filteredVoices = qualityVoices;

        // Select first voice by default
        if (qualityVoices.length > 0) {
            this.selectedVoice = qualityVoices[0];
        }
    }

    selectBestVoices(voices) {
        // List of known high-quality voice names (prioritized)
        const premiumVoices = [
            'Samantha', 'Alex', 'Victoria', 'Karen', 'Daniel', 'Moira',
            'Fiona', 'Tessa', 'Ava', 'Nicky', 'Susan', 'Zoe',
            'Google US English', 'Google UK English Female', 'Google UK English Male',
            'Microsoft David', 'Microsoft Zira', 'Microsoft Mark',
            'Siri Female', 'Siri Male'
        ];

        // First, try to get premium voices
        let selectedVoices = [];
        
        premiumVoices.forEach(premiumName => {
            const found = voices.find(v => v.name.includes(premiumName));
            if (found && selectedVoices.length < 8) {
                selectedVoices.push(found);
            }
        });

        // If we don't have enough, add other English voices
        if (selectedVoices.length < 8) {
            const remaining = voices.filter(v => !selectedVoices.includes(v));
            
            // Prefer voices that don't have "compact" or "premium" in name (compact = lower quality)
            const betterRemaining = remaining.filter(v => 
                !v.name.toLowerCase().includes('compact') &&
                !v.name.toLowerCase().includes('premium')
            );
            
            const toAdd = betterRemaining.slice(0, 8 - selectedVoices.length);
            selectedVoices = [...selectedVoices, ...toAdd];
        }

        // If still not enough, just take what we have
        if (selectedVoices.length < 8) {
            const needed = 8 - selectedVoices.length;
            const remaining = voices.filter(v => !selectedVoices.includes(v));
            selectedVoices = [...selectedVoices, ...remaining.slice(0, needed)];
        }

        // Try to balance male and female voices
        return this.balanceGenders(selectedVoices.slice(0, 8));
    }

    balanceGenders(voices) {
        const females = [];
        const males = [];
        const unknown = [];

        voices.forEach(voice => {
            const name = voice.name.toLowerCase();
            
            // Female indicators
            if (name.includes('female') || name.includes('woman') ||
                name.includes('samantha') || name.includes('victoria') || 
                name.includes('karen') || name.includes('fiona') ||
                name.includes('moira') || name.includes('zoe') ||
                name.includes('susan') || name.includes('ava') ||
                name.includes('tessa') || name.includes('zira')) {
                females.push(voice);
            }
            // Male indicators
            else if (name.includes('male') || name.includes('man') ||
                     name.includes('alex') || name.includes('daniel') ||
                     name.includes('david') || name.includes('mark') ||
                     name.includes('tom') || name.includes('james')) {
                males.push(voice);
            }
            else {
                unknown.push(voice);
            }
        });

        // Try to get 4 female, 4 male
        const balanced = [
            ...females.slice(0, 4),
            ...males.slice(0, 4)
        ];

        // Fill remaining slots with unknowns if needed
        while (balanced.length < 8 && unknown.length > 0) {
            balanced.push(unknown.shift());
        }

        // If still not 8, add remaining from any category
        while (balanced.length < 8) {
            if (females.length > balanced.filter(v => females.includes(v)).length) {
                balanced.push(females[balanced.filter(v => females.includes(v)).length]);
            } else if (males.length > balanced.filter(v => males.includes(v)).length) {
                balanced.push(males[balanced.filter(v => males.includes(v)).length]);
            } else if (unknown.length > 0) {
                balanced.push(unknown.shift());
            } else {
                break;
            }
        }

        return balanced.slice(0, 8);
    }

    guessVoiceGender(name) {
        const nameLower = name.toLowerCase();
        
        if (nameLower.includes('female') || nameLower.includes('woman') ||
            nameLower.includes('samantha') || nameLower.includes('victoria') || 
            nameLower.includes('karen') || nameLower.includes('fiona') ||
            nameLower.includes('moira') || nameLower.includes('zoe') ||
            nameLower.includes('susan') || nameLower.includes('ava') ||
            nameLower.includes('tessa') || nameLower.includes('zira')) {
            return '(Female)';
        } else if (nameLower.includes('male') || nameLower.includes('man') ||
                   nameLower.includes('alex') || nameLower.includes('daniel') ||
                   nameLower.includes('david') || nameLower.includes('mark')) {
            return '(Male)';
        }
        
        return ''; // Unknown
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
            // Use filtered voices array
            const voices = this.filteredVoices || this.voices.filter(voice => 
                voice.lang.startsWith('en')
            );
            this.selectedVoice = voices[e.target.value];
        });
    }

    async handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        this.fileName = file.name;
        this.progressText.textContent = 'Loading file...';

        try {
            const text = await this.extractTextFromFile(file);
            if (text && text.trim().length > 0) {
                this.loadText(text, file.name);
            } else {
                throw new Error('No text could be extracted from this file');
            }
        } catch (error) {
            console.error('File loading error:', error);
            alert('Error loading file: ' + error.message);
            this.progressText.textContent = 'Error loading file';
        }
    }

    async extractTextFromFile(file) {
        const extension = file.name.split('.').pop().toLowerCase();

        this.progressText.textContent = `Processing ${extension.toUpperCase()} file...`;

        switch (extension) {
            case 'txt':
            case 'text':
                return await this.extractTextFromTXT(file);
            
            case 'pdf':
                return await this.extractTextFromPDF(file);
            
            case 'epub':
                return await this.extractTextFromEPUB(file);
            
            case 'docx':
                return await this.extractTextFromDOCX(file);
            
            case 'doc':
                alert('DOC format is not fully supported. Please convert to DOCX or TXT format.');
                return '';
            
            case 'rtf':
                return await this.extractTextFromRTF(file);
            
            case 'mobi':
                alert('MOBI format requires conversion. Please convert to EPUB or TXT format using Calibre or an online converter.');
                return '';
            
            default:
                // Try to read as plain text
                return await this.extractTextFromTXT(file);
        }
    }

    async extractTextFromTXT(file) {
        try {
            return await file.text();
        } catch (error) {
            throw new Error('Could not read text file: ' + error.message);
        }
    }

    async extractTextFromPDF(file) {
        if (typeof pdfjsLib === 'undefined') {
            throw new Error('PDF library not loaded. Please refresh the page and try again.');
        }

        try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            
            let fullText = '';
            const numPages = pdf.numPages;

            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                this.progressText.textContent = `Processing PDF: page ${pageNum} of ${numPages}...`;
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + '\n\n';
            }

            if (fullText.trim().length === 0) {
                throw new Error('No text found in PDF. The PDF might be image-based or encrypted.');
            }

            return fullText;
        } catch (error) {
            throw new Error('PDF extraction failed: ' + error.message);
        }
    }

    async extractTextFromEPUB(file) {
        if (typeof JSZip === 'undefined') {
            throw new Error('EPUB library not loaded. Please refresh the page and try again.');
        }

        try {
            const arrayBuffer = await file.arrayBuffer();
            const zip = await JSZip.loadAsync(arrayBuffer);
            
            let fullText = '';
            const htmlFiles = [];

            // Find all HTML/XHTML files
            zip.forEach((relativePath, zipEntry) => {
                if (relativePath.match(/\.(html|xhtml|htm)$/i) && !zipEntry.dir) {
                    htmlFiles.push(relativePath);
                }
            });

            // Sort files to maintain reading order (roughly)
            htmlFiles.sort();

            // Extract text from each HTML file
            for (const fileName of htmlFiles) {
                this.progressText.textContent = `Processing EPUB: ${htmlFiles.indexOf(fileName) + 1} of ${htmlFiles.length} sections...`;
                const content = await zip.file(fileName).async('string');
                const plainText = this.stripHTML(content);
                fullText += plainText + '\n\n';
            }

            if (fullText.trim().length === 0) {
                throw new Error('No readable content found in EPUB file.');
            }

            return fullText;
        } catch (error) {
            throw new Error('EPUB extraction failed: ' + error.message);
        }
    }

    async extractTextFromDOCX(file) {
        if (typeof JSZip === 'undefined') {
            throw new Error('DOCX library not loaded. Please refresh the page and try again.');
        }

        try {
            const arrayBuffer = await file.arrayBuffer();
            const zip = await JSZip.loadAsync(arrayBuffer);
            
            // Get document.xml which contains the main text
            const documentXML = await zip.file('word/document.xml').async('string');
            
            if (!documentXML) {
                throw new Error('Invalid DOCX file structure.');
            }

            const plainText = this.extractTextFromXML(documentXML);

            if (plainText.trim().length === 0) {
                throw new Error('No text found in DOCX file.');
            }

            return plainText;
        } catch (error) {
            throw new Error('DOCX extraction failed: ' + error.message);
        }
    }

    async extractTextFromRTF(file) {
        try {
            const text = await file.text();
            
            // Basic RTF to plain text conversion
            let plainText = text;
            
            // Remove RTF header
            plainText = plainText.replace(/^{\\rtf.*?\\viewkind\d+/s, '');
            
            // Remove RTF control words
            plainText = plainText.replace(/\\[a-z]+\d*\s?/g, ' ');
            
            // Remove curly braces
            plainText = plainText.replace(/[{}]/g, '');
            
            // Clean up whitespace
            plainText = plainText.replace(/\s+/g, ' ');
            plainText = plainText.trim();

            if (plainText.length === 0) {
                throw new Error('No text found in RTF file. Try converting to TXT or DOCX format.');
            }

            return plainText;
        } catch (error) {
            throw new Error('RTF extraction failed: ' + error.message);
        }
    }

    stripHTML(html) {
        let result = html;
        
        // Remove scripts and styles
        result = result.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
        result = result.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
        
        // Remove HTML tags
        result = result.replace(/<[^>]+>/g, ' ');
        
        // Decode common HTML entities
        result = result.replace(/&nbsp;/g, ' ');
        result = result.replace(/&lt;/g, '<');
        result = result.replace(/&gt;/g, '>');
        result = result.replace(/&amp;/g, '&');
        result = result.replace(/&quot;/g, '"');
        result = result.replace(/&#39;/g, "'");
        result = result.replace(/&apos;/g, "'");
        
        // Clean up whitespace
        result = result.replace(/[ \t]+/g, ' ');
        result = result.replace(/\n\s*\n/g, '\n\n');
        
        return result.trim();
    }

    extractTextFromXML(xml) {
        let result = '';
        
        // Extract text from <w:t> tags (Word text tags)
        const pattern = /<w:t[^>]*>([^<]+)<\/w:t>/g;
        let match;
        
        while ((match = pattern.exec(xml)) !== null) {
            result += match[1] + ' ';
        }
        
        // Also try to extract from <text> tags (generic XML)
        const textPattern = /<text[^>]*>([^<]+)<\/text>/g;
        while ((match = textPattern.exec(xml)) !== null) {
            result += match[1] + ' ';
        }
        
        return result.trim();
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
        
        // Show preview of text
        const previewLength = 1000;
        const preview = this.novelText.substring(0, previewLength);
        this.textDisplay.textContent = preview + 
            (this.novelText.length > previewLength ? '...' : '');
        
        this.fileNameDisplay.textContent = '📄 ' + this.fileName;
        
        this.progressText.textContent = `Ready to read (${this.sentences.length} sentences)`;
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
            this.progressText.textContent = `Ready to read (${this.sentences.length} sentences)`;
        }
    }

    updateProgressText() {
        const progress = Math.round((this.currentSentenceIndex / this.sentences.length) * 100);
        this.progressText.textContent = `Reading: ${progress}% complete (${this.currentSentenceIndex}/${this.sentences.length})`;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new NovelReader();
    console.log('Novel Reader initialized with enhanced format support');
});

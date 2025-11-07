// Novel Reader App - Enhanced with Chapter Navigation & Progress Tracking
class NovelReader {
    constructor() {
        this.novelText = '';
        this.fileName = '';
        this.chapters = [];
        this.currentChapterIndex = 0;
        this.currentPage = 0;
        this.pagesPerChapter = [];
        this.wordsPerPage = 400; // Adjustable
        
        this.sentences = [];
        this.currentSentenceIndex = 0;
        this.isReading = false;
        this.isPaused = false;
        
        // Speech synthesis
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.currentUtterance = null;
        this.filteredVoices = [];
        
        // Settings
        this.speed = 1.0;
        this.pitch = 1.0;
        this.selectedVoice = null;
        this.voiceEngine = 'responsive'; // 'responsive' or 'browser'
        this.responsiveVoiceReady = false;
        
        // Initialize
        this.initializeElements();
        this.initializeVoices();
        this.initializeResponsiveVoice();
        this.attachEventListeners();
        this.initializePDFJS();
        this.loadSavedProgress();
    }

    initializeResponsiveVoice() {
        // Check if ResponsiveVoice is loaded
        if (typeof responsiveVoice !== 'undefined') {
            responsiveVoice.OnVoiceReady = () => {
                this.responsiveVoiceReady = true;
                this.populateVoiceList();
            };
            
            // Set callbacks
            responsiveVoice.setDefaultVoice = (voice) => {
                this.selectedVoice = voice;
            };
        }
    }

    initializePDFJS() {
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
        
        // Reader elements
        this.chapterNav = document.getElementById('chapterNav');
        this.chapterSelect = document.getElementById('chapterSelect');
        this.prevChapterBtn = document.getElementById('prevChapterBtn');
        this.nextChapterBtn = document.getElementById('nextChapterBtn');
        this.readerContent = document.getElementById('readerContent');
        this.pageNav = document.getElementById('pageNav');
        this.pageInfo = document.getElementById('pageInfo');
        this.prevPageBtn = document.getElementById('prevPageBtn');
        this.nextPageBtn = document.getElementById('nextPageBtn');
        
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
        this.voiceEngineSelect = document.getElementById('voiceEngine');
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
        
        if (this.voiceEngine === 'responsive' && this.responsiveVoiceReady) {
            // Populate ResponsiveVoice voices
            const rvVoices = responsiveVoice.getVoices();
            
            // Filter for best English voices
            const englishVoices = rvVoices.filter(v => v.lang.startsWith('en'));
            const bestVoices = this.selectBestResponsiveVoices(englishVoices);
            
            bestVoices.forEach((voice, index) => {
                const option = document.createElement('option');
                option.value = voice.name;
                option.textContent = voice.name;
                this.voiceSelect.appendChild(option);
            });
            
            if (bestVoices.length > 0) {
                this.selectedVoice = bestVoices[0].name;
            }
        } else {
            // Use browser voices
            let englishVoices = this.voices.filter(voice => 
                voice.lang.startsWith('en')
            );

            if (englishVoices.length === 0) {
                this.voiceSelect.innerHTML = '<option>No English voices available</option>';
                return;
            }

            const qualityVoices = this.selectBestVoices(englishVoices);
            
            qualityVoices.forEach((voice, index) => {
                const option = document.createElement('option');
                option.value = index;
                const gender = this.guessVoiceGender(voice.name);
                option.textContent = `${voice.name} ${gender}`;
                this.voiceSelect.appendChild(option);
            });

            this.filteredVoices = qualityVoices;

            if (qualityVoices.length > 0) {
                this.selectedVoice = qualityVoices[0];
            }
        }
    }

    selectBestResponsiveVoices(voices) {
        // Prioritize high-quality ResponsiveVoice voices
        const premiumNames = [
            'UK English Female', 'UK English Male', 'US English Female', 'US English Male',
            'Australian Female', 'Australian Male', 'Irish Female', 'Irish Male'
        ];
        
        let selected = [];
        
        premiumNames.forEach(name => {
            const found = voices.find(v => v.name === name);
            if (found && selected.length < 8) {
                selected.push(found);
            }
        });
        
        // Add more if needed
        if (selected.length < 8) {
            const remaining = voices.filter(v => !selected.includes(v));
            selected = [...selected, ...remaining.slice(0, 8 - selected.length)];
        }
        
        return selected.slice(0, 8);
    }

    selectBestVoices(voices) {
        const premiumVoices = [
            'Samantha', 'Alex', 'Victoria', 'Karen', 'Daniel', 'Moira',
            'Fiona', 'Tessa', 'Ava', 'Nicky', 'Susan', 'Zoe',
            'Google US English', 'Google UK English Female', 'Google UK English Male',
            'Microsoft David', 'Microsoft Zira', 'Microsoft Mark'
        ];

        let selectedVoices = [];
        
        premiumVoices.forEach(premiumName => {
            const found = voices.find(v => v.name.includes(premiumName));
            if (found && selectedVoices.length < 8) {
                selectedVoices.push(found);
            }
        });

        if (selectedVoices.length < 8) {
            const remaining = voices.filter(v => !selectedVoices.includes(v));
            const betterRemaining = remaining.filter(v => 
                !v.name.toLowerCase().includes('compact')
            );
            const toAdd = betterRemaining.slice(0, 8 - selectedVoices.length);
            selectedVoices = [...selectedVoices, ...toAdd];
        }

        return this.balanceGenders(selectedVoices.slice(0, 8));
    }

    balanceGenders(voices) {
        const females = [];
        const males = [];
        const unknown = [];

        voices.forEach(voice => {
            const name = voice.name.toLowerCase();
            
            if (name.includes('female') || name.includes('samantha') || 
                name.includes('victoria') || name.includes('karen') ||
                name.includes('zira') || name.includes('moira')) {
                females.push(voice);
            } else if (name.includes('male') || name.includes('alex') || 
                       name.includes('daniel') || name.includes('david')) {
                males.push(voice);
            } else {
                unknown.push(voice);
            }
        });

        const balanced = [
            ...females.slice(0, 4),
            ...males.slice(0, 4)
        ];

        while (balanced.length < 8 && unknown.length > 0) {
            balanced.push(unknown.shift());
        }

        return balanced.slice(0, 8);
    }

    guessVoiceGender(name) {
        const nameLower = name.toLowerCase();
        
        if (nameLower.includes('female') || nameLower.includes('samantha') || 
            nameLower.includes('victoria') || nameLower.includes('karen') ||
            nameLower.includes('zira')) {
            return '(Female)';
        } else if (nameLower.includes('male') || nameLower.includes('alex') || 
                   nameLower.includes('daniel') || nameLower.includes('david')) {
            return '(Male)';
        }
        
        return '';
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
        
        // Chapter navigation
        this.prevChapterBtn.addEventListener('click', () => this.previousChapter());
        this.nextChapterBtn.addEventListener('click', () => this.nextChapter());
        this.chapterSelect.addEventListener('change', (e) => this.goToChapter(parseInt(e.target.value)));
        
        // Page navigation
        this.prevPageBtn.addEventListener('click', () => this.previousPage());
        this.nextPageBtn.addEventListener('click', () => this.nextPage());
        
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
        
        if (this.voiceEngineSelect) {
            this.voiceEngineSelect.addEventListener('change', (e) => {
                this.voiceEngine = e.target.value;
                this.populateVoiceList();
            });
        }
        
        this.voiceSelect.addEventListener('change', (e) => {
            if (this.voiceEngine === 'responsive') {
                this.selectedVoice = e.target.value;
            } else {
                const voices = this.filteredVoices || this.voices.filter(voice => 
                    voice.lang.startsWith('en')
                );
                this.selectedVoice = voices[e.target.value];
            }
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
                return await file.text();
            case 'pdf':
                return await this.extractTextFromPDF(file);
            case 'epub':
                return await this.extractTextFromEPUB(file);
            case 'docx':
                return await this.extractTextFromDOCX(file);
            case 'rtf':
                return await this.extractTextFromRTF(file);
            default:
                return await file.text();
        }
    }

    async extractTextFromPDF(file) {
        if (typeof pdfjsLib === 'undefined') {
            throw new Error('PDF library not loaded');
        }

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise();
        
        let fullText = '';
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            this.progressText.textContent = `Processing PDF: page ${pageNum} of ${pdf.numPages}...`;
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n\n';
        }

        return fullText;
    }

    async extractTextFromEPUB(file) {
        if (typeof JSZip === 'undefined') {
            throw new Error('EPUB library not loaded');
        }

        const arrayBuffer = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);
        
        let fullText = '';
        const htmlFiles = [];

        zip.forEach((relativePath, zipEntry) => {
            if (relativePath.match(/\.(html|xhtml|htm)$/i) && !zipEntry.dir) {
                htmlFiles.push(relativePath);
            }
        });

        htmlFiles.sort();

        for (const fileName of htmlFiles) {
            const content = await zip.file(fileName).async('string');
            const plainText = this.stripHTML(content);
            fullText += plainText + '\n\n';
        }

        return fullText;
    }

    async extractTextFromDOCX(file) {
        if (typeof JSZip === 'undefined') {
            throw new Error('DOCX library not loaded');
        }

        const arrayBuffer = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);
        const documentXML = await zip.file('word/document.xml').async('string');
        return this.extractTextFromXML(documentXML);
    }

    async extractTextFromRTF(file) {
        let text = await file.text();
        text = text.replace(/^{\\rtf.*?\\viewkind\d+/s, '');
        text = text.replace(/\\[a-z]+\d*\s?/g, ' ');
        text = text.replace(/[{}]/g, '');
        text = text.replace(/\s+/g, ' ');
        return text.trim();
    }

    stripHTML(html) {
        let result = html;
        result = result.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
        result = result.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
        result = result.replace(/<[^>]+>/g, ' ');
        result = result.replace(/&nbsp;/g, ' ');
        result = result.replace(/&lt;/g, '<');
        result = result.replace(/&gt;/g, '>');
        result = result.replace(/&amp;/g, '&');
        result = result.replace(/&quot;/g, '"');
        result = result.replace(/&#39;/g, "'");
        result = result.replace(/[ \t]+/g, ' ');
        result = result.replace(/\n\s*\n/g, '\n\n');
        return result.trim();
    }

    extractTextFromXML(xml) {
        let result = '';
        const pattern = /<w:t[^>]*>([^<]+)<\/w:t>/g;
        let match;
        
        while ((match = pattern.exec(xml)) !== null) {
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
        
        // Detect and split chapters
        this.detectChapters(text);
        
        // Split into sentences for speech
        this.sentences = this.splitIntoSentences(text);
        this.currentSentenceIndex = 0;
        
        // Load saved progress if available
        const saved = this.getSavedProgress(filename);
        if (saved) {
            this.currentChapterIndex = saved.chapter;
            this.currentPage = saved.page;
        } else {
            this.currentChapterIndex = 0;
            this.currentPage = 0;
        }
        
        this.showTextDisplay();
        this.renderCurrentPage();
        this.updateProgress();
    }

    detectChapters(text) {
        // Try to detect chapters by common patterns
        const chapterPatterns = [
            /Chapter\s+\d+/gi,
            /CHAPTER\s+[IVXLCDM]+/gi,
            /Part\s+\d+/gi,
            /Book\s+\d+/gi
        ];

        let chapterMatches = [];
        
        for (const pattern of chapterPatterns) {
            const matches = [...text.matchAll(pattern)];
            if (matches.length > 0) {
                chapterMatches = matches;
                break;
            }
        }

        if (chapterMatches.length > 0) {
            this.chapters = [];
            
            for (let i = 0; i < chapterMatches.length; i++) {
                const startIndex = chapterMatches[i].index;
                const endIndex = i < chapterMatches.length - 1 
                    ? chapterMatches[i + 1].index 
                    : text.length;
                
                const chapterText = text.substring(startIndex, endIndex).trim();
                const chapterTitle = chapterMatches[i][0];
                
                this.chapters.push({
                    title: chapterTitle,
                    text: chapterText,
                    startIndex: startIndex
                });
            }
        } else {
            // No chapters detected, treat entire text as one chapter
            this.chapters = [{
                title: 'Full Text',
                text: text,
                startIndex: 0
            }];
        }

        // Paginate each chapter
        this.paginateChapters();
        this.populateChapterSelect();
    }

    paginateChapters() {
        this.pagesPerChapter = [];
        
        for (const chapter of this.chapters) {
            const words = chapter.text.split(/\s+/);
            const pages = [];
            
            for (let i = 0; i < words.length; i += this.wordsPerPage) {
                const pageWords = words.slice(i, i + this.wordsPerPage);
                pages.push(pageWords.join(' '));
            }
            
            this.pagesPerChapter.push(pages);
        }
    }

    populateChapterSelect() {
        this.chapterSelect.innerHTML = '';
        
        this.chapters.forEach((chapter, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = chapter.title;
            this.chapterSelect.appendChild(option);
        });
        
        this.chapterSelect.value = this.currentChapterIndex;
        this.chapterNav.style.display = this.chapters.length > 1 ? 'flex' : 'none';
    }

    renderCurrentPage() {
        const pages = this.pagesPerChapter[this.currentChapterIndex];
        if (!pages || pages.length === 0) return;
        
        const pageText = pages[this.currentPage] || '';
        
        // Clear and render
        this.readerContent.innerHTML = '';
        
        // Split into sentences for highlighting
        const sentences = pageText.match(/[^.!?]+[.!?]+/g) || [pageText];
        
        sentences.forEach((sentence, index) => {
            const span = document.createElement('span');
            span.className = 'sentence';
            span.setAttribute('data-sentence-index', index);
            span.textContent = sentence + ' ';
            this.readerContent.appendChild(span);
        });
        
        // Update page info
        this.pageInfo.textContent = `Page ${this.currentPage + 1} of ${pages.length}`;
        
        // Update navigation buttons
        this.prevPageBtn.disabled = this.currentPage === 0;
        this.nextPageBtn.disabled = this.currentPage === pages.length - 1;
        this.prevChapterBtn.disabled = this.currentChapterIndex === 0;
        this.nextChapterBtn.disabled = this.currentChapterIndex === this.chapters.length - 1;
        
        // Save progress
        this.saveProgress();
    }

    previousPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.renderCurrentPage();
        }
    }

    nextPage() {
        const pages = this.pagesPerChapter[this.currentChapterIndex];
        if (this.currentPage < pages.length - 1) {
            this.currentPage++;
            this.renderCurrentPage();
        } else {
            // Auto-advance to next chapter
            if (this.currentChapterIndex < this.chapters.length - 1) {
                this.nextChapter();
            }
        }
    }

    previousChapter() {
        if (this.currentChapterIndex > 0) {
            this.currentChapterIndex--;
            this.currentPage = 0;
            this.chapterSelect.value = this.currentChapterIndex;
            this.renderCurrentPage();
        }
    }

    nextChapter() {
        if (this.currentChapterIndex < this.chapters.length - 1) {
            this.currentChapterIndex++;
            this.currentPage = 0;
            this.chapterSelect.value = this.currentChapterIndex;
            this.renderCurrentPage();
        }
    }

    goToChapter(chapterIndex) {
        if (chapterIndex >= 0 && chapterIndex < this.chapters.length) {
            this.currentChapterIndex = chapterIndex;
            this.currentPage = 0;
            this.renderCurrentPage();
        }
    }

    saveProgress() {
        const progress = {
            fileName: this.fileName,
            chapter: this.currentChapterIndex,
            page: this.currentPage,
            timestamp: Date.now()
        };
        
        localStorage.setItem(`novel-reader-progress-${this.fileName}`, JSON.stringify(progress));
    }

    getSavedProgress(filename) {
        const saved = localStorage.getItem(`novel-reader-progress-${filename}`);
        return saved ? JSON.parse(saved) : null;
    }

    loadSavedProgress() {
        // This will be called when loading a file
    }

    splitIntoSentences(text) {
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
        
        this.fileNameDisplay.textContent = '📄 ' + this.fileName;
        this.progressText.textContent = `Ready to read (${this.chapters.length} chapters)`;
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
        const sampleText = `Chapter 1: The Beginning

It was a bright cold day in April, and the clocks were striking thirteen. The protagonist walked down the cobblestone street, lost in thought about the adventures that lay ahead. The morning sun cast long shadows across the pavement.

Chapter 2: The Discovery

The shop was much larger than it appeared from the outside. Rows upon rows of bookshelves stretched into the dim recesses of the building. Each shelf seemed to lean slightly, as if weighted down by the centuries of knowledge they contained.

Chapter 3: The Journey

Days turned into weeks as the adventure continued. New friends were made, challenges were overcome, and the protagonist grew wiser with each passing moment.`;

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
        if (this.voiceEngine === 'responsive') {
            responsiveVoice.pause();
        } else {
            this.synth.pause();
        }
        this.isReading = false;
        this.isPaused = true;
        this.playBtn.textContent = '▶️';
        this.progressText.textContent = 'Paused';
    }

    resumeReading() {
        if (this.voiceEngine === 'responsive') {
            responsiveVoice.resume();
        } else {
            this.synth.resume();
        }
        this.isReading = true;
        this.isPaused = false;
        this.playBtn.textContent = '⏸️';
        this.updateProgressText();
    }

    stopReading() {
        if (this.voiceEngine === 'responsive') {
            responsiveVoice.cancel();
        } else {
            this.synth.cancel();
        }
        this.isReading = false;
        this.isPaused = false;
        this.currentSentenceIndex = 0;
        this.playBtn.textContent = '▶️';
        this.stopBtn.disabled = true;
        this.skipBtn.disabled = true;
        this.clearHighlights();
        this.updateProgress();
        this.progressText.textContent = 'Stopped';
    }

    skipForward() {
        if (this.currentSentenceIndex < this.sentences.length - 1) {
            if (this.voiceEngine === 'responsive') {
                responsiveVoice.cancel();
            } else {
                this.synth.cancel();
            }
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
        
        // Highlight current sentence
        this.highlightCurrentSentence(sentence);
        
        if (this.voiceEngine === 'responsive' && this.responsiveVoiceReady) {
            // Use ResponsiveVoice
            const options = {
                rate: this.speed,
                pitch: this.pitch,
                onend: () => {
                    if (this.isReading) {
                        this.currentSentenceIndex++;
                        this.updateProgress();
                        this.checkAndTurnPage();
                        
                        setTimeout(() => {
                            if (this.isReading) {
                                this.speakCurrentSentence();
                            }
                        }, 200);
                    }
                },
                onerror: (event) => {
                    console.error('ResponsiveVoice error:', event);
                    this.stopReading();
                }
            };
            
            responsiveVoice.speak(sentence, this.selectedVoice, options);
        } else {
            // Use browser SpeechSynthesis
            const utterance = new SpeechSynthesisUtterance(sentence);
            utterance.rate = this.speed;
            utterance.pitch = this.pitch;
            utterance.voice = this.selectedVoice;
            
            utterance.onend = () => {
                if (this.isReading) {
                    this.currentSentenceIndex++;
                    this.updateProgress();
                    this.checkAndTurnPage();
                    
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
            };

            this.currentUtterance = utterance;
            this.synth.speak(utterance);
        }
        
        this.updateProgressText();
    }

    highlightCurrentSentence(sentence) {
        // Clear previous highlights
        this.clearHighlights();
        
        // Find and highlight current sentence in the page
        const sentenceSpans = this.readerContent.querySelectorAll('.sentence');
        sentenceSpans.forEach(span => {
            if (span.textContent.trim().includes(sentence.trim().substring(0, 50))) {
                span.classList.add('highlighted');
            }
        });
    }

    clearHighlights() {
        const highlighted = this.readerContent.querySelectorAll('.highlighted');
        highlighted.forEach(el => el.classList.remove('highlighted'));
    }

    checkAndTurnPage() {
        // Check if we need to turn the page based on current sentence
        // This is a simplified version - could be more sophisticated
        const currentPageText = this.pagesPerChapter[this.currentChapterIndex][this.currentPage];
        const currentSentence = this.sentences[this.currentSentenceIndex];
        
        if (!currentPageText.includes(currentSentence) && 
            this.currentPage < this.pagesPerChapter[this.currentChapterIndex].length - 1) {
            this.nextPage();
        }
    }

    updateProgress() {
        if (this.sentences.length === 0) {
            this.progressFill.style.width = '0%';
            return;
        }

        const progress = (this.currentSentenceIndex / this.sentences.length) * 100;
        this.progressFill.style.width = progress + '%';
        
        if (!this.isReading && !this.isPaused) {
            this.progressText.textContent = `Ready to read (${this.chapters.length} chapters)`;
        }
    }

    updateProgressText() {
        const progress = Math.round((this.currentSentenceIndex / this.sentences.length) * 100);
        this.progressText.textContent = `Reading: ${progress}% complete`;
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    const app = new NovelReader();
    console.log('Novel Reader initialized with chapter navigation');
});

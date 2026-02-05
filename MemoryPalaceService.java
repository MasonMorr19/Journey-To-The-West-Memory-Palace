/**
 * 西遊記記憶宮殿 - Java Android 实现
 * Xī Yóu Jì Jì Yì Gōng Diàn - Java Android Implementation
 * 
 * Journey to the West Memory Palace
 * 
 * This package implements the core memory palace system for Android using:
 * - Room Database for local storage
 * - ViewModel/LiveData for reactive UI
 * - ArcGIS Runtime SDK for map integration
 * 
 * Based on the mnemonic principles of:
 * - Matteo Ricci (利瑪竇) - Memory Palace for Chinese characters
 * - Giordano Bruno - Emotionally striking imagery
 * - Journey to the West (西遊記) - Narrative structure
 * 
 * @author Memory Palace Development Team
 * @version 1.0.0
 */

package com.memorypalace;

import java.util.*;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

// ============================================================================
// ENUMERATIONS
// ============================================================================

/**
 * 支持的方言 (Zhīchí de fāngyán) - Supported Chinese Dialects
 * 
 * Each dialect has unique tonal patterns and romanization systems.
 * Respecting China's linguistic diversity while building Mandarin proficiency.
 */
enum Dialect {
    MANDARIN("mandarin", "普通话", "Pǔtōnghuà", 4),
    CANTONESE("cantonese", "粤语", "Yuèyǔ", 9),
    MINNAN("minnan", "闽南语", "Mǐnnányǔ", 7),
    SHANGHAINESE("shanghainese", "上海话", "Shànghǎihuà", 5),
    SICHUANESE("sichuanese", "四川话", "Sìchuānhuà", 4);

    private final String id;
    private final String chineseName;
    private final String pinyin;
    private final int toneCount;

    Dialect(String id, String chineseName, String pinyin, int toneCount) {
        this.id = id;
        this.chineseName = chineseName;
        this.pinyin = pinyin;
        this.toneCount = toneCount;
    }

    public String getId() { return id; }
    public String getChineseName() { return chineseName; }
    public String getPinyin() { return pinyin; }
    public int getToneCount() { return toneCount; }
}

/**
 * 学习阶段 (Xuéxí jiēduàn) - Learning Phases
 * 
 * Following Ricci's methodology for character acquisition:
 * 1. Overview - First impression of the character
 * 2. Decompose - Break into radical components
 * 3. Imagine - Create vivid Journey to the West imagery
 * 4. Practice - Active recall and usage
 * 5. Master - Long-term retention via spaced repetition
 */
enum LearningPhase {
    NEW("new", "新", "Xīn"),
    OVERVIEW("overview", "总览", "Zǒnglǎn"),
    DECOMPOSE("decompose", "分解", "Fēnjiě"),
    IMAGINE("imagine", "想象", "Xiǎngxiàng"),
    PRACTICE("practice", "练习", "Liànxí"),
    MASTER("master", "掌握", "Zhǎngwò");

    private final String id;
    private final String chinese;
    private final String pinyin;

    LearningPhase(String id, String chinese, String pinyin) {
        this.id = id;
        this.chinese = chinese;
        this.pinyin = pinyin;
    }

    public String getId() { return id; }
    public String getChinese() { return chinese; }
    public String getPinyin() { return pinyin; }
}

/**
 * 取经团队成员 (Qǔjīng tuánduì chéngyuán) - Pilgrimage Team Members
 * 
 * Each pilgrim represents a different cognitive function in the learning process.
 */
enum Pilgrim {
    SUN_WUKONG("sun_wukong", "孙悟空", "Sūn Wùkōng", "Mind Monkey", "Working memory, active problem-solving"),
    TANG_SANZANG("tang_sanzang", "唐三藏", "Táng Sānzàng", "Tang Monk", "Executive control, discipline"),
    ZHU_BAJIE("zhu_bajie", "猪八戒", "Zhū Bājiè", "Pig of Eight Prohibitions", "Emotional encoding, humor"),
    SHA_WUJING("sha_wujing", "沙悟净", "Shā Wùjìng", "Sand Monk", "Procedural memory, persistence"),
    BAILONG_MA("bailong_ma", "白龙马", "Báilóng Mǎ", "White Dragon Horse", "Motivation, carrying forward");

    private final String id;
    private final String chinese;
    private final String pinyin;
    private final String englishTitle;
    private final String cognitiveRole;

    Pilgrim(String id, String chinese, String pinyin, String englishTitle, String cognitiveRole) {
        this.id = id;
        this.chinese = chinese;
        this.pinyin = pinyin;
        this.englishTitle = englishTitle;
        this.cognitiveRole = cognitiveRole;
    }

    public String getId() { return id; }
    public String getChinese() { return chinese; }
    public String getPinyin() { return pinyin; }
    public String getEnglishTitle() { return englishTitle; }
    public String getCognitiveRole() { return cognitiveRole; }
}

// ============================================================================
// DATA CLASSES
// ============================================================================

/**
 * 发音信息 (Fāyīn xìnxī) - Pronunciation Information
 * 
 * Stores pronunciation data for a specific dialect variant.
 * Includes romanization, IPA, tone marking, and audio reference.
 */
class PronunciationInfo {
    private String romanization;  // Pinyin, Jyutping, POJ, etc.
    private String ipa;           // International Phonetic Alphabet
    private int tone;             // Tone number (dialect-specific)
    private String audioFile;     // Path to pronunciation audio

    public PronunciationInfo() {}

    public PronunciationInfo(String romanization, String ipa, int tone, String audioFile) {
        this.romanization = romanization;
        this.ipa = ipa;
        this.tone = tone;
        this.audioFile = audioFile;
    }

    // Getters and Setters
    public String getRomanization() { return romanization; }
    public void setRomanization(String romanization) { this.romanization = romanization; }
    
    public String getIpa() { return ipa; }
    public void setIpa(String ipa) { this.ipa = ipa; }
    
    public int getTone() { return tone; }
    public void setTone(int tone) { this.tone = tone; }
    
    public String getAudioFile() { return audioFile; }
    public void setAudioFile(String audioFile) { this.audioFile = audioFile; }

    @Override
    public String toString() {
        return String.format("%s [%s] (tone %d)", romanization, ipa, tone);
    }
}

/**
 * 记忆图像 (Jìyì túxiàng) - Memory Image
 * 
 * Following Bruno's principles from "De Umbris Idearum":
 * "Images should be emotionally striking, either heroic, horrifying or comic"
 * 
 * Each memory image connects to Journey to the West narrative for vivid encoding.
 */
class MemoryImage {
    private String scene;              // Visual scene description
    private String action;             // Dynamic action (not static!)
    private String emotion;            // Emotional anchor
    private String mnemonicPhrase;     // Key pronunciation/meaning hook
    private Pilgrim pilgrimGuide;      // Which pilgrim guides this character
    private String locationInPalace;   // Spatial placement in memory palace

    public MemoryImage() {}

    public MemoryImage(String scene, String action, String emotion, 
                       String mnemonicPhrase, Pilgrim pilgrimGuide, String locationInPalace) {
        this.scene = scene;
        this.action = action;
        this.emotion = emotion;
        this.mnemonicPhrase = mnemonicPhrase;
        this.pilgrimGuide = pilgrimGuide;
        this.locationInPalace = locationInPalace;
    }

    // Builder pattern for fluent construction
    public static class Builder {
        private MemoryImage image = new MemoryImage();

        public Builder scene(String scene) { image.scene = scene; return this; }
        public Builder action(String action) { image.action = action; return this; }
        public Builder emotion(String emotion) { image.emotion = emotion; return this; }
        public Builder mnemonicPhrase(String phrase) { image.mnemonicPhrase = phrase; return this; }
        public Builder pilgrimGuide(Pilgrim pilgrim) { image.pilgrimGuide = pilgrim; return this; }
        public Builder locationInPalace(String location) { image.locationInPalace = location; return this; }
        public MemoryImage build() { return image; }
    }

    // Getters and Setters
    public String getScene() { return scene; }
    public void setScene(String scene) { this.scene = scene; }
    
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    
    public String getEmotion() { return emotion; }
    public void setEmotion(String emotion) { this.emotion = emotion; }
    
    public String getMnemonicPhrase() { return mnemonicPhrase; }
    public void setMnemonicPhrase(String mnemonicPhrase) { this.mnemonicPhrase = mnemonicPhrase; }
    
    public Pilgrim getPilgrimGuide() { return pilgrimGuide; }
    public void setPilgrimGuide(Pilgrim pilgrimGuide) { this.pilgrimGuide = pilgrimGuide; }
    
    public String getLocationInPalace() { return locationInPalace; }
    public void setLocationInPalace(String locationInPalace) { this.locationInPalace = locationInPalace; }
}

/**
 * 汉字 (Hànzì) - Chinese Character
 * 
 * Core data structure implementing Ricci's ideograph-as-image principle.
 * Each character contains complete learning data including multi-dialect support.
 */
class ChineseCharacter {
    private String character;           // The character itself
    private String pinyin;              // Mandarin pinyin
    private String ipa;                 // IPA pronunciation
    private int tone;                   // Tone (1-4 for Mandarin)
    private String meaning;             // English meaning
    private int radicalNumber;          // Kangxi radical number (1-214)
    private int strokeCount;            // Number of strokes
    private MemoryImage memoryImage;    // Journey to the West imagery
    private Map<Dialect, PronunciationInfo> dialects;  // Multi-dialect support
    private Map<String, String> strokeAnalysis;        // Decomposition info
    private List<UsageExample> usageExamples;          // Example sentences
    private List<String> compoundCharacters;           // Related compounds
    private String culturalNote;        // Cultural context
    private String philosophicalNote;   // Buddhist/Daoist/Confucian connections

    public ChineseCharacter() {
        this.dialects = new EnumMap<>(Dialect.class);
        this.strokeAnalysis = new HashMap<>();
        this.usageExamples = new ArrayList<>();
        this.compoundCharacters = new ArrayList<>();
    }

    /**
     * Generate unique ID for this character based on character and radical.
     * Used for database storage and retrieval.
     */
    public String getUniqueId() {
        return String.format("%s_%d", character, radicalNumber).hashCode() + "";
    }

    /**
     * Get pronunciation for a specific dialect.
     * Falls back to Mandarin if dialect not available.
     */
    public PronunciationInfo getPronunciation(Dialect dialect) {
        if (dialects.containsKey(dialect)) {
            return dialects.get(dialect);
        }
        // Fallback to Mandarin
        return new PronunciationInfo(pinyin, ipa, tone, null);
    }

    /**
     * Get formatted display string for the character.
     */
    public String getDisplayString() {
        return String.format("%s (%s) - %s", character, pinyin, meaning);
    }

    // Builder pattern
    public static class Builder {
        private ChineseCharacter c = new ChineseCharacter();

        public Builder character(String character) { c.character = character; return this; }
        public Builder pinyin(String pinyin) { c.pinyin = pinyin; return this; }
        public Builder ipa(String ipa) { c.ipa = ipa; return this; }
        public Builder tone(int tone) { c.tone = tone; return this; }
        public Builder meaning(String meaning) { c.meaning = meaning; return this; }
        public Builder radicalNumber(int number) { c.radicalNumber = number; return this; }
        public Builder strokeCount(int count) { c.strokeCount = count; return this; }
        public Builder memoryImage(MemoryImage image) { c.memoryImage = image; return this; }
        public Builder addDialect(Dialect dialect, PronunciationInfo info) {
            c.dialects.put(dialect, info);
            return this;
        }
        public Builder strokeAnalysis(String key, String value) {
            c.strokeAnalysis.put(key, value);
            return this;
        }
        public Builder addExample(UsageExample example) {
            c.usageExamples.add(example);
            return this;
        }
        public Builder culturalNote(String note) { c.culturalNote = note; return this; }
        public Builder philosophicalNote(String note) { c.philosophicalNote = note; return this; }
        public ChineseCharacter build() { return c; }
    }

    // Getters and Setters (abbreviated for space)
    public String getCharacter() { return character; }
    public void setCharacter(String character) { this.character = character; }
    public String getPinyin() { return pinyin; }
    public void setPinyin(String pinyin) { this.pinyin = pinyin; }
    public String getIpa() { return ipa; }
    public void setIpa(String ipa) { this.ipa = ipa; }
    public int getTone() { return tone; }
    public void setTone(int tone) { this.tone = tone; }
    public String getMeaning() { return meaning; }
    public void setMeaning(String meaning) { this.meaning = meaning; }
    public int getRadicalNumber() { return radicalNumber; }
    public void setRadicalNumber(int radicalNumber) { this.radicalNumber = radicalNumber; }
    public int getStrokeCount() { return strokeCount; }
    public void setStrokeCount(int strokeCount) { this.strokeCount = strokeCount; }
    public MemoryImage getMemoryImage() { return memoryImage; }
    public void setMemoryImage(MemoryImage memoryImage) { this.memoryImage = memoryImage; }
    public Map<Dialect, PronunciationInfo> getDialects() { return dialects; }
    public Map<String, String> getStrokeAnalysis() { return strokeAnalysis; }
    public List<UsageExample> getUsageExamples() { return usageExamples; }
    public String getCulturalNote() { return culturalNote; }
    public void setCulturalNote(String culturalNote) { this.culturalNote = culturalNote; }
    public String getPhilosophicalNote() { return philosophicalNote; }
    public void setPhilosophicalNote(String philosophicalNote) { this.philosophicalNote = philosophicalNote; }
}

/**
 * 例句 (Lìjù) - Usage Example
 * 
 * Example sentence demonstrating character usage, preferably from Journey to the West.
 */
class UsageExample {
    private String sentence;        // Chinese sentence
    private String pinyin;          // Full pinyin
    private String english;         // English translation
    private String source;          // Source (e.g., "Journey to the West, Chapter 14")

    public UsageExample() {}

    public UsageExample(String sentence, String pinyin, String english, String source) {
        this.sentence = sentence;
        this.pinyin = pinyin;
        this.english = english;
        this.source = source;
    }

    // Getters and Setters
    public String getSentence() { return sentence; }
    public void setSentence(String sentence) { this.sentence = sentence; }
    public String getPinyin() { return pinyin; }
    public void setPinyin(String pinyin) { this.pinyin = pinyin; }
    public String getEnglish() { return english; }
    public void setEnglish(String english) { this.english = english; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
}

/**
 * 记忆站点 (Jìyì zhàndiǎn) - Memory Station
 * 
 * A locus within the memory palace containing multiple characters.
 * Based on specific locations from Journey to the West.
 */
class MemoryStation {
    private String id;
    private String nameChinese;
    private String namePinyin;
    private String nameIpa;
    private String nameEnglish;
    private String theme;               // Character theme (water, fire, etc.)
    private Pilgrim pilgrimGuide;       // Which pilgrim teaches here
    private List<ChineseCharacter> characters;
    private String description;

    public MemoryStation() {
        this.characters = new ArrayList<>();
    }

    public MemoryStation(String id, String nameChinese, String namePinyin, 
                         String nameIpa, String nameEnglish) {
        this();
        this.id = id;
        this.nameChinese = nameChinese;
        this.namePinyin = namePinyin;
        this.nameIpa = nameIpa;
        this.nameEnglish = nameEnglish;
    }

    /**
     * Get formatted bilingual name.
     */
    public String getBilingualName() {
        return String.format("%s (%s) | %s", nameChinese, namePinyin, nameEnglish);
    }

    /**
     * Get number of characters in this station.
     */
    public int getCharacterCount() {
        return characters.size();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getNameChinese() { return nameChinese; }
    public void setNameChinese(String nameChinese) { this.nameChinese = nameChinese; }
    public String getNamePinyin() { return namePinyin; }
    public void setNamePinyin(String namePinyin) { this.namePinyin = namePinyin; }
    public String getNameIpa() { return nameIpa; }
    public void setNameIpa(String nameIpa) { this.nameIpa = nameIpa; }
    public String getNameEnglish() { return nameEnglish; }
    public void setNameEnglish(String nameEnglish) { this.nameEnglish = nameEnglish; }
    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }
    public Pilgrim getPilgrimGuide() { return pilgrimGuide; }
    public void setPilgrimGuide(Pilgrim pilgrimGuide) { this.pilgrimGuide = pilgrimGuide; }
    public List<ChineseCharacter> getCharacters() { return characters; }
    public void addCharacter(ChineseCharacter character) { this.characters.add(character); }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}

/**
 * 记忆宫殿 (Jìyì gōngdiàn) - Memory Palace
 * 
 * A major location from Journey to the West containing multiple stations.
 * Maps to real-world ArcGIS coordinates for geographical memory anchoring.
 */
class MemoryPalace {
    private String id;
    private String nameChinese;
    private String namePinyin;
    private String nameIpa;
    private String nameEnglish;
    private String description;
    private double latitude;
    private double longitude;
    private String realLocation;        // Actual place in China
    private String arcgisLayerId;       // Layer ID for StoryMap
    private List<MemoryStation> stations;

    public MemoryPalace() {
        this.stations = new ArrayList<>();
    }

    /**
     * Get total character count across all stations.
     */
    public int getTotalCharacterCount() {
        return stations.stream()
                .mapToInt(MemoryStation::getCharacterCount)
                .sum();
    }

    /**
     * Get GeoJSON representation for ArcGIS.
     */
    public Map<String, Object> toGeoJson() {
        Map<String, Object> feature = new HashMap<>();
        feature.put("type", "Feature");
        
        Map<String, Object> geometry = new HashMap<>();
        geometry.put("type", "Point");
        geometry.put("coordinates", Arrays.asList(longitude, latitude));
        feature.put("geometry", geometry);
        
        Map<String, Object> properties = new HashMap<>();
        properties.put("id", id);
        properties.put("name_chinese", nameChinese);
        properties.put("name_pinyin", namePinyin);
        properties.put("name_english", nameEnglish);
        properties.put("character_count", getTotalCharacterCount());
        feature.put("properties", properties);
        
        return feature;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getNameChinese() { return nameChinese; }
    public void setNameChinese(String nameChinese) { this.nameChinese = nameChinese; }
    public String getNamePinyin() { return namePinyin; }
    public void setNamePinyin(String namePinyin) { this.namePinyin = namePinyin; }
    public String getNameIpa() { return nameIpa; }
    public void setNameIpa(String nameIpa) { this.nameIpa = nameIpa; }
    public String getNameEnglish() { return nameEnglish; }
    public void setNameEnglish(String nameEnglish) { this.nameEnglish = nameEnglish; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }
    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
    public String getRealLocation() { return realLocation; }
    public void setRealLocation(String realLocation) { this.realLocation = realLocation; }
    public String getArcgisLayerId() { return arcgisLayerId; }
    public void setArcgisLayerId(String arcgisLayerId) { this.arcgisLayerId = arcgisLayerId; }
    public List<MemoryStation> getStations() { return stations; }
    public void addStation(MemoryStation station) { this.stations.add(station); }
}

// ============================================================================
// SPACED REPETITION SYSTEM
// ============================================================================

/**
 * 学习进度 (Xuéxí jìndù) - Learning Progress
 * 
 * Tracks user progress using SM-2 spaced repetition algorithm variant.
 * 
 * The SM-2 algorithm was chosen because:
 * 1. Proven effectiveness over decades of research
 * 2. Adaptable to individual learning patterns
 * 3. Balances review frequency with long-term retention
 */
class LearningProgress {
    private String characterId;
    private String character;
    private LearningPhase phase;
    private double easeFactor;      // SM-2 ease factor (default 2.5)
    private int interval;           // Days until next review
    private int repetitions;        // Successful repetitions
    private LocalDateTime lastReview;
    private LocalDateTime nextReview;
    private List<ReviewRecord> reviewHistory;

    public LearningProgress(String characterId, String character) {
        this.characterId = characterId;
        this.character = character;
        this.phase = LearningPhase.NEW;
        this.easeFactor = 2.5;
        this.interval = 1;
        this.repetitions = 0;
        this.reviewHistory = new ArrayList<>();
    }

    /**
     * Update progress after a review session.
     * 
     * Quality scale (following SM-2):
     * 0 - Complete failure to recall (完全遗忘)
     * 1 - Incorrect; correct seemed easy (错误但觉得简单)
     * 2 - Incorrect; correct remembered with difficulty (错误后努力回忆)
     * 3 - Correct with serious difficulty (困难地正确)
     * 4 - Correct after hesitation (犹豫后正确)
     * 5 - Perfect response (完美回答)
     * 
     * @param quality Review quality (0-5)
     */
    public void updateAfterReview(int quality) {
        if (quality < 0 || quality > 5) {
            throw new IllegalArgumentException("Quality must be between 0 and 5");
        }

        repetitions++;
        lastReview = LocalDateTime.now();

        // Record in history
        reviewHistory.add(new ReviewRecord(lastReview, quality, interval));

        // Update ease factor using SM-2 formula
        easeFactor = Math.max(1.3, 
            easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

        // Update interval
        if (quality < 3) {
            // Failed review - reset
            repetitions = 0;
            interval = 1;
        } else {
            // Successful review - extend interval
            if (repetitions == 1) {
                interval = 1;
            } else if (repetitions == 2) {
                interval = 6;
            } else {
                interval = (int) Math.round(interval * easeFactor);
            }
        }

        // Set next review date
        nextReview = lastReview.plusDays(interval);

        // Update phase based on repetitions and quality
        updatePhase(quality);
    }

    /**
     * Update learning phase based on progress.
     */
    private void updatePhase(int quality) {
        if (repetitions >= 5 && quality >= 4) {
            phase = LearningPhase.MASTER;
        } else if (repetitions >= 3) {
            phase = LearningPhase.PRACTICE;
        } else if (repetitions >= 1) {
            phase = LearningPhase.IMAGINE;
        }
    }

    /**
     * Check if this character is due for review.
     */
    public boolean isDue() {
        if (nextReview == null) return true;
        return LocalDateTime.now().isAfter(nextReview) || 
               LocalDateTime.now().isEqual(nextReview);
    }

    /**
     * Get days until next review (negative if overdue).
     */
    public long getDaysUntilReview() {
        if (nextReview == null) return 0;
        return ChronoUnit.DAYS.between(LocalDateTime.now(), nextReview);
    }

    /**
     * Calculate retention probability (rough estimate).
     */
    public double getRetentionProbability() {
        if (lastReview == null) return 0.0;
        long daysSinceReview = ChronoUnit.DAYS.between(lastReview, LocalDateTime.now());
        // Exponential forgetting curve: R = e^(-t/S) where S is stability
        double stability = interval * easeFactor;
        return Math.exp(-daysSinceReview / stability);
    }

    // Getters
    public String getCharacterId() { return characterId; }
    public String getCharacter() { return character; }
    public LearningPhase getPhase() { return phase; }
    public double getEaseFactor() { return easeFactor; }
    public int getInterval() { return interval; }
    public int getRepetitions() { return repetitions; }
    public LocalDateTime getLastReview() { return lastReview; }
    public LocalDateTime getNextReview() { return nextReview; }
    public List<ReviewRecord> getReviewHistory() { return reviewHistory; }
}

/**
 * 复习记录 (Fùxí jìlù) - Review Record
 * 
 * Individual review session record for analytics and progress tracking.
 */
class ReviewRecord {
    private LocalDateTime dateTime;
    private int quality;
    private int intervalAtTime;

    public ReviewRecord(LocalDateTime dateTime, int quality, int intervalAtTime) {
        this.dateTime = dateTime;
        this.quality = quality;
        this.intervalAtTime = intervalAtTime;
    }

    public LocalDateTime getDateTime() { return dateTime; }
    public int getQuality() { return quality; }
    public int getIntervalAtTime() { return intervalAtTime; }
}

// ============================================================================
// RICCI CHARACTER ANALYZER
// ============================================================================

/**
 * 利瑪竇字符分析器 (Lì Mǎdòu zìfú fēnxīqì)
 * Ricci Character Analyzer
 * 
 * Implements Matteo Ricci's method of character decomposition.
 * 
 * From "The Memory Palace of Matteo Ricci":
 * "If one could learn quite swiftly to subdivide each ideograph into 
 * component parts, each of which also had a separate meaning, then it 
 * would be easy for someone well trained in mnemonic art to make each 
 * ideograph into a memory image."
 */
class RicciCharacterAnalyzer {

    // Semantic component meanings for decomposition
    private static final Map<String, String[]> SEMANTIC_COMPONENTS = new HashMap<>();
    static {
        SEMANTIC_COMPONENTS.put("心", new String[]{"heart/mind", "emotions, thoughts, psychology"});
        SEMANTIC_COMPONENTS.put("忄", new String[]{"heart radical", "feelings, character traits"});
        SEMANTIC_COMPONENTS.put("水", new String[]{"water", "liquids, flow, cleansing"});
        SEMANTIC_COMPONENTS.put("氵", new String[]{"water radical", "water-related"});
        SEMANTIC_COMPONENTS.put("火", new String[]{"fire", "heat, passion, transformation"});
        SEMANTIC_COMPONENTS.put("灬", new String[]{"fire radical", "cooking, heat"});
        SEMANTIC_COMPONENTS.put("木", new String[]{"wood/tree", "plants, nature, growth"});
        SEMANTIC_COMPONENTS.put("金", new String[]{"metal/gold", "metals, weapons, precious"});
        SEMANTIC_COMPONENTS.put("土", new String[]{"earth", "ground, territory, stability"});
        SEMANTIC_COMPONENTS.put("日", new String[]{"sun", "time, brightness, day"});
        SEMANTIC_COMPONENTS.put("月", new String[]{"moon", "night, months, body parts"});
        SEMANTIC_COMPONENTS.put("口", new String[]{"mouth", "speech, eating, openings"});
        SEMANTIC_COMPONENTS.put("手", new String[]{"hand", "actions, holding"});
        SEMANTIC_COMPONENTS.put("扌", new String[]{"hand radical", "manual actions"});
        SEMANTIC_COMPONENTS.put("目", new String[]{"eye", "vision, watching"});
        SEMANTIC_COMPONENTS.put("言", new String[]{"speech", "language, expression"});
        SEMANTIC_COMPONENTS.put("讠", new String[]{"speech radical", "communication"});
        SEMANTIC_COMPONENTS.put("人", new String[]{"person", "people, humanity"});
        SEMANTIC_COMPONENTS.put("亻", new String[]{"person radical", "human-related"});
    }

    // Journey to the West imagery mapping
    private static final Map<String, String> JOURNEY_IMAGERY = new HashMap<>();
    static {
        JOURNEY_IMAGERY.put("heart/mind", "Sun Wukong's wild heart being tamed");
        JOURNEY_IMAGERY.put("water", "The flowing waters of the Flowing Sand River");
        JOURNEY_IMAGERY.put("fire", "Flames from Laozi's Eight Trigrams Furnace");
        JOURNEY_IMAGERY.put("wood/tree", "The immortal peach trees of Heaven");
        JOURNEY_IMAGERY.put("metal/gold", "Wukong's golden-banded staff Ruyi Jingu Bang");
        JOURNEY_IMAGERY.put("earth", "The Five Elements Mountain pressing down");
        JOURNEY_IMAGERY.put("sun", "The Buddha's radiant palm descending");
        JOURNEY_IMAGERY.put("moon", "Night journey through demon territory");
        JOURNEY_IMAGERY.put("mouth", "Zhu Bajie's endless appetite");
        JOURNEY_IMAGERY.put("person", "Tang Sanzang in meditation");
    }

    /**
     * Analyze a character and provide decomposition data.
     * 
     * @param character The Chinese character to analyze
     * @return Analysis result with components and suggested imagery
     */
    public CharacterAnalysis analyze(String character) {
        CharacterAnalysis analysis = new CharacterAnalysis(character);

        // Find semantic components
        for (Map.Entry<String, String[]> entry : SEMANTIC_COMPONENTS.entrySet()) {
            if (character.contains(entry.getKey())) {
                analysis.addComponent(new SemanticComponent(
                    entry.getKey(),
                    entry.getValue()[0],
                    entry.getValue()[1]
                ));
            }
        }

        // Generate suggested imagery
        analysis.setSuggestedImagery(generateImagery(analysis.getComponents()));

        // Suggest pilgrim guide based on components
        analysis.setSuggestedPilgrim(suggestPilgrim(analysis.getComponents()));

        return analysis;
    }

    /**
     * Generate Journey to the West imagery suggestion.
     */
    private String generateImagery(List<SemanticComponent> components) {
        List<String> suggestions = new ArrayList<>();
        
        for (SemanticComponent comp : components) {
            String imagery = JOURNEY_IMAGERY.get(comp.getMeaning());
            if (imagery != null) {
                suggestions.add(imagery);
            }
        }

        if (suggestions.isEmpty()) {
            return "Create a vivid scene combining the character's elements";
        }
        return "Combine: " + String.join(" with ", suggestions);
    }

    /**
     * Suggest appropriate pilgrim guide based on character components.
     */
    private Pilgrim suggestPilgrim(List<SemanticComponent> components) {
        for (SemanticComponent comp : components) {
            String meaning = comp.getMeaning();
            if (meaning.contains("heart") || meaning.contains("mind") || meaning.contains("fire")) {
                return Pilgrim.SUN_WUKONG;
            }
            if (meaning.contains("water")) {
                return Pilgrim.SHA_WUJING;
            }
            if (meaning.contains("mouth") || meaning.contains("eating")) {
                return Pilgrim.ZHU_BAJIE;
            }
            if (meaning.contains("earth") || meaning.contains("person")) {
                return Pilgrim.TANG_SANZANG;
            }
        }
        return Pilgrim.SUN_WUKONG; // Default to Mind Monkey
    }

    /**
     * Create a complete memory image for a character.
     */
    public MemoryImage createMemoryImage(ChineseCharacter character, MemoryStation station) {
        CharacterAnalysis analysis = analyze(character.getCharacter());

        return new MemoryImage.Builder()
            .scene(analysis.getSuggestedImagery())
            .action(String.format("At %s, visualize this character coming alive", 
                    station.getNameEnglish()))
            .emotion("Let the scene evoke wonder and discovery")
            .mnemonicPhrase(String.format("'%s' (%s)", 
                    character.getPinyin(), character.getMeaning()))
            .pilgrimGuide(analysis.getSuggestedPilgrim())
            .locationInPalace(station.getBilingualName())
            .build();
    }
}

/**
 * 字符分析结果 (Zìfú fēnxī jiéguǒ) - Character Analysis Result
 */
class CharacterAnalysis {
    private String character;
    private List<SemanticComponent> components;
    private String suggestedImagery;
    private Pilgrim suggestedPilgrim;

    public CharacterAnalysis(String character) {
        this.character = character;
        this.components = new ArrayList<>();
    }

    public String getCharacter() { return character; }
    public List<SemanticComponent> getComponents() { return components; }
    public void addComponent(SemanticComponent component) { components.add(component); }
    public String getSuggestedImagery() { return suggestedImagery; }
    public void setSuggestedImagery(String imagery) { this.suggestedImagery = imagery; }
    public Pilgrim getSuggestedPilgrim() { return suggestedPilgrim; }
    public void setSuggestedPilgrim(Pilgrim pilgrim) { this.suggestedPilgrim = pilgrim; }
}

/**
 * 语义部件 (Yǔyì bùjiàn) - Semantic Component
 */
class SemanticComponent {
    private String component;
    private String meaning;
    private String extendedMeaning;

    public SemanticComponent(String component, String meaning, String extendedMeaning) {
        this.component = component;
        this.meaning = meaning;
        this.extendedMeaning = extendedMeaning;
    }

    public String getComponent() { return component; }
    public String getMeaning() { return meaning; }
    public String getExtendedMeaning() { return extendedMeaning; }
}

// ============================================================================
// MAIN SERVICE CLASS
// ============================================================================

/**
 * 记忆宫殿服务 (Jìyì gōngdiàn fúwù) - Memory Palace Service
 * 
 * Main service class orchestrating all components of the memory palace system.
 */
public class MemoryPalaceService {
    
    private List<MemoryPalace> palaces;
    private RicciCharacterAnalyzer analyzer;
    private Map<String, LearningProgress> progressMap;

    public MemoryPalaceService() {
        this.palaces = new ArrayList<>();
        this.analyzer = new RicciCharacterAnalyzer();
        this.progressMap = new HashMap<>();
        initializeSampleData();
    }

    /**
     * Initialize with sample Memory Palace data.
     */
    private void initializeSampleData() {
        // Create Flower-Fruit Mountain palace
        MemoryPalace huaguoshan = new MemoryPalace();
        huaguoshan.setId("huaguoshan");
        huaguoshan.setNameChinese("花果山");
        huaguoshan.setNamePinyin("Huāguǒshān");
        huaguoshan.setNameIpa("/xwa.kwo.ʂan/");
        huaguoshan.setNameEnglish("Flower-Fruit Mountain");
        huaguoshan.setDescription("Sun Wukong's birthplace - Home of basic strokes and foundational radicals");
        huaguoshan.setLatitude(34.738);
        huaguoshan.setLongitude(119.463);
        huaguoshan.setRealLocation("Lianyungang, Jiangsu Province");

        // Create Water-Curtain Cave station
        MemoryStation waterCurtainCave = new MemoryStation(
            "water_curtain_cave",
            "水帘洞",
            "Shuǐlián dòng",
            "/ʂweɪ.ljan tʊŋ/",
            "Water-Curtain Cave"
        );
        waterCurtainCave.setTheme("water_radicals");
        waterCurtainCave.setPilgrimGuide(Pilgrim.SUN_WUKONG);

        // Add sample characters
        ChineseCharacter shui = new ChineseCharacter.Builder()
            .character("水")
            .pinyin("shuǐ")
            .ipa("/ʂweɪ/")
            .tone(3)
            .meaning("water")
            .radicalNumber(85)
            .strokeCount(4)
            .memoryImage(new MemoryImage.Builder()
                .scene("Crystal-clear water cascading through the cave entrance")
                .action("Sun Wukong leaps through the curtain, droplets spraying")
                .emotion("exhilaration, discovery")
                .mnemonicPhrase("'Shway' sounds like water spray!")
                .pilgrimGuide(Pilgrim.SUN_WUKONG)
                .locationInPalace("Water-Curtain Cave entrance")
                .build())
            .addDialect(Dialect.MANDARIN, new PronunciationInfo("shuǐ", "/ʂweɪ˨˩˦/", 3, "shui3.mp3"))
            .addDialect(Dialect.CANTONESE, new PronunciationInfo("seoi2", "/sɵy˧˥/", 2, "seoi2.mp3"))
            .addExample(new UsageExample(
                "水帘洞是孙悟空的家。",
                "Shuǐlián dòng shì Sūn Wùkōng de jiā.",
                "The Water-Curtain Cave is Sun Wukong's home.",
                "Journey to the West, Chapter 1"
            ))
            .build();

        waterCurtainCave.addCharacter(shui);
        huaguoshan.addStation(waterCurtainCave);
        palaces.add(huaguoshan);
    }

    /**
     * Get characters due for review.
     */
    public List<ChineseCharacter> getDueCharacters(int limit) {
        List<ChineseCharacter> dueCharacters = new ArrayList<>();
        
        for (MemoryPalace palace : palaces) {
            for (MemoryStation station : palace.getStations()) {
                for (ChineseCharacter character : station.getCharacters()) {
                    String id = character.getUniqueId();
                    LearningProgress progress = progressMap.get(id);
                    
                    if (progress == null || progress.isDue()) {
                        dueCharacters.add(character);
                        if (dueCharacters.size() >= limit) {
                            return dueCharacters;
                        }
                    }
                }
            }
        }
        
        return dueCharacters;
    }

    /**
     * Record a review and update progress.
     */
    public LearningProgress recordReview(ChineseCharacter character, int quality) {
        String id = character.getUniqueId();
        
        LearningProgress progress = progressMap.get(id);
        if (progress == null) {
            progress = new LearningProgress(id, character.getCharacter());
            progressMap.put(id, progress);
        }
        
        progress.updateAfterReview(quality);
        return progress;
    }

    /**
     * Get learning statistics.
     */
    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        int totalCharacters = 0;
        int mastered = 0;
        int dueToday = 0;
        
        for (MemoryPalace palace : palaces) {
            for (MemoryStation station : palace.getStations()) {
                totalCharacters += station.getCharacterCount();
            }
        }
        
        for (LearningProgress progress : progressMap.values()) {
            if (progress.getPhase() == LearningPhase.MASTER) {
                mastered++;
            }
            if (progress.isDue()) {
                dueToday++;
            }
        }
        
        stats.put("total_characters", totalCharacters);
        stats.put("learned", progressMap.size());
        stats.put("mastered", mastered);
        stats.put("due_today", dueToday);
        
        return stats;
    }

    /**
     * Get all memory palaces.
     */
    public List<MemoryPalace> getPalaces() {
        return palaces;
    }

    /**
     * Get analyzer instance.
     */
    public RicciCharacterAnalyzer getAnalyzer() {
        return analyzer;
    }

    // Main method for testing
    public static void main(String[] args) {
        System.out.println("西遊記記憶宮殿 | Journey to the West Memory Palace");
        System.out.println("================================================");
        System.out.println();
        
        MemoryPalaceService service = new MemoryPalaceService();
        
        // Display palaces
        for (MemoryPalace palace : service.getPalaces()) {
            System.out.println("🏯 " + palace.getNameChinese() + " (" + palace.getNamePinyin() + ")");
            System.out.println("   " + palace.getNameEnglish());
            System.out.println("   Location: " + palace.getRealLocation());
            System.out.println("   Coordinates: " + palace.getLatitude() + ", " + palace.getLongitude());
            System.out.println();
            
            for (MemoryStation station : palace.getStations()) {
                System.out.println("   📍 " + station.getBilingualName());
                System.out.println("      Theme: " + station.getTheme());
                System.out.println("      Guide: " + station.getPilgrimGuide().getChinese());
                System.out.println();
                
                for (ChineseCharacter character : station.getCharacters()) {
                    System.out.println("      字 " + character.getDisplayString());
                    System.out.println("         Radical #" + character.getRadicalNumber() + 
                                     ", " + character.getStrokeCount() + " strokes");
                    if (character.getMemoryImage() != null) {
                        System.out.println("         Scene: " + character.getMemoryImage().getScene());
                        System.out.println("         Mnemonic: " + character.getMemoryImage().getMnemonicPhrase());
                    }
                    System.out.println();
                }
            }
        }
        
        // Test statistics
        System.out.println("📊 Statistics:");
        Map<String, Object> stats = service.getStatistics();
        for (Map.Entry<String, Object> entry : stats.entrySet()) {
            System.out.println("   " + entry.getKey() + ": " + entry.getValue());
        }
    }
}

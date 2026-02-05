# 西遊記記憶宮殿 | Journey to the West Memory Palace
## Xī Yóu Jì Jì Yì Gōng Diàn | /ɕi joʊ tɕi tɕi ji kʊŋ tjen/

> *"For in truth this Memory Place System seems as if it had been invented for Chinese letters, for which it has particular effectiveness and use, in that each letter is a figure that means a thing."*
> — Matteo Ricci (利瑪竇 Lì Mǎdòu), 1595

---

## 🎯 Project Vision

A bilingual (English/Chinese) memory palace application that synthesizes:
- **Matteo Ricci's mnemonic techniques** for Chinese character learning
- **Journey to the West's vivid imagery** as memory architecture  
- **ArcGIS StoryMaps** for geographical anchoring
- **Giordano Bruno's shadow/seal system** for abstract concept encoding

---

## 📂 Repository Structure

This repository contains three implementations of the Memory Palace system:

- **`/React`** - React Native mobile application (complete, ready to run)
- **`/Java`** - Java backend service implementation
- **`/Python`** - Python-based implementation with data processing

Each folder contains its own README with specific setup instructions. See the [Directory Structure](#directory-structure) section below for details.

---

## 📚 Theoretical Foundation

### The Four Pillars (四柱 Sì Zhù)

| Pillar | Chinese | Pinyin | IPA | Source |
|--------|---------|--------|-----|--------|
| Visual Decomposition | 拆字法 | Chāizìfǎ | /tʂʰaɪ.tsz̩.fa/ | Ricci's ideograph analysis |
| Emotional Vividity | 情感鲜明 | Qínggǎn xiānmíng | /tɕʰiŋ.kɑn ɕjen.miŋ/ | Bruno's "striking images" |
| Spatial Architecture | 空间建构 | Kōngjiān jiàngòu | /kʰʊŋ.tɕjen tɕjɑŋ.koʊ/ | Memory Palace method |
| Narrative Journey | 叙事旅程 | Xùshì lǚchéng | /ɕy.ʂʐ̩ ly.tʂʰəŋ/ | Journey to the West pilgrimage |

### Regional Dialect Support (方言支持 Fāngyán Zhīchí)

The application respects China's linguistic diversity:

```
┌─────────────────────────────────────────────────────────────┐
│  Standard Mandarin (普通话 Pǔtōnghuà) - Default            │
├─────────────────────────────────────────────────────────────┤
│  Cantonese (粤语 Yuèyǔ) - 9 tones, Hong Kong/Guangzhou     │
│  Min Nan (闽南语 Mǐnnányǔ) - Fujian/Taiwan                 │
│  Shanghainese (上海话 Shànghǎihuà) - Wu dialect family     │
│  Sichuanese (四川话 Sìchuānhuà) - Southwestern Mandarin    │
└─────────────────────────────────────────────────────────────┘
```

### Philosophical Framework

**Marxist Dialectical Materialism Applied:**

1. **Unity of Opposites (对立统一 Duìlì tǒngyī)**
   - Characters emerge from contrasting elements
   - 明 (míng "bright") = 日 (sun) + 月 (moon)

2. **Quantitative → Qualitative Change (量变质变 Liàngbiàn zhìbiàn)**
   - Accumulating radicals transforms into character mastery
   - 214 radicals → 50,000+ characters

3. **Practice as Truth Criterion (实践是检验真理的唯一标准)**
   - Memory tested through spaced repetition and real usage

---

## 🏯 Memory Palace Architecture

### The 81 Tribulations as Learning Stations

Journey to the West's 81 trials (八十一难 Bāshíyī nàn) provide the structural framework:

```
LEVEL 1: Flower-Fruit Mountain (花果山)
├── Station 1: Water-Curtain Cave - Basic Strokes (基本笔画)
├── Station 2: Heavenly Peach Garden - Numbers (数字)
└── Station 3: Dragon Palace - Water Radicals (水部首)

LEVEL 2: Heaven's Court (天庭)
├── Station 4: Jade Emperor's Hall - Heaven/Earth Characters
├── Station 5: Laozi's Furnace - Fire & Metal Radicals
└── Station 6: Buddha's Palm - Buddhist Terminology

LEVEL 3-9: The Westward Journey (西行)
├── Silk Road Landmarks with ArcGIS Integration
├── Kingdom-specific vocabulary sets
└── Boss encounters = Character compound mastery tests
```

### The Five Pilgrims as Cognitive Functions

| Pilgrim | 中文 | Function | Memory Type |
|---------|------|----------|-------------|
| Tang Sanzang | 唐三藏 | Executive control | Declarative memory |
| Sun Wukong | 孙悟空 | Active cognition (心猿 Mind Monkey) | Working memory |
| Zhu Bajie | 猪八戒 | Emotional encoding | Emotional memory |
| Sha Wujing | 沙悟净 | Stability/persistence | Procedural memory |
| Bailong Ma | 白龙马 | Motivation/will | Motivation system |

---

## 🗺️ ArcGIS StoryMaps Integration

### Real-World Geographical Memory Anchors

| Location | Chinese | Coordinates | Memory Theme |
|----------|---------|-------------|--------------|
| Xi'an 西安 | 长安 Cháng'ān | 34.34°N, 108.94°E | Journey beginning - Basic radicals |
| Dunhuang 敦煌 | 莫高窟 | 40.14°N, 94.66°E | Buddhist cave art - Religious terms |
| Flaming Mountain | 火焰山 Huǒyàn shān | 42.95°N, 89.19°E | Fire characters |
| India 印度 | 灵鹫山 Língjiùshān | 25.00°N, 85.52°E | Complete mastery |

### StoryMap Layer Structure

```javascript
const memoryPalaceLayers = {
  basemap: "topographic",
  layers: [
    { id: "silk-road-route", type: "polyline", source: "historical_route.geojson" },
    { id: "memory-stations", type: "point", source: "stations.geojson" },
    { id: "character-density", type: "heatmap", source: "learned_characters.geojson" },
    { id: "demon-encounters", type: "polygon", source: "boss_areas.geojson" }
  ]
};
```

---

## 💻 Technical Architecture

### Technology Stack

| Layer | React Native (Prototype) | Java (Android) | Python (Backend) |
|-------|-------------------------|----------------|------------------|
| UI | React Native + Expo | Jetpack Compose | Flask API |
| State | Redux Toolkit | ViewModel/LiveData | SQLAlchemy |
| Maps | react-native-maps | ArcGIS SDK | ArcGIS Python API |
| Audio | expo-av | ExoPlayer | pydub |
| Data | AsyncStorage | Room DB | PostgreSQL |

### Directory Structure

```
Journey-To-The-West-Memory-Palace/
├── React/                   # React Native mobile app
│   ├── src/
│   │   ├── screens/         # App screens (Memory Palace, Learning, Map, etc.)
│   │   └── data/            # Character database (characters.json)
│   ├── assets/              # Images, fonts, audio
│   ├── App.js               # Main app entry point
│   ├── package.json         # Dependencies
│   └── README_SETUP.md      # React Native setup instructions
├── Java/                    # Java backend implementation
│   ├── MemoryPalaceService.java
│   └── README.md            # Java setup instructions
├── Python/                  # Python backend & data processing
│   ├── memory_palace.py     # Core Python implementation
│   ├── requirements.txt     # Python dependencies
│   └── README.md            # Python setup instructions
├── README.md                # This file - Project overview
├── STRATEGY_SYNTHESIS.md    # Detailed strategy document
└── The Memory Palace of Matteo Ricci... .epub  # Reference material
```

---

## 🎨 Design Philosophy

### Visual Language

Inspired by:
- Traditional Chinese painting (山水画 shānshuǐhuà - landscape painting)
- Ming Dynasty book illustrations
- Buddhist temple architecture
- ArcGIS cartographic aesthetics

### Color Palette

| Color | Hex | Chinese Name | Symbolism |
|-------|-----|--------------|-----------|
| Imperial Yellow | #FFDF00 | 明黄 Míng huáng | Enlightenment, mastery |
| Celestial Blue | #1E90FF | 天蓝 Tiān lán | Heaven, wisdom |
| Demon Red | #DC143C | 丹红 Dān hóng | Trials, passion |
| Jade Green | #00A86B | 翡翠绿 Fěicuì lǜ | Growth, nature |
| Ink Black | #1C1C1C | 墨黑 Mò hēi | Calligraphy, foundation |

---

## 📖 Character Learning Example

### Station: Water-Curtain Cave (水帘洞 Shuǐlián dòng)

**Target Character:** 悟 (wù) - "enlightenment, awareness"

**Decomposition:**
```
悟 = 忄(心 heart) + 吾 (self)
    "When heart meets self, enlightenment arises"
```

**Memory Image:**
> Sun Wukong sits in meditation beneath the waterfall. The word 吾 (wú, "I/self") 
> floats above his head. A glowing heart (忄) pulses in his chest. 
> As they merge, golden light bursts forth - he has achieved 悟 (wù, awakening)!

**Pronunciation Guide:**
- Mandarin: wù /wu˥˩/ (4th tone, falling)
- Cantonese: ng6 /ŋ˨/ (low falling)
- Min Nan: gō͘ /ɡɔ˧˧/

**Usage in Text:**
> 悟空悟道 (Wùkōng wù dào)
> "Wukong awakens to the Way"

---

## 🚀 Getting Started

Choose your implementation:

### React Native Mobile App (Recommended)

```bash
# Navigate to React folder
cd React/

# Install dependencies
npm install

# Start development server
npm start

# Follow instructions in React/README_SETUP.md
```

### Python Implementation

```bash
# Navigate to Python folder
cd Python/

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the application
python memory_palace.py
```

### Java Backend

```bash
# Navigate to Java folder
cd Java/

# Compile and run
javac MemoryPalaceService.java

# See Java/README.md for details
```

---

## 📜 License

MIT License - 开源许可 (Kāiyuán xǔkě)

## 🙏 Acknowledgments

- Jonathan D. Spence - *The Memory Palace of Matteo Ricci*
- Anthony C. Yu - *Journey to the West* translation
- Giordano Bruno - *De Umbris Idearum*
- Frances Yates - *The Art of Memory*

---

*"Those who will live one hundred generations after us are not yet born, and I cannot tell what sort of people they will be. Yet thanks to the existence of written culture even those living ten thousand generations hence will be able to enter into my mind as if we were contemporaries."*

— 利瑪竇 Matteo Ricci, 1606

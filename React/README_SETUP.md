# Journey to the West Memory Palace - React Native Setup

## 🏯 西遊記記憶宮殿

A bilingual memory palace application for learning Chinese characters using Matteo Ricci's mnemonic techniques and Journey to the West imagery.

## 📱 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- Expo CLI (optional, will be installed automatically)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start the development server:**
```bash
npm start
```

3. **Run on your device:**
   - For iOS: Press `i` in the terminal (requires Mac with Xcode)
   - For Android: Press `a` in the terminal (requires Android Studio)
   - For Web: Press `w` in the terminal
   - Scan QR code with Expo Go app on your phone

## 📁 Project Structure

```
Journey-To-The-West-Memory-Palace/
├── App.js                    # Main app entry point
├── app.json                  # Expo configuration
├── package.json              # Dependencies and scripts
├── src/
│   ├── screens/
│   │   ├── CharacterLearningScreen.js  # Character learning interface
│   │   ├── MemoryPalaceScreen.js       # Palace navigation
│   │   ├── PilgrimGuideScreen.js       # Pilgrim information
│   │   ├── MapScreen.js                # Journey map
│   │   └── SettingsScreen.js           # App settings
│   └── data/
│       └── characters.json             # Character database
└── assets/                   # Images and icons (to be added)
```

## 🎨 Features

- **Memory Palace Navigation**: Explore locations from Journey to the West
- **Character Learning**: Interactive character decomposition and mnemonic imagery
- **Multi-dialect Support**: Mandarin, Cantonese, Min Nan, Shanghainese
- **Progress Tracking**: Track your learning journey
- **Bilingual Interface**: Chinese and English throughout

## 🔧 Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser

### Adding Assets

Place the following files in the `assets/` folder:
- `icon.png` - App icon (1024x1024)
- `splash.png` - Splash screen
- `adaptive-icon.png` - Android adaptive icon
- `favicon.png` - Web favicon

## 📚 Learning Method

Based on:
- **Matteo Ricci's Mnemonic Techniques** (利瑪竇方法)
- **Giordano Bruno's Memory Palace** (布鲁诺记忆宫殿法)
- **Journey to the West** (西遊記) narrative imagery

## 🌏 Dialect Support

- 普通话 (Pǔtōnghuà) - Standard Mandarin
- 粤语 (Yuèyǔ) - Cantonese
- 闽南语 (Mǐnnányǔ) - Min Nan / Hokkien
- 上海话 (Shànghǎihuà) - Shanghainese

## 📖 References

- "The Memory Palace of Matteo Ricci" by Jonathan D. Spence
- "Journey to the West" (西遊記) by Wu Cheng'en

## 📄 License

MIT License

---

Made with ❤️ by the Memory Palace Development Team

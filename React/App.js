/**
 * 西遊記記憶宮殿 (Xī Yóu Jì Jì Yì Gōng Diàn)
 * Journey to the West Memory Palace
 * 
 * A bilingual memory palace application for learning Chinese characters
 * using Matteo Ricci's mnemonic techniques and Journey to the West imagery.
 * 
 * @author Memory Palace Development Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';

// Import screens
import MemoryPalaceScreen from './src/screens/MemoryPalaceScreen';
import CharacterLearningScreen from './src/screens/CharacterLearningScreen';
import PilgrimGuideScreen from './src/screens/PilgrimGuideScreen';
import MapScreen from './src/screens/MapScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Import data
import characterData from './src/data/characters.json';

// Constants
const { width, height } = Dimensions.get('window');

// Theme configuration
const THEME = {
  colors: {
    imperialYellow: '#FFDF00',    // 明黄 Míng huáng - Enlightenment
    celestialBlue: '#1E90FF',     // 天蓝 Tiān lán - Heaven
    demonRed: '#DC143C',          // 丹红 Dān hóng - Trials
    jadeGreen: '#00A86B',         // 翡翠绿 Fěicuì lǜ - Growth
    inkBlack: '#1C1C1C',          // 墨黑 Mò hēi - Calligraphy
    cloudWhite: '#F8F8FF',        // 云白 Yún bái - Purity
    lotusePink: '#FFB7C5',        // 莲粉 Lián fěn - Beauty
    mountainGray: '#708090',      // 山灰 Shān huī - Stability
  },
  fonts: {
    chinese: 'NotoSerifSC',       // For Chinese characters
    pinyin: 'NotoSans',           // For pinyin romanization
    english: 'Georgia',           // For English text
    display: 'MaShanZheng',       // For decorative headers
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  }
};

// Dialect configuration
const DIALECTS = {
  mandarin: {
    id: 'mandarin',
    chinese: '普通话',
    pinyin: 'Pǔtōnghuà',
    english: 'Standard Mandarin',
    tones: 4,
    default: true,
  },
  cantonese: {
    id: 'cantonese',
    chinese: '粤语',
    pinyin: 'Yuèyǔ',
    english: 'Cantonese',
    tones: 9,
    romanization: 'jyutping',
  },
  minnan: {
    id: 'minnan',
    chinese: '闽南语',
    pinyin: 'Mǐnnányǔ',
    english: 'Min Nan / Hokkien',
    tones: 7,
    romanization: 'poj',
  },
  shanghainese: {
    id: 'shanghainese',
    chinese: '上海话',
    pinyin: 'Shànghǎihuà',
    english: 'Shanghainese',
    tones: 5,
    romanization: 'ipa',
  }
};

/**
 * Main Application Component
 * 
 * Manages navigation between screens and global state including:
 * - Selected dialect for pronunciation
 * - Current memory palace location
 * - Learning progress
 * - User preferences
 */
const App = () => {
  // State management
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedDialect, setSelectedDialect] = useState(DIALECTS.mandarin);
  const [currentPalace, setCurrentPalace] = useState(null);
  const [currentStation, setCurrentStation] = useState(null);
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [learningProgress, setLearningProgress] = useState({});
  const [fadeAnim] = useState(new Animated.Value(1));
  
  // Animation for screen transitions
  const fadeTransition = (callback) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(callback, 200);
  };

  // Navigation handler
  const navigate = (screen, params = {}) => {
    fadeTransition(() => {
      setCurrentScreen(screen);
      if (params.palace) setCurrentPalace(params.palace);
      if (params.station) setCurrentStation(params.station);
      if (params.character) setCurrentCharacter(params.character);
    });
  };

  // Home Screen Component
  const HomeScreen = () => (
    <View style={styles.homeContainer}>
      {/* Title Header */}
      <View style={styles.titleContainer}>
        <Text style={styles.chineseTitle}>西遊記記憶宮殿</Text>
        <Text style={styles.pinyinTitle}>Xī Yóu Jì Jì Yì Gōng Diàn</Text>
        <Text style={styles.englishTitle}>Journey to the West Memory Palace</Text>
      </View>

      {/* Decorative divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>☯</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Welcome message in bilingual format */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeQuote}>
          "若要记千言，先建宫殿一座"
        </Text>
        <Text style={styles.welcomePinyin}>
          "Ruò yào jì qiān yán, xiān jiàn gōngdiàn yī zuò"
        </Text>
        <Text style={styles.welcomeEnglish}>
          "To remember a thousand words, first build a palace"
        </Text>
        <Text style={styles.welcomeAttribution}>— 利瑪竇 (Matteo Ricci)</Text>
      </View>

      {/* Main navigation buttons */}
      <View style={styles.navContainer}>
        <NavigationButton
          title="进入宫殿"
          subtitle="Enter the Palace"
          icon="🏯"
          color={THEME.colors.imperialYellow}
          onPress={() => navigate('palace')}
        />
        
        <NavigationButton
          title="学习汉字"
          subtitle="Learn Characters"
          icon="📚"
          color={THEME.colors.jadeGreen}
          onPress={() => navigate('learning')}
        />
        
        <NavigationButton
          title="西行地图"
          subtitle="Journey Map"
          icon="🗺️"
          color={THEME.colors.celestialBlue}
          onPress={() => navigate('map')}
        />
        
        <NavigationButton
          title="取经团队"
          subtitle="Pilgrimage Team"
          icon="🐵"
          color={THEME.colors.demonRed}
          onPress={() => navigate('pilgrims')}
        />
      </View>

      {/* Dialect selector */}
      <View style={styles.dialectContainer}>
        <Text style={styles.dialectLabel}>
          发音方言 | Dialect: 
        </Text>
        <TouchableOpacity
          style={styles.dialectSelector}
          onPress={() => navigate('settings')}
        >
          <Text style={styles.dialectText}>
            {selectedDialect.chinese} ({selectedDialect.english})
          </Text>
          <Text style={styles.dialectArrow}>▼</Text>
        </TouchableOpacity>
      </View>

      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>学习进度 | Progress</Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${Object.keys(learningProgress).length / 214 * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {Object.keys(learningProgress).length} / 214 部首 (radicals)
        </Text>
      </View>
    </View>
  );

  /**
   * Navigation Button Component
   * Styled button for main navigation with bilingual labels
   */
  const NavigationButton = ({ title, subtitle, icon, color, onPress }) => (
    <TouchableOpacity
      style={[styles.navButton, { borderLeftColor: color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.navIcon}>{icon}</Text>
      <View style={styles.navTextContainer}>
        <Text style={styles.navTitle}>{title}</Text>
        <Text style={styles.navSubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.navArrow}>→</Text>
    </TouchableOpacity>
  );

  // Screen router
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'palace':
        return (
          <MemoryPalaceScreen
            palaces={characterData.palaces}
            currentPalace={currentPalace}
            onSelectPalace={(palace) => navigate('palace', { palace })}
            onSelectStation={(station) => navigate('learning', { station })}
            onBack={() => navigate('home')}
            theme={THEME}
          />
        );
      case 'learning':
        return (
          <CharacterLearningScreen
            station={currentStation}
            character={currentCharacter}
            dialect={selectedDialect}
            pilgrims={characterData.pilgrims}
            onSelectCharacter={(char) => setCurrentCharacter(char)}
            onProgress={(charId) => {
              setLearningProgress(prev => ({ ...prev, [charId]: true }));
            }}
            onBack={() => navigate('palace')}
            theme={THEME}
          />
        );
      case 'map':
        return (
          <MapScreen
            palaces={characterData.palaces}
            progress={learningProgress}
            onSelectLocation={(palace) => navigate('palace', { palace })}
            onBack={() => navigate('home')}
            theme={THEME}
          />
        );
      case 'pilgrims':
        return (
          <PilgrimGuideScreen
            pilgrims={characterData.pilgrims}
            dialect={selectedDialect}
            onBack={() => navigate('home')}
            theme={THEME}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            dialects={DIALECTS}
            selectedDialect={selectedDialect}
            onSelectDialect={setSelectedDialect}
            onBack={() => navigate('home')}
            theme={THEME}
          />
        );
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.inkBlack} />
      <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
        {renderScreen()}
      </Animated.View>
    </SafeAreaView>
  );
};

/**
 * Styles following the design philosophy:
 * - Traditional Chinese painting aesthetics (山水画 shānshuǐhuà)
 * - Ming Dynasty book illustrations
 * - Buddhist temple architecture
 * - Modern bilingual UI considerations
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.inkBlack,
  },
  screenContainer: {
    flex: 1,
  },
  homeContainer: {
    flex: 1,
    padding: THEME.spacing.lg,
    backgroundColor: THEME.colors.inkBlack,
  },
  
  // Title styles
  titleContainer: {
    alignItems: 'center',
    marginTop: THEME.spacing.xl,
    marginBottom: THEME.spacing.lg,
  },
  chineseTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: THEME.colors.imperialYellow,
    textShadowColor: THEME.colors.demonRed,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 4,
  },
  pinyinTitle: {
    fontSize: 14,
    color: THEME.colors.cloudWhite,
    marginTop: THEME.spacing.xs,
    fontStyle: 'italic',
  },
  englishTitle: {
    fontSize: 18,
    color: THEME.colors.celestialBlue,
    marginTop: THEME.spacing.sm,
    fontWeight: '600',
  },
  
  // Divider styles
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: THEME.spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: THEME.colors.mountainGray,
  },
  dividerText: {
    marginHorizontal: THEME.spacing.md,
    fontSize: 24,
    color: THEME.colors.imperialYellow,
  },
  
  // Welcome message styles
  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: THEME.spacing.lg,
    paddingHorizontal: THEME.spacing.md,
    backgroundColor: 'rgba(255, 223, 0, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.colors.imperialYellow + '40',
    marginBottom: THEME.spacing.lg,
  },
  welcomeQuote: {
    fontSize: 20,
    color: THEME.colors.cloudWhite,
    textAlign: 'center',
    lineHeight: 28,
  },
  welcomePinyin: {
    fontSize: 12,
    color: THEME.colors.mountainGray,
    marginTop: THEME.spacing.xs,
    fontStyle: 'italic',
  },
  welcomeEnglish: {
    fontSize: 14,
    color: THEME.colors.celestialBlue,
    marginTop: THEME.spacing.sm,
    textAlign: 'center',
  },
  welcomeAttribution: {
    fontSize: 12,
    color: THEME.colors.jadeGreen,
    marginTop: THEME.spacing.sm,
    fontStyle: 'italic',
  },
  
  // Navigation button styles
  navContainer: {
    marginVertical: THEME.spacing.md,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.inkBlack,
    borderWidth: 1,
    borderColor: THEME.colors.mountainGray,
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
  },
  navIcon: {
    fontSize: 32,
    marginRight: THEME.spacing.md,
  },
  navTextContainer: {
    flex: 1,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.colors.cloudWhite,
  },
  navSubtitle: {
    fontSize: 12,
    color: THEME.colors.mountainGray,
    marginTop: 2,
  },
  navArrow: {
    fontSize: 20,
    color: THEME.colors.imperialYellow,
  },
  
  // Dialect selector styles
  dialectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: THEME.spacing.md,
  },
  dialectLabel: {
    fontSize: 14,
    color: THEME.colors.mountainGray,
  },
  dialectSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.mountainGray + '30',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: 20,
    marginLeft: THEME.spacing.sm,
  },
  dialectText: {
    color: THEME.colors.cloudWhite,
    fontSize: 14,
  },
  dialectArrow: {
    color: THEME.colors.cloudWhite,
    marginLeft: THEME.spacing.xs,
  },
  
  // Progress indicator styles
  progressContainer: {
    marginTop: 'auto',
    paddingTop: THEME.spacing.lg,
  },
  progressLabel: {
    fontSize: 12,
    color: THEME.colors.mountainGray,
    marginBottom: THEME.spacing.sm,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: THEME.colors.mountainGray + '50',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.jadeGreen,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: THEME.colors.jadeGreen,
    textAlign: 'center',
    marginTop: THEME.spacing.sm,
  },
});

export default App;

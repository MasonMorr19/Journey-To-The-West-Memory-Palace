/**
 * CharacterLearningScreen.js
 * 
 * Core learning interface implementing Matteo Ricci's mnemonic techniques:
 * 1. Visual decomposition of characters into radicals
 * 2. Vivid imagery from Journey to the West
 * 3. Spatial placement in the memory palace
 * 4. Multi-dialect pronunciation support
 * 
 * Following Bruno's principles: "Images should be emotionally striking,
 * either heroic, horrifying or comic."
 * 
 * 学习汉字界面 (Xuéxí Hànzì Jièmiàn)
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  PanResponder,
} from 'react-native';

const { width, height } = Dimensions.get('window');

/**
 * Character Learning Screen Component
 * 
 * Props:
 * @param {Object} station - Current memory palace station
 * @param {Object} character - Currently selected character to learn
 * @param {Object} dialect - Selected dialect for pronunciation
 * @param {Object} pilgrims - Pilgrim guide data for teaching styles
 * @param {Function} onSelectCharacter - Handler for character selection
 * @param {Function} onProgress - Handler for marking progress
 * @param {Function} onBack - Navigation back handler
 * @param {Object} theme - Theme configuration
 */
const CharacterLearningScreen = ({
  station,
  character,
  dialect,
  pilgrims,
  onSelectCharacter,
  onProgress,
  onBack,
  theme,
}) => {
  // State for learning phases
  const [learningPhase, setLearningPhase] = useState('overview'); // overview, decompose, imagine, practice, test
  const [showPinyin, setShowPinyin] = useState(true);
  const [showEnglish, setShowEnglish] = useState(true);
  const [animValue] = useState(new Animated.Value(0));
  const [strokeIndex, setStrokeIndex] = useState(0);
  
  // Animation for character reveal
  useEffect(() => {
    Animated.spring(animValue, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [character]);

  // Get current pilgrim guide based on station
  const getPilgrimGuide = () => {
    if (!station || !station.pilgrim_guide) return pilgrims.sun_wukong;
    return pilgrims[station.pilgrim_guide] || pilgrims.sun_wukong;
  };

  const pilgrimGuide = getPilgrimGuide();

  /**
   * Render the character overview phase
   * Shows the character prominently with all pronunciation options
   */
  const renderOverviewPhase = () => {
    if (!character) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>请选择一个汉字开始学习</Text>
          <Text style={styles.emptySubtext}>Please select a character to begin</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.phaseContainer} showsVerticalScrollIndicator={false}>
        {/* Main character display */}
        <Animated.View 
          style={[
            styles.characterCard,
            {
              transform: [{ scale: animValue }],
              opacity: animValue,
            }
          ]}
        >
          <Text style={styles.mainCharacter}>{character.character}</Text>
          
          {/* Radical number indicator */}
          <View style={styles.radicalBadge}>
            <Text style={styles.radicalBadgeText}>
              部首 #{character.radical_number}
            </Text>
          </View>
        </Animated.View>

        {/* Pronunciation section */}
        <View style={styles.pronunciationSection}>
          <Text style={styles.sectionTitle}>
            发音指南 | Pronunciation Guide
          </Text>
          
          {/* Primary dialect */}
          <View style={styles.pronunciationCard}>
            <View style={styles.pronunciationHeader}>
              <Text style={styles.dialectName}>
                {dialect.chinese} ({dialect.english})
              </Text>
              <TouchableOpacity style={styles.audioButton}>
                <Text style={styles.audioIcon}>🔊</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.pronunciationBody}>
              {showPinyin && (
                <View style={styles.pronunciationRow}>
                  <Text style={styles.pronunciationLabel}>拼音 Pinyin:</Text>
                  <Text style={styles.pinyinText}>
                    {character.pinyin}
                    <Text style={styles.toneNumber}> ({character.tone}声)</Text>
                  </Text>
                </View>
              )}
              
              <View style={styles.pronunciationRow}>
                <Text style={styles.pronunciationLabel}>IPA:</Text>
                <Text style={styles.ipaText}>{character.ipa}</Text>
              </View>
              
              {showEnglish && (
                <View style={styles.pronunciationRow}>
                  <Text style={styles.pronunciationLabel}>Meaning:</Text>
                  <Text style={styles.meaningText}>{character.meaning}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Other dialect pronunciations */}
          {character.dialects && Object.keys(character.dialects).length > 0 && (
            <View style={styles.otherDialects}>
              <Text style={styles.otherDialectsTitle}>
                其他方言 | Other Dialects
              </Text>
              {Object.entries(character.dialects).map(([dialectKey, dialectData]) => (
                <View key={dialectKey} style={styles.dialectRow}>
                  <Text style={styles.dialectLabel}>
                    {dialectKey === 'mandarin' ? '普通话' : 
                     dialectKey === 'cantonese' ? '粤语' :
                     dialectKey === 'minnan' ? '闽南语' : 
                     dialectKey === 'shanghainese' ? '上海话' : dialectKey}:
                  </Text>
                  <Text style={styles.dialectValue}>
                    {dialectData.pinyin || dialectData.jyutping || dialectData.poj || dialectData.ipa}
                  </Text>
                  <Text style={styles.dialectIpa}>[{dialectData.ipa}]</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Stroke information */}
        <View style={styles.strokeSection}>
          <Text style={styles.sectionTitle}>笔画 | Strokes</Text>
          <View style={styles.strokeInfo}>
            <Text style={styles.strokeCount}>{character.stroke_count}</Text>
            <Text style={styles.strokeLabel}>笔 (strokes)</Text>
          </View>
        </View>

        {/* Continue button */}
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={() => setLearningPhase('decompose')}
        >
          <Text style={styles.continueButtonText}>
            开始分解学习 | Begin Decomposition →
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  /**
   * Render the decomposition phase
   * Breaks down the character into radicals following Ricci's method
   */
  const renderDecomposePhase = () => {
    if (!character) return null;

    const strokeAnalysis = character.stroke_analysis || {
      decomposition: 'Analysis not available',
      meaning: 'See memory image for mnemonic connection'
    };

    return (
      <ScrollView style={styles.phaseContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.decomposeHeader}>
          <Text style={styles.phaseTitle}>拆字法 | Character Decomposition</Text>
          <Text style={styles.phaseSubtitle}>
            "利瑪竇方法" - Ricci's Method
          </Text>
        </View>

        {/* Character breakdown visualization */}
        <View style={styles.decomposeCard}>
          <View style={styles.decomposeMain}>
            <Text style={styles.decomposeCharacter}>{character.character}</Text>
            <Text style={styles.decomposeEquals}>=</Text>
          </View>
          
          {strokeAnalysis.decomposition && (
            <View style={styles.decomposeComponents}>
              <Text style={styles.decompositionText}>
                {strokeAnalysis.decomposition}
              </Text>
            </View>
          )}
        </View>

        {/* Explanation */}
        {strokeAnalysis.meaning && (
          <View style={styles.explanationCard}>
            <Text style={styles.explanationTitle}>
              理解 | Understanding
            </Text>
            <Text style={styles.explanationText}>
              {strokeAnalysis.meaning}
            </Text>
          </View>
        )}

        {/* Visual/philosophical meaning */}
        {strokeAnalysis.visual_mnemonic && (
          <View style={styles.mnemonicCard}>
            <Text style={styles.mnemonicTitle}>
              视觉记忆法 | Visual Mnemonic
            </Text>
            <Text style={styles.mnemonicText}>
              {strokeAnalysis.visual_mnemonic}
            </Text>
          </View>
        )}

        {/* Philosophical note if present */}
        {strokeAnalysis.philosophical_meaning && (
          <View style={styles.philosophicalCard}>
            <Text style={styles.philosophicalTitle}>
              哲学意义 | Philosophical Meaning
            </Text>
            <Text style={styles.philosophicalText}>
              {strokeAnalysis.philosophical_meaning}
            </Text>
          </View>
        )}

        {/* Navigation buttons */}
        <View style={styles.navigationButtons}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setLearningPhase('overview')}
          >
            <Text style={styles.backButtonText}>← 返回</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => setLearningPhase('imagine')}
          >
            <Text style={styles.continueButtonText}>
              进入想象 | Imagination →
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  /**
   * Render the imagination phase
   * Presents the vivid Journey to the West imagery for the character
   */
  const renderImaginePhase = () => {
    if (!character || !character.memory_image) return null;

    const memoryImage = character.memory_image;

    return (
      <ScrollView style={styles.phaseContainer} showsVerticalScrollIndicator={false}>
        {/* Pilgrim guide introduction */}
        <View style={styles.pilgrimGuideCard}>
          <Text style={styles.pilgrimGuideEmoji}>
            {pilgrimGuide.chinese === '孙悟空' ? '🐵' :
             pilgrimGuide.chinese === '唐三藏' ? '🧘' :
             pilgrimGuide.chinese === '猪八戒' ? '🐷' :
             pilgrimGuide.chinese === '沙悟净' ? '🏃' : '🐴'}
          </Text>
          <View style={styles.pilgrimGuideInfo}>
            <Text style={styles.pilgrimGuideName}>
              {pilgrimGuide.chinese} | {pilgrimGuide.titles[0].english}
            </Text>
            <Text style={styles.pilgrimGuideRole}>
              {pilgrimGuide.teaching_style}
            </Text>
          </View>
        </View>

        {/* Memory scene */}
        <View style={styles.memorySceneCard}>
          <Text style={styles.sceneTitle}>
            🎭 场景 | Scene
          </Text>
          <Text style={styles.sceneText}>
            {memoryImage.scene}
          </Text>
        </View>

        {/* Action visualization */}
        <View style={styles.actionCard}>
          <Text style={styles.actionTitle}>
            ⚡ 动作 | Action
          </Text>
          <Text style={styles.actionText}>
            {memoryImage.action}
          </Text>
        </View>

        {/* Emotional anchor */}
        <View style={styles.emotionCard}>
          <Text style={styles.emotionTitle}>
            💫 情感 | Emotion
          </Text>
          <Text style={styles.emotionText}>
            {memoryImage.emotion}
          </Text>
        </View>

        {/* Mnemonic phrase - the key memory hook */}
        <View style={styles.mnemonicPhraseCard}>
          <Text style={styles.mnemonicPhraseTitle}>
            🔑 记忆口诀 | Memory Key
          </Text>
          <Text style={styles.mnemonicPhraseText}>
            {memoryImage.mnemonic_phrase}
          </Text>
        </View>

        {/* Large character for visualization */}
        <View style={styles.visualizeCharacter}>
          <Text style={styles.visualizeCharacterText}>
            {character.character}
          </Text>
          <Text style={styles.visualizePinyin}>
            {character.pinyin} - {character.meaning}
          </Text>
        </View>

        {/* Cultural note if present */}
        {character.cultural_note && (
          <View style={styles.culturalNoteCard}>
            <Text style={styles.culturalNoteTitle}>
              📖 文化背景 | Cultural Context
            </Text>
            <Text style={styles.culturalNoteText}>
              {character.cultural_note}
            </Text>
          </View>
        )}

        {/* Philosophical note from Journey to the West */}
        {character.philosophical_note && (
          <View style={styles.philosophicalNoteCard}>
            <Text style={styles.philosophicalNoteTitle}>
              ☯ 西遊记引用 | Journey to the West Reference
            </Text>
            {character.philosophical_note.quote && (
              <Text style={styles.quoteText}>
                "{character.philosophical_note.quote}"
              </Text>
            )}
            {character.philosophical_note.interpretation && (
              <Text style={styles.interpretationText}>
                {character.philosophical_note.interpretation}
              </Text>
            )}
          </View>
        )}

        {/* Navigation buttons */}
        <View style={styles.navigationButtons}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setLearningPhase('decompose')}
          >
            <Text style={styles.backButtonText}>← 返回</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => setLearningPhase('practice')}
          >
            <Text style={styles.continueButtonText}>
              开始练习 | Practice →
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  /**
   * Render practice phase
   * Interactive exercises to reinforce memory
   */
  const renderPracticePhase = () => {
    if (!character) return null;

    return (
      <ScrollView style={styles.phaseContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.practiceHeader}>
          <Text style={styles.phaseTitle}>练习 | Practice</Text>
          <Text style={styles.phaseSubtitle}>
            实践是检验真理的唯一标准
          </Text>
          <Text style={styles.phaseSubtitleEnglish}>
            Practice is the sole criterion of truth
          </Text>
        </View>

        {/* Write the character exercise */}
        <View style={styles.exerciseCard}>
          <Text style={styles.exerciseTitle}>
            1. 书写练习 | Writing Practice
          </Text>
          <View style={styles.writingArea}>
            <Text style={styles.writingPlaceholder}>
              用手指临摹 "{character.character}"
            </Text>
            <Text style={styles.writingHint}>
              Trace with your finger: {character.pinyin}
            </Text>
          </View>
        </View>

        {/* Recall the scene exercise */}
        <View style={styles.exerciseCard}>
          <Text style={styles.exerciseTitle}>
            2. 场景回忆 | Scene Recall
          </Text>
          <Text style={styles.exercisePrompt}>
            闭上眼睛，回忆这个汉字的西游记场景...
          </Text>
          <Text style={styles.exercisePromptEnglish}>
            Close your eyes and visualize the Journey to the West scene...
          </Text>
          <TouchableOpacity style={styles.revealButton}>
            <Text style={styles.revealButtonText}>
              显示场景 | Reveal Scene
            </Text>
          </TouchableOpacity>
        </View>

        {/* Pronunciation practice */}
        <View style={styles.exerciseCard}>
          <Text style={styles.exerciseTitle}>
            3. 发音练习 | Pronunciation Practice
          </Text>
          <View style={styles.pronunciationExercise}>
            <Text style={styles.exerciseCharacter}>{character.character}</Text>
            <TouchableOpacity style={styles.listenButton}>
              <Text style={styles.listenButtonText}>🔊 听</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.recordButton}>
              <Text style={styles.recordButtonText}>🎙️ 录音</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Usage examples */}
        {character.usage_examples && character.usage_examples.length > 0 && (
          <View style={styles.exerciseCard}>
            <Text style={styles.exerciseTitle}>
              4. 例句学习 | Example Sentences
            </Text>
            {character.usage_examples.map((example, index) => (
              <View key={index} style={styles.exampleCard}>
                <Text style={styles.exampleChinese}>{example.sentence}</Text>
                <Text style={styles.examplePinyin}>{example.pinyin}</Text>
                <Text style={styles.exampleEnglish}>{example.english}</Text>
                {example.source && (
                  <Text style={styles.exampleSource}>— {example.source}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Navigation buttons */}
        <View style={styles.navigationButtons}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setLearningPhase('imagine')}
          >
            <Text style={styles.backButtonText}>← 返回</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.completeButton}
            onPress={() => {
              onProgress(character.character);
              setLearningPhase('overview');
            }}
          >
            <Text style={styles.completeButtonText}>
              ✓ 完成学习 | Complete
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  // Render current phase
  const renderCurrentPhase = () => {
    switch (learningPhase) {
      case 'overview':
        return renderOverviewPhase();
      case 'decompose':
        return renderDecomposePhase();
      case 'imagine':
        return renderImaginePhase();
      case 'practice':
        return renderPracticePhase();
      default:
        return renderOverviewPhase();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with back button and station info */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBackButton} onPress={onBack}>
          <Text style={styles.headerBackText}>← 返回宫殿</Text>
        </TouchableOpacity>
        
        {station && (
          <View style={styles.stationInfo}>
            <Text style={styles.stationName}>
              {station.name.chinese}
            </Text>
            <Text style={styles.stationPinyin}>
              {station.name.pinyin}
            </Text>
          </View>
        )}
      </View>

      {/* Phase progress indicator */}
      <View style={styles.phaseIndicator}>
        {['overview', 'decompose', 'imagine', 'practice'].map((phase, index) => (
          <View key={phase} style={styles.phaseStep}>
            <View 
              style={[
                styles.phaseDot,
                learningPhase === phase && styles.phaseDotActive,
                ['decompose', 'imagine', 'practice'].indexOf(learningPhase) >= index && 
                  styles.phaseDotCompleted,
              ]}
            />
            <Text style={[
              styles.phaseLabel,
              learningPhase === phase && styles.phaseLabelActive,
            ]}>
              {phase === 'overview' ? '总览' :
               phase === 'decompose' ? '分解' :
               phase === 'imagine' ? '想象' : '练习'}
            </Text>
          </View>
        ))}
      </View>

      {/* Main content area */}
      {renderCurrentPhase()}

      {/* Character selector (if station has multiple characters) */}
      {station && station.characters && station.characters.length > 1 && (
        <View style={styles.characterSelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {station.characters.map((char) => (
              <TouchableOpacity
                key={char.character}
                style={[
                  styles.characterSelectorItem,
                  character && character.character === char.character && 
                    styles.characterSelectorItemActive,
                ]}
                onPress={() => onSelectCharacter(char)}
              >
                <Text style={[
                  styles.characterSelectorText,
                  character && character.character === char.character && 
                    styles.characterSelectorTextActive,
                ]}>
                  {char.character}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

/**
 * Styles for the Character Learning Screen
 * Following traditional Chinese aesthetic principles with modern UX
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerBackButton: {
    padding: 8,
  },
  headerBackText: {
    color: '#1E90FF',
    fontSize: 14,
  },
  stationInfo: {
    alignItems: 'flex-end',
  },
  stationName: {
    color: '#FFDF00',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stationPinyin: {
    color: '#708090',
    fontSize: 12,
    fontStyle: 'italic',
  },
  
  // Phase indicator
  phaseIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#252525',
  },
  phaseStep: {
    alignItems: 'center',
  },
  phaseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#444',
    marginBottom: 4,
  },
  phaseDotActive: {
    backgroundColor: '#FFDF00',
  },
  phaseDotCompleted: {
    backgroundColor: '#00A86B',
  },
  phaseLabel: {
    color: '#708090',
    fontSize: 10,
  },
  phaseLabelActive: {
    color: '#FFDF00',
    fontWeight: 'bold',
  },
  
  // Phase container
  phaseContainer: {
    flex: 1,
    padding: 16,
  },
  phaseTitle: {
    fontSize: 24,
    color: '#FFDF00',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  phaseSubtitle: {
    color: '#F8F8FF',
    fontSize: 14,
  },
  phaseSubtitleEnglish: {
    color: '#708090',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 2,
  },
  
  // Character card (overview)
  characterCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#252525',
    borderRadius: 16,
    padding: 32,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#FFDF00',
    position: 'relative',
  },
  mainCharacter: {
    fontSize: 120,
    color: '#FFDF00',
    textShadowColor: '#DC143C',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
  radicalBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#1E90FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  radicalBadgeText: {
    color: '#FFF',
    fontSize: 10,
  },
  
  // Pronunciation section
  pronunciationSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#F8F8FF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    paddingBottom: 8,
  },
  pronunciationCard: {
    backgroundColor: '#252525',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  pronunciationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dialectName: {
    color: '#00A86B',
    fontSize: 14,
    fontWeight: 'bold',
  },
  audioButton: {
    padding: 8,
    backgroundColor: '#333',
    borderRadius: 20,
  },
  audioIcon: {
    fontSize: 20,
  },
  pronunciationBody: {
    gap: 8,
  },
  pronunciationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pronunciationLabel: {
    color: '#708090',
    width: 80,
    fontSize: 12,
  },
  pinyinText: {
    color: '#FFDF00',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toneNumber: {
    color: '#708090',
    fontSize: 12,
    fontWeight: 'normal',
  },
  ipaText: {
    color: '#1E90FF',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  meaningText: {
    color: '#F8F8FF',
    fontSize: 16,
  },
  
  // Other dialects
  otherDialects: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 12,
  },
  otherDialectsTitle: {
    color: '#708090',
    fontSize: 12,
    marginBottom: 8,
  },
  dialectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dialectLabel: {
    color: '#708090',
    width: 60,
    fontSize: 11,
  },
  dialectValue: {
    color: '#F8F8FF',
    fontSize: 14,
    flex: 1,
  },
  dialectIpa: {
    color: '#1E90FF',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  
  // Stroke section
  strokeSection: {
    marginBottom: 24,
  },
  strokeInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    backgroundColor: '#252525',
    borderRadius: 12,
    padding: 16,
  },
  strokeCount: {
    fontSize: 48,
    color: '#FFDF00',
    fontWeight: 'bold',
  },
  strokeLabel: {
    color: '#708090',
    fontSize: 16,
    marginLeft: 8,
  },
  
  // Buttons
  continueButton: {
    backgroundColor: '#00A86B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    borderWidth: 1,
    borderColor: '#708090',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  backButtonText: {
    color: '#708090',
    fontSize: 14,
  },
  completeButton: {
    backgroundColor: '#FFDF00',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 2,
  },
  completeButtonText: {
    color: '#1C1C1C',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navigationButtons: {
    flexDirection: 'row',
    marginTop: 24,
    marginBottom: 32,
  },
  
  // Decomposition phase
  decomposeHeader: {
    marginBottom: 24,
  },
  decomposeCard: {
    backgroundColor: '#252525',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  decomposeMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  decomposeCharacter: {
    fontSize: 72,
    color: '#FFDF00',
  },
  decomposeEquals: {
    fontSize: 36,
    color: '#708090',
    marginLeft: 16,
  },
  decomposeComponents: {
    padding: 12,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    width: '100%',
  },
  decompositionText: {
    color: '#F8F8FF',
    fontSize: 18,
    textAlign: 'center',
  },
  explanationCard: {
    backgroundColor: '#1E3A5F',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  explanationTitle: {
    color: '#1E90FF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  explanationText: {
    color: '#F8F8FF',
    fontSize: 14,
    lineHeight: 22,
  },
  mnemonicCard: {
    backgroundColor: '#2D4F2D',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  mnemonicTitle: {
    color: '#00A86B',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  mnemonicText: {
    color: '#F8F8FF',
    fontSize: 14,
    lineHeight: 22,
  },
  philosophicalCard: {
    backgroundColor: '#3D2D4F',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  philosophicalTitle: {
    color: '#9370DB',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  philosophicalText: {
    color: '#F8F8FF',
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  
  // Imagination phase
  pilgrimGuideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252525',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#FFDF00',
  },
  pilgrimGuideEmoji: {
    fontSize: 48,
    marginRight: 16,
  },
  pilgrimGuideInfo: {
    flex: 1,
  },
  pilgrimGuideName: {
    color: '#FFDF00',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pilgrimGuideRole: {
    color: '#708090',
    fontSize: 12,
    marginTop: 4,
  },
  memorySceneCard: {
    backgroundColor: '#1E3A5F',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sceneTitle: {
    color: '#1E90FF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sceneText: {
    color: '#F8F8FF',
    fontSize: 16,
    lineHeight: 24,
  },
  actionCard: {
    backgroundColor: '#4F2D2D',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  actionTitle: {
    color: '#DC143C',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  actionText: {
    color: '#F8F8FF',
    fontSize: 16,
    lineHeight: 24,
  },
  emotionCard: {
    backgroundColor: '#3D2D4F',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  emotionTitle: {
    color: '#FFB7C5',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emotionText: {
    color: '#F8F8FF',
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  mnemonicPhraseCard: {
    backgroundColor: '#FFDF00',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  mnemonicPhraseTitle: {
    color: '#1C1C1C',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  mnemonicPhraseText: {
    color: '#1C1C1C',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 26,
  },
  visualizeCharacter: {
    alignItems: 'center',
    marginBottom: 24,
  },
  visualizeCharacterText: {
    fontSize: 100,
    color: '#FFDF00',
    textShadowColor: 'rgba(255, 223, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  visualizePinyin: {
    color: '#F8F8FF',
    fontSize: 18,
    marginTop: 8,
  },
  culturalNoteCard: {
    backgroundColor: '#2D3D4F',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  culturalNoteTitle: {
    color: '#00A86B',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  culturalNoteText: {
    color: '#F8F8FF',
    fontSize: 14,
    lineHeight: 22,
  },
  philosophicalNoteCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFDF00',
  },
  philosophicalNoteTitle: {
    color: '#FFDF00',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  quoteText: {
    color: '#F8F8FF',
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  interpretationText: {
    color: '#708090',
    fontSize: 12,
    lineHeight: 18,
  },
  
  // Practice phase
  practiceHeader: {
    marginBottom: 24,
  },
  exerciseCard: {
    backgroundColor: '#252525',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  exerciseTitle: {
    color: '#00A86B',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  writingArea: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#444',
  },
  writingPlaceholder: {
    color: '#708090',
    fontSize: 16,
  },
  writingHint: {
    color: '#444',
    fontSize: 12,
    marginTop: 8,
  },
  exercisePrompt: {
    color: '#F8F8FF',
    fontSize: 14,
    marginBottom: 8,
  },
  exercisePromptEnglish: {
    color: '#708090',
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  revealButton: {
    backgroundColor: '#1E3A5F',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  revealButtonText: {
    color: '#1E90FF',
    fontSize: 14,
  },
  pronunciationExercise: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  exerciseCharacter: {
    fontSize: 48,
    color: '#FFDF00',
  },
  listenButton: {
    backgroundColor: '#1E3A5F',
    borderRadius: 20,
    padding: 12,
  },
  listenButtonText: {
    fontSize: 20,
  },
  recordButton: {
    backgroundColor: '#4F2D2D',
    borderRadius: 20,
    padding: 12,
  },
  recordButtonText: {
    fontSize: 20,
  },
  exampleCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  exampleChinese: {
    color: '#FFDF00',
    fontSize: 16,
    marginBottom: 4,
  },
  examplePinyin: {
    color: '#708090',
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  exampleEnglish: {
    color: '#F8F8FF',
    fontSize: 14,
    marginBottom: 4,
  },
  exampleSource: {
    color: '#00A86B',
    fontSize: 10,
    textAlign: 'right',
  },
  
  // Character selector
  characterSelector: {
    backgroundColor: '#252525',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  characterSelectorItem: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  characterSelectorItemActive: {
    backgroundColor: '#FFDF00',
  },
  characterSelectorText: {
    color: '#F8F8FF',
    fontSize: 24,
  },
  characterSelectorTextActive: {
    color: '#1C1C1C',
  },
  
  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    color: '#708090',
    fontSize: 18,
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#444',
    fontSize: 14,
  },
});

export default CharacterLearningScreen;

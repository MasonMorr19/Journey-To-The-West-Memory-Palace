/**
 * PilgrimGuideScreen.js
 *
 * Information about the Journey to the West pilgrims who serve as guides
 * Each pilgrim has a different teaching style and personality
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const PilgrimGuideScreen = ({ pilgrims, dialect, onBack, theme }) => {
  const getPilgrimEmoji = (name) => {
    if (name.includes('悟空')) return '🐵';
    if (name.includes('三藏')) return '🧘';
    if (name.includes('八戒')) return '🐷';
    if (name.includes('悟净')) return '🏃';
    if (name.includes('龙马')) return '🐴';
    return '✨';
  };

  const pilgrimsArray = pilgrims ? Object.values(pilgrims) : [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>取经团队</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>西天取经团</Text>
        <Text style={styles.subtitle}>The Pilgrimage Team</Text>
        <Text style={styles.description}>
          Each pilgrim represents a different aspect of learning and memory
        </Text>
      </View>

      {/* Pilgrims List */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {pilgrimsArray.map((pilgrim, index) => (
          <View key={index} style={styles.pilgrimCard}>
            <View style={styles.pilgrimHeader}>
              <Text style={styles.pilgrimEmoji}>
                {getPilgrimEmoji(pilgrim.chinese)}
              </Text>
              <View style={styles.pilgrimHeaderText}>
                <Text style={styles.pilgrimName}>{pilgrim.chinese}</Text>
                <Text style={styles.pilgrimPinyin}>{pilgrim.pinyin}</Text>
                <Text style={styles.pilgrimMeaning}>{pilgrim.meaning}</Text>
              </View>
            </View>

            {/* Titles */}
            {pilgrim.titles && pilgrim.titles.length > 0 && (
              <View style={styles.titlesSection}>
                <Text style={styles.sectionLabel}>称号 | Titles:</Text>
                {pilgrim.titles.map((title, idx) => (
                  <View key={idx} style={styles.titleItem}>
                    <Text style={styles.titleChinese}>• {title.chinese}</Text>
                    <Text style={styles.titlePinyin}>  {title.pinyin}</Text>
                    <Text style={styles.titleEnglish}>  "{title.english}"</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Cognitive Role */}
            <View style={styles.roleSection}>
              <Text style={styles.sectionLabel}>认知作用 | Cognitive Role:</Text>
              <Text style={styles.roleText}>{pilgrim.cognitive_role}</Text>
            </View>

            {/* Teaching Style */}
            <View style={styles.teachingSection}>
              <Text style={styles.sectionLabel}>教学风格 | Teaching Style:</Text>
              <Text style={styles.teachingText}>{pilgrim.teaching_style}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

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
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#1E90FF',
    fontSize: 14,
  },
  headerTitle: {
    color: '#FFDF00',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 50,
  },
  titleSection: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#252525',
  },
  mainTitle: {
    color: '#FFDF00',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#1E90FF',
    fontSize: 16,
    marginBottom: 8,
  },
  description: {
    color: '#708090',
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  pilgrimCard: {
    backgroundColor: '#252525',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  pilgrimHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  pilgrimEmoji: {
    fontSize: 56,
    marginRight: 16,
  },
  pilgrimHeaderText: {
    flex: 1,
  },
  pilgrimName: {
    color: '#FFDF00',
    fontSize: 22,
    fontWeight: 'bold',
  },
  pilgrimPinyin: {
    color: '#708090',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 2,
  },
  pilgrimMeaning: {
    color: '#1E90FF',
    fontSize: 13,
    marginTop: 4,
  },
  titlesSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    color: '#00A86B',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  titleItem: {
    marginBottom: 6,
    paddingLeft: 8,
  },
  titleChinese: {
    color: '#F8F8FF',
    fontSize: 14,
  },
  titlePinyin: {
    color: '#708090',
    fontSize: 12,
    fontStyle: 'italic',
  },
  titleEnglish: {
    color: '#1E90FF',
    fontSize: 12,
  },
  roleSection: {
    marginBottom: 12,
    backgroundColor: '#1E3A5F',
    padding: 12,
    borderRadius: 8,
  },
  roleText: {
    color: '#F8F8FF',
    fontSize: 14,
    lineHeight: 20,
  },
  teachingSection: {
    backgroundColor: '#2D4F2D',
    padding: 12,
    borderRadius: 8,
  },
  teachingText: {
    color: '#F8F8FF',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default PilgrimGuideScreen;

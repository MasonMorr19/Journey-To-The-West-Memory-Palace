/**
 * SettingsScreen.js
 *
 * User preferences and dialect selection
 * Allows switching between Mandarin, Cantonese, Min Nan, and Shanghainese
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';

const SettingsScreen = ({ dialects, selectedDialect, onSelectDialect, onBack, theme }) => {
  const dialectsArray = dialects ? Object.values(dialects) : [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>设置</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Dialect Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>方言选择 | Dialect Selection</Text>
          <Text style={styles.sectionDescription}>
            Choose your preferred pronunciation dialect
          </Text>

          {dialectsArray.map((dialect) => (
            <TouchableOpacity
              key={dialect.id}
              style={[
                styles.dialectOption,
                selectedDialect?.id === dialect.id && styles.dialectOptionSelected,
              ]}
              onPress={() => onSelectDialect(dialect)}
            >
              <View style={styles.dialectInfo}>
                <Text style={[
                  styles.dialectChinese,
                  selectedDialect?.id === dialect.id && styles.dialectTextSelected,
                ]}>
                  {dialect.chinese}
                </Text>
                <Text style={styles.dialectPinyin}>{dialect.pinyin}</Text>
                <Text style={styles.dialectEnglish}>{dialect.english}</Text>
                {dialect.tones && (
                  <Text style={styles.dialectTones}>
                    {dialect.tones} 声调 | {dialect.tones} tones
                  </Text>
                )}
                {dialect.romanization && (
                  <Text style={styles.dialectRomanization}>
                    Romanization: {dialect.romanization}
                  </Text>
                )}
              </View>

              <View style={[
                styles.radioButton,
                selectedDialect?.id === dialect.id && styles.radioButtonSelected,
              ]}>
                {selectedDialect?.id === dialect.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Display Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>显示设置 | Display Preferences</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>显示拼音 | Show Pinyin</Text>
              <Text style={styles.settingDescription}>
                Display romanization for all characters
              </Text>
            </View>
            <Switch
              value={true}
              trackColor={{ false: '#444', true: '#00A86B' }}
              thumbColor="#F8F8FF"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>显示英文 | Show English</Text>
              <Text style={styles.settingDescription}>
                Display English translations
              </Text>
            </View>
            <Switch
              value={true}
              trackColor={{ false: '#444', true: '#00A86B' }}
              thumbColor="#F8F8FF"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>自动播放音频 | Auto-play Audio</Text>
              <Text style={styles.settingDescription}>
                Automatically play pronunciation when viewing characters
              </Text>
            </View>
            <Switch
              value={false}
              trackColor={{ false: '#444', true: '#00A86B' }}
              thumbColor="#F8F8FF"
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>关于 | About</Text>

          <View style={styles.aboutCard}>
            <Text style={styles.aboutTitle}>
              西遊記記憶宮殿
            </Text>
            <Text style={styles.aboutSubtitle}>
              Journey to the West Memory Palace
            </Text>
            <Text style={styles.aboutVersion}>Version 1.0.0</Text>

            <Text style={styles.aboutDescription}>
              A bilingual memory palace application for learning Chinese characters
              using Matteo Ricci's mnemonic techniques and Journey to the West imagery.
            </Text>

            <Text style={styles.aboutMethod}>
              基于利瑪竇记忆法和布鲁诺记忆宫殿法
            </Text>
            <Text style={styles.aboutMethodEn}>
              Based on Matteo Ricci's mnemonics and Giordano Bruno's memory palace method
            </Text>
          </View>
        </View>

        {/* Credits */}
        <View style={styles.creditsSection}>
          <Text style={styles.creditsTitle}>制作团队 | Credits</Text>
          <Text style={styles.creditsText}>
            Memory Palace Development Team
          </Text>
          <Text style={styles.creditsText}>
            Based on "The Memory Palace of Matteo Ricci" by Jonathan D. Spence
          </Text>
          <Text style={styles.creditsText}>
            Journey to the West (西遊記) by Wu Cheng'en
          </Text>
        </View>
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
  scrollContainer: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#252525',
  },
  sectionTitle: {
    color: '#FFDF00',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionDescription: {
    color: '#708090',
    fontSize: 12,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  dialectOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#252525',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dialectOptionSelected: {
    borderColor: '#FFDF00',
    backgroundColor: '#3A3A2A',
  },
  dialectInfo: {
    flex: 1,
  },
  dialectChinese: {
    color: '#F8F8FF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dialectTextSelected: {
    color: '#FFDF00',
  },
  dialectPinyin: {
    color: '#708090',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 2,
  },
  dialectEnglish: {
    color: '#1E90FF',
    fontSize: 14,
    marginTop: 4,
  },
  dialectTones: {
    color: '#00A86B',
    fontSize: 11,
    marginTop: 4,
  },
  dialectRomanization: {
    color: '#708090',
    fontSize: 10,
    marginTop: 2,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#708090',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#FFDF00',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFDF00',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#252525',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    color: '#F8F8FF',
    fontSize: 14,
    marginBottom: 2,
  },
  settingDescription: {
    color: '#708090',
    fontSize: 11,
  },
  aboutCard: {
    backgroundColor: '#252525',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  aboutTitle: {
    color: '#FFDF00',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  aboutSubtitle: {
    color: '#1E90FF',
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  aboutVersion: {
    color: '#708090',
    fontSize: 12,
    marginBottom: 16,
  },
  aboutDescription: {
    color: '#F8F8FF',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  aboutMethod: {
    color: '#00A86B',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  aboutMethodEn: {
    color: '#708090',
    fontSize: 11,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  creditsSection: {
    padding: 16,
    alignItems: 'center',
  },
  creditsTitle: {
    color: '#708090',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  creditsText: {
    color: '#444',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 4,
  },
});

export default SettingsScreen;

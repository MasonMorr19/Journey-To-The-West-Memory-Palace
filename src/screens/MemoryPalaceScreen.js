/**
 * MemoryPalaceScreen.js
 *
 * Visual representation of the memory palace with stations
 * Users navigate through different palaces and select stations to learn characters
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const MemoryPalaceScreen = ({
  palaces,
  currentPalace,
  onSelectPalace,
  onSelectStation,
  onBack,
  theme,
}) => {
  const [selectedPalace, setSelectedPalace] = useState(currentPalace || (palaces && palaces[0]));

  const handlePalaceSelect = (palace) => {
    setSelectedPalace(palace);
    onSelectPalace(palace);
  };

  if (!palaces || palaces.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No palace data available</Text>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← 返回</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>记忆宫殿</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Palace Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.palaceSelector}>
        {palaces.map((palace) => (
          <TouchableOpacity
            key={palace.id}
            style={[
              styles.palaceCard,
              selectedPalace?.id === palace.id && styles.palaceCardActive,
            ]}
            onPress={() => handlePalaceSelect(palace)}
          >
            <Text style={[
              styles.palaceName,
              selectedPalace?.id === palace.id && styles.palaceNameActive,
            ]}>
              {palace.name.chinese}
            </Text>
            <Text style={styles.palacePinyin}>{palace.name.pinyin}</Text>
            <Text style={styles.palaceEnglish}>{palace.name.english}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Palace Description */}
      {selectedPalace && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{selectedPalace.description}</Text>
        </View>
      )}

      {/* Stations List */}
      <ScrollView style={styles.stationsContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.stationsTitle}>驿站 | Stations</Text>
        {selectedPalace && selectedPalace.stations && selectedPalace.stations.map((station, index) => (
          <TouchableOpacity
            key={station.id}
            style={styles.stationCard}
            onPress={() => onSelectStation(station)}
          >
            <View style={styles.stationNumber}>
              <Text style={styles.stationNumberText}>{index + 1}</Text>
            </View>
            <View style={styles.stationInfo}>
              <Text style={styles.stationName}>{station.name.chinese}</Text>
              <Text style={styles.stationPinyin}>{station.name.pinyin}</Text>
              <Text style={styles.stationEnglish}>{station.name.english}</Text>
              {station.characters && (
                <Text style={styles.stationCharacterCount}>
                  {station.characters.length} 个汉字 | {station.characters.length} characters
                </Text>
              )}
            </View>
            <Text style={styles.stationArrow}>→</Text>
          </TouchableOpacity>
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
  palaceSelector: {
    maxHeight: 140,
    backgroundColor: '#252525',
    paddingVertical: 12,
  },
  palaceCard: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    minWidth: width * 0.6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  palaceCardActive: {
    borderColor: '#FFDF00',
    backgroundColor: '#3A3A2A',
  },
  palaceName: {
    color: '#F8F8FF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  palaceNameActive: {
    color: '#FFDF00',
  },
  palacePinyin: {
    color: '#708090',
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 2,
  },
  palaceEnglish: {
    color: '#1E90FF',
    fontSize: 14,
  },
  descriptionContainer: {
    padding: 16,
    backgroundColor: '#1E1E1E',
  },
  descriptionText: {
    color: '#F8F8FF',
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  stationsContainer: {
    flex: 1,
    padding: 16,
  },
  stationsTitle: {
    color: '#FFDF00',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  stationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252525',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#00A86B',
  },
  stationNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00A86B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stationNumberText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stationInfo: {
    flex: 1,
  },
  stationName: {
    color: '#F8F8FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stationPinyin: {
    color: '#708090',
    fontSize: 11,
    fontStyle: 'italic',
  },
  stationEnglish: {
    color: '#1E90FF',
    fontSize: 13,
  },
  stationCharacterCount: {
    color: '#00A86B',
    fontSize: 11,
    marginTop: 4,
  },
  stationArrow: {
    color: '#FFDF00',
    fontSize: 20,
  },
  errorText: {
    color: '#708090',
    fontSize: 16,
    textAlign: 'center',
    margin: 32,
  },
});

export default MemoryPalaceScreen;

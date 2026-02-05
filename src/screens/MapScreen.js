/**
 * MapScreen.js
 *
 * Interactive map showing the journey from Chang'an to India
 * Displays palaces along the route with progress indicators
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const MapScreen = ({ palaces, progress, onSelectLocation, onBack, theme }) => {
  const getProgressForPalace = (palace) => {
    if (!palace.stations || !progress) return 0;

    let totalCharacters = 0;
    let learnedCharacters = 0;

    palace.stations.forEach((station) => {
      if (station.characters) {
        totalCharacters += station.characters.length;
        station.characters.forEach((char) => {
          if (progress[char.character]) {
            learnedCharacters++;
          }
        });
      }
    });

    return totalCharacters > 0 ? Math.round((learnedCharacters / totalCharacters) * 100) : 0;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>西行地图</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Map Title */}
      <View style={styles.mapHeader}>
        <Text style={styles.mapTitle}>西天取经之路</Text>
        <Text style={styles.mapSubtitle}>Journey to the West Route Map</Text>
        <Text style={styles.mapDescription}>
          从长安到天竺 | From Chang'an to India
        </Text>
      </View>

      {/* Journey Path */}
      <ScrollView style={styles.mapContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.journeyPath}>
          {palaces && palaces.map((palace, index) => {
            const progressPercent = getProgressForPalace(palace);

            return (
              <View key={palace.id}>
                {/* Location Marker */}
                <TouchableOpacity
                  style={styles.locationCard}
                  onPress={() => onSelectLocation(palace)}
                >
                  <View style={styles.locationMarker}>
                    <View style={[
                      styles.markerDot,
                      progressPercent === 100 && styles.markerDotComplete,
                      progressPercent > 0 && progressPercent < 100 && styles.markerDotInProgress,
                    ]}>
                      <Text style={styles.markerNumber}>{index + 1}</Text>
                    </View>
                  </View>

                  <View style={styles.locationInfo}>
                    <Text style={styles.locationName}>{palace.name.chinese}</Text>
                    <Text style={styles.locationPinyin}>{palace.name.pinyin}</Text>
                    <Text style={styles.locationEnglish}>{palace.name.english}</Text>

                    {/* Progress Bar */}
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            { width: `${progressPercent}%` }
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>{progressPercent}%</Text>
                    </View>

                    {/* Coordinates */}
                    {palace.coordinates && (
                      <Text style={styles.coordinates}>
                        📍 {palace.coordinates.latitude?.toFixed(2)}°N, {palace.coordinates.longitude?.toFixed(2)}°E
                      </Text>
                    )}
                  </View>

                  <Text style={styles.locationArrow}>→</Text>
                </TouchableOpacity>

                {/* Path Connector */}
                {index < palaces.length - 1 && (
                  <View style={styles.pathConnector}>
                    <View style={styles.pathLine} />
                    <Text style={styles.pathIcon}>⬇</Text>
                    <View style={styles.pathLine} />
                  </View>
                )}
              </View>
            );
          })}

          {/* Final Destination */}
          <View style={styles.destinationCard}>
            <Text style={styles.destinationEmoji}>🏛️</Text>
            <Text style={styles.destinationName}>雷音寺</Text>
            <Text style={styles.destinationPinyin}>Léiyīn Sì</Text>
            <Text style={styles.destinationEnglish}>Thunder Monastery</Text>
            <Text style={styles.destinationNote}>Final Destination</Text>
          </View>
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
  mapHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#252525',
    borderBottomWidth: 2,
    borderBottomColor: '#FFDF00',
  },
  mapTitle: {
    color: '#FFDF00',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mapSubtitle: {
    color: '#1E90FF',
    fontSize: 16,
    marginBottom: 4,
  },
  mapDescription: {
    color: '#708090',
    fontSize: 12,
    fontStyle: 'italic',
  },
  mapContainer: {
    flex: 1,
  },
  journeyPath: {
    padding: 16,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252525',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  locationMarker: {
    marginRight: 16,
  },
  markerDot: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#708090',
  },
  markerDotInProgress: {
    backgroundColor: '#FFDF00',
    borderColor: '#FFA500',
  },
  markerDotComplete: {
    backgroundColor: '#00A86B',
    borderColor: '#00FF7F',
  },
  markerNumber: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    color: '#F8F8FF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  locationPinyin: {
    color: '#708090',
    fontSize: 12,
    fontStyle: 'italic',
  },
  locationEnglish: {
    color: '#1E90FF',
    fontSize: 14,
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00A86B',
    borderRadius: 4,
  },
  progressText: {
    color: '#00A86B',
    fontSize: 12,
    fontWeight: 'bold',
    minWidth: 40,
  },
  coordinates: {
    color: '#444',
    fontSize: 10,
    marginTop: 4,
  },
  locationArrow: {
    color: '#FFDF00',
    fontSize: 24,
  },
  pathConnector: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  pathLine: {
    width: 2,
    height: 16,
    backgroundColor: '#444',
  },
  pathIcon: {
    color: '#FFDF00',
    fontSize: 16,
    marginVertical: 4,
  },
  destinationCard: {
    alignItems: 'center',
    backgroundColor: '#252525',
    borderRadius: 16,
    padding: 24,
    marginTop: 8,
    borderWidth: 2,
    borderColor: '#FFDF00',
  },
  destinationEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  destinationName: {
    color: '#FFDF00',
    fontSize: 24,
    fontWeight: 'bold',
  },
  destinationPinyin: {
    color: '#708090',
    fontSize: 14,
    fontStyle: 'italic',
  },
  destinationEnglish: {
    color: '#1E90FF',
    fontSize: 16,
    marginTop: 4,
  },
  destinationNote: {
    color: '#00A86B',
    fontSize: 12,
    marginTop: 8,
    fontWeight: 'bold',
  },
});

export default MapScreen;

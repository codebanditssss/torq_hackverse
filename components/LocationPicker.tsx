import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Card, IconButton } from 'react-native-paper';
import { useLocationStore } from '../store/location-store';
import { debounce } from 'lodash';

interface LocationPickerProps {
  onLocationSelect?: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}

export function LocationPicker({ onLocationSelect }: LocationPickerProps) {
  const {
    getCurrentLocation,
    searchLocations,
    selectedLocation,
    setSelectedLocation,
    isLoading,
    error,
  } = useLocationStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{
    latitude: number;
    longitude: number;
    address: string;
  }>>([]);
  const [showResults, setShowResults] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length > 2) {
        const results = await searchLocations(query);
        setSearchResults(results);
        setShowResults(true);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500),
    []
  );

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text !== selectedLocation?.address) {
      setSelectedLocation(null);
    }
    debouncedSearch(text);
  };

  const handleLocationSelect = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setSelectedLocation(location);
    onLocationSelect?.(location);
    setSearchQuery(location.address);
    setShowResults(false);
  };

  const handleGetCurrentLocation = async () => {
    try {
      const location = await getCurrentLocation();
      if (location) {
        onLocationSelect?.(location);
        setSearchQuery(location.address);
      }
    } catch (err) {
      // Error is already handled in the store
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          mode="outlined"
          placeholder="Enter location"
          value={searchQuery}
          onChangeText={handleSearch}
          right={
            <TextInput.Icon
              icon="map-marker"
              onPress={handleGetCurrentLocation}
              disabled={isLoading}
            />
          }
          style={styles.input}
        />
      </View>

      {error && (
        <Text style={styles.error} variant="bodySmall">
          {error}
        </Text>
      )}

      {showResults && searchResults.length > 0 && (
        <Card style={styles.resultsCard}>
          <Card.Content>
            {searchResults.map((result, index) => (
              <Button
                key={index}
                mode="text"
                onPress={() => handleLocationSelect(result)}
                style={styles.resultItem}
                contentStyle={styles.resultContent}
                labelStyle={styles.resultLabel}
              >
                {result.address}
              </Button>
            ))}
          </Card.Content>
        </Card>
      )}

      {!showResults && selectedLocation && (
        <Card style={styles.selectedCard}>
          <Card.Content>
            <Text variant="bodyMedium">{selectedLocation.address}</Text>
          </Card.Content>
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
  },
  error: {
    color: '#dc2626',
    marginTop: 4,
  },
  resultsCard: {
    marginTop: 8,
    backgroundColor: '#fff',
  },
  resultItem: {
    paddingVertical: 4,
  },
  resultContent: {
    justifyContent: 'flex-start',
  },
  resultLabel: {
    fontSize: 14,
  },
  selectedCard: {
    marginTop: 8,
    backgroundColor: '#fff',
  },
});

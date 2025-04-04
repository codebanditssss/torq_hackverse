import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Text, IconButton, Menu } from 'react-native-paper';
import { useVehicleStore } from '../store/vehicle-store';
import { Vehicle } from '../types';
import { router } from 'expo-router';

interface VehicleSelectorProps {
  onSelect?: (vehicle: Vehicle) => void;
  selectedVehicleId?: string;
}

export function VehicleSelector({ onSelect, selectedVehicleId }: VehicleSelectorProps) {
  const { vehicles, selectedVehicle, selectVehicle } = useVehicleStore();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleVehicleSelect = (vehicle: Vehicle) => {
    selectVehicle(vehicle);
    onSelect?.(vehicle);
    setMenuVisible(false);
  };

  const handleAddVehicle = () => {
    router.push('/vehicles/add');
  };

  return (
    <View style={styles.container}>
      {selectedVehicle ? (
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.vehicleInfo}>
              <Text variant="titleMedium">
                {selectedVehicle.make} {selectedVehicle.model}
              </Text>
              <Text variant="bodyMedium" style={styles.licensePlate}>
                {selectedVehicle.licensePlate}
              </Text>
            </View>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <IconButton
                  icon="chevron-down"
                  onPress={() => setMenuVisible(true)}
                />
              }
            >
              {vehicles.map((vehicle) => (
                <Menu.Item
                  key={vehicle.id}
                  onPress={() => handleVehicleSelect(vehicle)}
                  title={`${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`}
                  leadingIcon={vehicle.isDefault ? 'star' : undefined}
                />
              ))}
              <Menu.Item
                onPress={handleAddVehicle}
                title="Add New Vehicle"
                leadingIcon="plus"
              />
            </Menu>
          </Card.Content>
        </Card>
      ) : (
        <Button
          mode="outlined"
          onPress={() => setMenuVisible(true)}
          icon="car"
          style={styles.selectButton}
        >
          Select Vehicle
        </Button>
      )}
      <Menu
        visible={menuVisible && !selectedVehicle}
        onDismiss={() => setMenuVisible(false)}
        anchor={<View />}
      >
        {vehicles.map((vehicle) => (
          <Menu.Item
            key={vehicle.id}
            onPress={() => handleVehicleSelect(vehicle)}
            title={`${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`}
            leadingIcon={vehicle.isDefault ? 'star' : undefined}
          />
        ))}
        <Menu.Item
          onPress={handleAddVehicle}
          title="Add New Vehicle"
          leadingIcon="plus"
        />
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  card: {
    backgroundColor: '#fff',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  vehicleInfo: {
    flex: 1,
  },
  licensePlate: {
    color: '#666',
    marginTop: 4,
  },
  selectButton: {
    marginVertical: 8,
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Colors, Spacing, FontFamily, FontSize, BorderRadius, Layout } from '../../../src/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { hospitalsService } from '../../../src/services/api/hospitalsService';
import { Hospital } from '../../../src/types/medical.types';
import { HospitalCard } from '../../../src/components/cards/HospitalCard';

export default function HospitalsScreen() {
  const router = useRouter();
  const [locationStatus, setLocationStatus] = useState<Location.PermissionStatus | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocationStatus(status);

        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          setUserLocation(location);

          const nearbyHospitals = await hospitalsService.getNearbyHospitals(
            location.coords.latitude,
            location.coords.longitude,
          );
          setHospitals(nearbyHospitals);
        }
      } catch (error) {
        // Fallback for when location fails (e.g. offline or disabled)
        setLocationStatus(Location.PermissionStatus.DENIED);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleHospitalPress = (hospital: Hospital) => {
    router.push(`/(app)/hospitals/${hospital.id}`);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Locating nearby hospitals...</Text>
      </View>
    );
  }

  if (locationStatus !== 'granted' || !userLocation) {
    return (
      <View style={styles.centerContainer}>
        <MaterialCommunityIcons name="map-marker-off" size={64} color={Colors.textTertiary} />
        <Text style={styles.errorTitle}>Location Unavailable</Text>
        <Text style={styles.errorSubtitle}>
          We need access to your location to find nearby hospitals and emergency centers. Please
          enable location services in your device settings.
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.replace('/(app)/(tabs)/hospitals')}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onPress={() => setSelectedHospital(null)} // Deselect when tapping the map
      >
        {hospitals.map((hospital) => (
          <Marker
            key={hospital.id}
            coordinate={{ latitude: hospital.latitude, longitude: hospital.longitude }}
            title={hospital.name}
            description={hospital.address}
            onPress={(e) => {
              e.stopPropagation();
              setSelectedHospital(hospital);
            }}
          >
            <View style={styles.markerContainer}>
              <MaterialCommunityIcons
                name="hospital-marker"
                size={36}
                color={hospital.hasEmergencyRoom ? Colors.danger : Colors.primary}
              />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Bottom Sheet Overlay for Selected Hospital */}
      {selectedHospital && (
        <View style={styles.bottomOverlay}>
          <HospitalCard
            hospital={selectedHospital}
            onPress={() => handleHospitalPress(selectedHospital)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  errorTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
  },
  errorSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.md,
    lineHeight: 22,
  },
  retryButton: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  retryButtonText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.surface,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: Spacing.base, // Since tab bar holds safe area, this sits just above the tab bar
    left: Spacing.base,
    right: Spacing.base,
  },
});

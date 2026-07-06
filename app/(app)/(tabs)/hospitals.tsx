import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Colors, Spacing, FontFamily, FontSize, BorderRadius } from '../../../src/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { hospitalsService } from '../../../src/services/api/hospitalsService';
import { Hospital } from '../../../src/types/medical.types';
import { HospitalCard } from '../../../src/components/cards/HospitalCard';
import { useTranslation } from 'react-i18next';

const USE_MOCK_MAP = true; // Temporary flag for Phase 1 without a real API key

export default function HospitalsScreen() {
  const { t } = useTranslation();
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
      } catch {
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
        <Text style={styles.loadingText}>
          {t('hospitals.locating_nearby_hospitals') || 'Locating nearby hospitals...'}
        </Text>
      </View>
    );
  }

  if (locationStatus !== 'granted' || !userLocation) {
    return (
      <View style={styles.centerContainer}>
        <MaterialCommunityIcons name="map-marker-off" size={64} color={Colors.textTertiary} />
        <Text style={styles.errorTitle}>
          {t('hospitals.location_unavailable') || 'Location Unavailable'}
        </Text>
        <Text style={styles.errorSubtitle}>
          {t('hospitals.we_need_access_to_your_locatio') ||
            `We need access to your location to find nearby hospitals and emergency centers. Please
                          enable location services in your device settings.`}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.replace('/(app)/(tabs)/hospitals')}
        >
          <Text style={styles.retryButtonText}>{t('hospitals.retry') || 'Retry'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderMap = () => {
    if (USE_MOCK_MAP) {
      return (
        <ImageBackground
          source={require('../../../assets/images/map_placeholder.png')}
          style={styles.map}
          resizeMode="cover"
        >
          {hospitals.map((hospital, index) => {
            const topPositions = ['25%', '45%', '65%'];
            const leftPositions = ['40%', '60%', '20%'];

            return (
              <TouchableOpacity
                key={hospital.id}
                style={[
                  styles.mockMarker,
                  { top: topPositions[index % 3] as any, left: leftPositions[index % 3] as any },
                ]}
                onPress={() => setSelectedHospital(hospital)}
              >
                <View style={styles.markerContainer}>
                  <MaterialCommunityIcons
                    name="hospital-marker"
                    size={42}
                    color={hospital.hasEmergencyRoom ? Colors.danger : Colors.primary}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </ImageBackground>
      );
    }

    return (
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
        onPress={() => setSelectedHospital(null)}
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
    );
  };

  return (
    <View style={styles.container}>
      {renderMap()}

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
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  mockMarker: {
    position: 'absolute',
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: Spacing.base,
    left: Spacing.base,
    right: Spacing.base,
  },
});

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontFamily, FontSize, BorderRadius } from '../../../src/theme';
import { hospitalsService } from '../../../src/services/api/hospitalsService';
import { Hospital } from '../../../src/types/medical.types';
import { Doctor } from '../../../src/services/api/doctorsService';
import { DoctorCard } from '../../../src/components/cards/DoctorCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

export default function HospitalDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (!id) throw new Error('No hospital ID provided');

        const details = await hospitalsService.getHospitalDetails(id);
        setHospital(details.hospital);
        setDoctors(details.doctors);
      } catch {
        setError('Failed to load hospital details. Please check your connection.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error || !hospital) {
    return (
      <View style={styles.centerContainer}>
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color={Colors.danger} />
        <Text style={styles.errorText}>{error || 'Hospital not found.'}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>{t('[id].go_back') || 'Go Back'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.imageContainer}>
        {hospital.imageUrl ? (
          <Image source={{ uri: hospital.imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <MaterialCommunityIcons name="hospital-building" size={48} color={Colors.primary} />
          </View>
        )}

        {/* Back Button Overlay */}
        <TouchableOpacity
          style={[styles.floatingBackButton, { top: insets.top + Spacing.sm }]}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{hospital.name}</Text>

        <View style={styles.row}>
          <MaterialCommunityIcons name="map-marker" size={16} color={Colors.textSecondary} />
          <Text style={styles.address}>{hospital.address}</Text>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons name="phone" size={16} color={Colors.textSecondary} />
          <Text style={styles.contact}>{hospital.contactNumber}</Text>
        </View>

        {hospital.emergencyNumber && (
          <View style={styles.row}>
            <MaterialCommunityIcons name="ambulance" size={16} color={Colors.danger} />
            <Text style={[styles.contact, { color: Colors.danger }]}>
              {hospital.emergencyNumber} {t('[id].er') || '(ER)'}
            </Text>
          </View>
        )}

        <View style={styles.tagsContainer}>
          {hospital.hasEmergencyRoom && (
            <View style={[styles.tag, styles.emergencyTag]}>
              <Text style={styles.emergencyTagText}>
                {t('[id].er_available') || 'ER Available'}
              </Text>
            </View>
          )}
          {hospital.isOpen24x7 && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{t('[id].24x7_open') || '24x7 Open'}</Text>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>
          {t('[id].affiliated_doctors') || 'Affiliated Doctors'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlashList
        data={doctors}
        renderItem={({ item }) => <DoctorCard doctor={item} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xl }}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.base }} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {t('[id].no_doctors_currently_listed_fo') ||
                'No doctors currently listed for this hospital.'}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  backButton: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  backButtonText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.surface,
  },
  floatingBackButton: {
    position: 'absolute',
    left: Spacing.base,
    backgroundColor: Colors.surface,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContainer: {
    backgroundColor: Colors.background,
  },
  imageContainer: {
    width: '100%',
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: Colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    marginTop: -20, // Overlap the image slightly
  },
  name: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  address: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  contact: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  tag: {
    backgroundColor: Colors.tertiary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  tagText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.primary,
  },
  emergencyTag: {
    backgroundColor: Colors.danger,
  },
  emergencyTagText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.surface,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginTop: Spacing.base,
    marginBottom: Spacing.md,
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
});

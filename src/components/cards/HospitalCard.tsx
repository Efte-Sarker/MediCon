import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors, Spacing, BorderRadius, FontFamily, FontSize, Shadows } from '../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Hospital } from '../../types/medical.types';

interface HospitalCardProps {
  hospital: Hospital;
  onPress: () => void;
}

export const HospitalCard = ({ hospital, onPress }: HospitalCardProps): React.JSX.Element => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${hospital.name}`}
    >
      <View style={styles.imageContainer}>
        {hospital.imageUrl ? (
          <Image source={{ uri: hospital.imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <MaterialCommunityIcons name="hospital-building" size={32} color={Colors.primary} />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>
            {hospital.name}
          </Text>
          {hospital.distanceKm !== undefined && (
            <View style={styles.distanceBadge}>
              <MaterialCommunityIcons name="map-marker-distance" size={12} color={Colors.primary} />
              <Text style={styles.distanceText}>{hospital.distanceKm.toFixed(1)} km</Text>
            </View>
          )}
        </View>

        <Text style={styles.address} numberOfLines={2}>
          {hospital.address}
        </Text>

        <View style={styles.tagsContainer}>
          {hospital.hasEmergencyRoom && (
            <View style={[styles.tag, styles.emergencyTag]}>
              <MaterialCommunityIcons name="ambulance" size={12} color={Colors.surface} />
              <Text style={[styles.tagText, styles.emergencyTagText]}>ER</Text>
            </View>
          )}
          {hospital.isOpen24x7 && (
            <View style={styles.tag}>
              <MaterialCommunityIcons
                name="clock-time-four-outline"
                size={12}
                color={Colors.textSecondary}
              />
              <Text style={styles.tagText}>24x7</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    padding: Spacing.sm,
    marginBottom: Spacing.base,
    ...Shadows.sm,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginRight: Spacing.md,
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
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  name: {
    flex: 1,
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tertiary,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  distanceText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.primary,
  },
  address: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  tagText: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: Colors.textSecondary,
  },
  emergencyTag: {
    backgroundColor: Colors.danger,
  },
  emergencyTagText: {
    color: Colors.surface,
  },
});

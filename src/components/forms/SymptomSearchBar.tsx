import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontFamily, FontSize, BorderRadius } from '../../theme';

export function SymptomSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [pulseAnim] = useState(() => new Animated.Value(1));

  const handleMicPress = () => {
    if (isRecording) {
      setIsRecording(false);
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    } else {
      setIsRecording(true);
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start();

      // Mock setting some text after a delay if user doesn't stop it
      setTimeout(() => {
        setIsRecording(false);
        pulseAnim.stopAnimation();
        pulseAnim.setValue(1);
        setQuery('sharp chest pain');
      }, 3000);
    }
  };

  const handleSubmit = () => {
    if (query.trim()) {
      router.push({
        pathname: '/(app)/symptom/results',
        params: { q: query.trim() },
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <MaterialCommunityIcons
          name="magnify"
          size={24}
          color={Colors.textTertiary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={isRecording ? 'Listening...' : 'Search by symptoms...'}
          placeholderTextColor={isRecording ? Colors.primary : Colors.textTertiary}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} style={styles.clearButton}>
            <MaterialCommunityIcons name="close-circle" size={20} color={Colors.textTertiary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.micButton} onPress={handleMicPress} activeOpacity={0.7}>
          <Animated.View style={[styles.micIconContainer, { transform: [{ scale: pulseAnim }] }]}>
            <MaterialCommunityIcons
              name={isRecording ? 'stop-circle' : 'microphone'}
              size={20}
              color={isRecording ? Colors.danger : Colors.primary}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(64, 86, 109, 0.2)', // 0.2 opacity of Colors.textSecondary (#40566d)
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 58,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    height: '100%',
  },
  clearButton: {
    padding: Spacing.xs,
    marginRight: Spacing.xs,
  },
  micButton: {
    padding: Spacing.xs,
  },
  micIconContainer: {
    backgroundColor: Colors.tertiary,
    padding: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
});

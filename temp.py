import re
import sys

def main():
    try:
        with open('app/(app)/(tabs)/reports.tsx', 'r', encoding='utf-8') as f:
            content = f.read()

        # 1. Imports
        imports = '''import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
'''
        content = content.replace("import { MaterialCommunityIcons } from '@expo/vector-icons';", "import { MaterialCommunityIcons } from '@expo/vector-icons';\n" + imports)

        # 2. State & Toggle
        state = '''
  // Speed Dial FAB state
  const [isFabOpen, setIsFabOpen] = useState(false);
  const fabAnimation = React.useRef(new Animated.Value(0)).current;

  const toggleFab = () => {
    const toValue = isFabOpen ? 0 : 1;
    setIsFabOpen(!isFabOpen);
    Animated.spring(fabAnimation, {
      toValue,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handlePickImage = async () => {
    toggleFab();
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'You need to allow access to your photos to upload a report.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        router.push({
          pathname: '/(app)/report/upload',
          params: {
            uri: result.assets[0].uri,
            type: 'image',
            name: result.assets[0].fileName || `image-${Date.now()}.jpg`,
          },
        });
      }
    } catch (err) {
      Alert.alert('Error', String(err));
    }
  };

  const handlePickDocument = async () => {
    toggleFab();
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        if (!file.mimeType?.includes('pdf')) {
          Alert.alert('Unsupported File', 'Please upload a valid PDF document or Image.');
          return;
        }

        router.push({
          pathname: '/(app)/report/upload',
          params: {
            uri: file.uri,
            type: 'pdf',
            name: file.name,
          },
        });
      }
    } catch (err) {
      Alert.alert('Error', String(err));
    }
  };
'''

        content = content.replace("const [optionsVisible, setOptionsVisible] = useState(false);", state + "\n  const [optionsVisible, setOptionsVisible] = useState(false);")

        # 3. empty component upload button
        content = content.replace("onPress={() => router.push('/(app)/report/upload')}", "onPress={toggleFab}")

        # 4. Replace JSX FAB
        old_fab = '''      {/* Upload FAB */}
      {reports.length > 0 && (
        <TouchableOpacity
          style={[styles.fab, { bottom: Spacing.base + insets.bottom }]}
          onPress={toggleFab}
          accessibilityRole="button"
          accessibilityLabel="Upload a new report"
        >
          <MaterialCommunityIcons name="plus" size={24} color={Colors.primary} />
          <Text style={styles.fabText}>Upload</Text>
        </TouchableOpacity>
      )}'''

        new_fab = '''      {/* Upload FAB / Speed Dial */}
      {reports.length > 0 && (
        <>
          {isFabOpen && (
            <Animated.View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(255,255,255,0.85)', opacity: fabAnimation, zIndex: 9 }]}>
              <TouchableOpacity 
                style={StyleSheet.absoluteFillObject} 
                activeOpacity={1} 
                onPress={toggleFab} 
              />
            </Animated.View>
          )}
          <View style={[styles.speedDialContainer, { bottom: Spacing.base + insets.bottom }]}>
            <Animated.View style={[styles.miniFabContainer, { 
              opacity: fabAnimation, 
              transform: [{ translateY: fabAnimation.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
              pointerEvents: isFabOpen ? 'auto' : 'none'
            }]}>
              <TouchableOpacity style={styles.miniFab} onPress={handlePickDocument}>
                <Text style={styles.miniFabLabel}>Upload PDF</Text>
                <View style={[styles.miniFabIcon, { backgroundColor: '#FDECEE' }]}>
                   <MaterialCommunityIcons name="file-document" size={24} color={Colors.danger} />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.miniFab} onPress={handlePickImage}>
                <Text style={styles.miniFabLabel}>Gallery Image</Text>
                <View style={[styles.miniFabIcon, { backgroundColor: '#E3F2FD' }]}>
                   <MaterialCommunityIcons name="image" size={24} color={Colors.primary} />
                </View>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
              style={[styles.fab, isFabOpen && styles.fabOpen]}
              onPress={toggleFab}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={isFabOpen ? "Close menu" : "Upload a new report"}
            >
              <Animated.View style={{ transform: [{ rotate: fabAnimation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] }) }] }}>
                <MaterialCommunityIcons name="plus" size={24} color={isFabOpen ? Colors.surface : Colors.primary} />
              </Animated.View>
              {!isFabOpen && <Text style={styles.fabText}>Upload</Text>}
            </TouchableOpacity>
          </View>
        </>
      )}'''

        # We must use regex because we already replaced the onPress of the old fab
        # wait, if we replaced it, the string old_fab should reflect that, which it does now!
        content = content.replace(old_fab, new_fab)

        # 5. Styles
        old_styles = '''  fab: {
    position: 'absolute',
    right: Spacing.xl,
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.tertiary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  fabText: {
    marginLeft: Spacing.xs,
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },'''

        new_styles = '''  // ── Speed Dial FAB ──────────────────────────────────────────────────────
  speedDialContainer: {
    position: 'absolute',
    right: Spacing.xl,
    alignItems: 'flex-end',
    zIndex: 10,
  },
  miniFabContainer: {
    alignItems: 'flex-end',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  miniFab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  miniFabLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  miniFabIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  fab: {
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.tertiary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    height: 48,
  },
  fabOpen: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    paddingHorizontal: 0,
    width: 48,
    justifyContent: 'center',
  },
  fabText: {
    marginLeft: Spacing.xs,
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },'''

        content = content.replace(old_styles, new_styles)

        with open('app/(app)/(tabs)/reports.tsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print('Updated reports.tsx successfully.')
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()

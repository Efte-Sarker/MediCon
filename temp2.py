import re
import sys

def main():
    try:
        with open('app/(app)/(tabs)/reports.tsx', 'r', encoding='utf-8') as f:
            content = f.read()

        # 1. Replace JSX
        old_jsx = '''      {/* Upload FAB / Speed Dial */}
      {reports.length > 0 && (
        <>
          {isFabOpen && (
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: 'rgba(255,255,255,0.85)', opacity: fabAnimation, zIndex: 9 },
              ]}
            >
              <TouchableOpacity
                style={StyleSheet.absoluteFill}
                activeOpacity={1}
                onPress={toggleFab}
              />
            </Animated.View>
          )}
          <View style={[styles.speedDialContainer, { bottom: Spacing.base + insets.bottom }]}>
            <Animated.View
              style={[
                styles.miniFabContainer,
                {
                  opacity: fabAnimation,
                  transform: [
                    {
                      translateY: fabAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                  pointerEvents: isFabOpen ? 'auto' : 'none',
                },
              ]}
            >
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
              accessibilityLabel={isFabOpen ? 'Close menu' : 'Upload a new report'}
            >
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: fabAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '45deg'],
                      }),
                    },
                  ],
                }}
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={24}
                  color={isFabOpen ? Colors.surface : Colors.primary}
                />
              </Animated.View>
              {!isFabOpen && <Text style={styles.fabText}>Upload</Text>}
            </TouchableOpacity>
          </View>
        </>
      )}'''

        new_jsx = '''      {/* Upload FAB / Speed Dial */}
      {reports.length > 0 && (
        <>
          {isFabOpen && (
            <TouchableOpacity
              style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.85)', zIndex: 9 }]}
              activeOpacity={1}
              onPress={toggleFab}
            />
          )}
          <View style={[styles.speedDialContainer, { bottom: Spacing.base + insets.bottom }]}>
            {isFabOpen && (
              <View style={styles.miniFabContainer}>
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
              </View>
            )}

            <TouchableOpacity
              style={styles.fab}
              onPress={toggleFab}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={isFabOpen ? 'Close menu' : 'Upload a new report'}
            >
              <MaterialCommunityIcons
                name={isFabOpen ? "close" : "plus"}
                size={24}
                color={Colors.primary}
              />
              <Text style={styles.fabText}>{isFabOpen ? "Close" : "Upload"}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}'''
      
        content = content.replace(old_jsx, new_jsx)

        # 2. Replace Styles
        old_styles = '''  // ── Speed Dial FAB ──────────────────────────────────────────────────────
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
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    height: 56,
  },
  fabOpen: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    paddingHorizontal: 0,
    width: 56,
    borderRadius: 28,
    justifyContent: 'center',
  },
  fabText: {
    marginLeft: Spacing.xs,
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.primary,
  },'''

        new_styles = '''  // ── Speed Dial FAB ──────────────────────────────────────────────────────
  speedDialContainer: {
    position: 'absolute',
    right: Spacing.base,
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
  },
  miniFabIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.primary,
    height: 56,
    justifyContent: 'center',
  },
  fabText: {
    marginLeft: Spacing.xs,
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.primary,
  },'''

        content = content.replace(old_styles, new_styles)
        
        # 3. Clean up fabAnimation logic (we can remove the Animated imports and state if not needed, but we'll leave it for now in case other things use it or just to be safe)

        with open('app/(app)/(tabs)/reports.tsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print('Updated reports.tsx successfully.')
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()

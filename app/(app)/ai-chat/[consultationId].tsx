import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontFamily, FontSize, BorderRadius } from '../../../src/theme';
import { useLocalSearchParams } from 'expo-router';
import { useChatStore, ChatMessage } from '../../../src/store/chatStore';
import { ChatBubble } from '../../../src/components/medical/ChatBubble';
import { chatService } from '../../../src/services/ai/chatService';
import { AIDisclaimer } from '../../../src/components/medical/AIDisclaimer';
import { useTranslation } from 'react-i18next';

export default function ConsultationChatScreen() {
  const { t } = useTranslation();
  const { consultationId } = useLocalSearchParams<{ consultationId: string }>();
  const { conversations, addMessage, updateMessage, seedLongConversation } = useChatStore();
  const messages = conversations[consultationId] || [];

  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [activeStreamingId, setActiveStreamingId] = useState<string | null>(null);

  const flashListRef = useRef<any>(null);
  const [pulseAnim] = useState(() => new Animated.Value(1));

  const handleSend = async (text: string) => {
    if (!text.trim() || activeStreamingId) return;

    // Add user message
    addMessage(consultationId, text.trim(), 'user');
    setInputText('');
    // Add empty AI message placeholder
    const aiMessageId = addMessage(consultationId, '', 'ai');
    setActiveStreamingId(aiMessageId);

    try {
      const stream = chatService.streamResponse(consultationId, text.trim());
      let currentResponse = '';

      // eslint-disable-next-line @typescript-eslint/await-thenable
      for await (const chunk of stream) {
        currentResponse += chunk;
        updateMessage(consultationId, aiMessageId, currentResponse);
        // Scroll to bottom during streaming occasionally or on every chunk if it's smooth
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'NETWORK_ERROR') {
        // Fallback offline message for Tier 3 DoD
        updateMessage(
          consultationId,
          aiMessageId,
          'You appear to be offline. I cannot assist without a network connection. In an emergency, please use the offline protocols on the dashboard.',
        );
      } else {
        updateMessage(
          consultationId,
          aiMessageId,
          'Sorry, I encountered an error processing your request.',
        );
      }
    } finally {
      setActiveStreamingId(null);
    }
  };

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
        setInputText((prev) => prev + ' Hello, I have a headache.');
      }, 3000);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {t('[consultationid].medicon_ai_assistant') || 'MediCon AI Assistant'}
        </Text>
        {__DEV__ && (
          <TouchableOpacity
            onPress={() => seedLongConversation(consultationId)}
            style={styles.seedButton}
          >
            <MaterialCommunityIcons name="database-plus" size={20} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <AIDisclaimer />

      <View style={styles.listContainer}>
        <FlashList<ChatMessage>
          ref={flashListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBubble message={item} isTyping={item.id === activeStreamingId} />
          )}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => {
            if (messages.length > 0) {
              flashListRef.current?.scrollToEnd({ animated: true });
            }
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.micButton} onPress={handleMicPress} activeOpacity={0.7}>
            <Animated.View style={[styles.micIconContainer, { transform: [{ scale: pulseAnim }] }]}>
              <MaterialCommunityIcons
                name={isRecording ? 'stop-circle' : 'microphone'}
                size={24}
                color={isRecording ? Colors.danger : Colors.primary}
              />
            </Animated.View>
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder={isRecording ? 'Listening...' : 'Type a health question...'}
            placeholderTextColor={isRecording ? Colors.primary : Colors.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || activeStreamingId) && styles.sendButtonDisabled,
            ]}
            onPress={() => handleSend(inputText)}
            disabled={!inputText.trim() || !!activeStreamingId}
          >
            <MaterialCommunityIcons
              name="send"
              size={20}
              color={!inputText.trim() || activeStreamingId ? Colors.textTertiary : Colors.surface}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.tertiary,
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  seedButton: {
    padding: Spacing.xs,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.tertiary,
  },
  micButton: {
    padding: Spacing.xs,
    marginRight: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  micIconContainer: {
    backgroundColor: Colors.background,
    padding: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.tertiary,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
    marginBottom: 4,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.tertiary,
  },
});

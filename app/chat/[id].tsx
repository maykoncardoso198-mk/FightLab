import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors, Fonts, Radius, Spacing } from '../../constants';
import { useTrainerById } from '../../hooks/useTrainers';
import { ChatMessage, mockChatMessages } from '../../data';

const STUDENT_ID = 'u1';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const trainer = useTrainerById(id);
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [draft, setDraft] = useState('');
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: false }), 100);
  }, []);

  if (!trainer) return null;

  const send = () => {
    if (!draft.trim()) return;
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    const msg: ChatMessage = {
      id: `m${Date.now()}`,
      senderId: STUDENT_ID,
      text: draft.trim(),
      timestamp: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setMessages((prev) => [...prev, msg]);
    setDraft('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);

    setTimeout(() => {
      const reply: ChatMessage = {
        id: `m${Date.now() + 1}`,
        senderId: trainer.id,
        text: 'Recebido! Vamos alinhar tudo na aula.',
        timestamp: new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, reply]);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
    }, 1300);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10} style={styles.back}>
            <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
          </Pressable>
          <Image source={{ uri: trainer.photo }} style={styles.avatar} contentFit="cover" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.name} numberOfLines={1}>
              {trainer.name}
            </Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.status}>Online · {trainer.primaryModality}</Text>
            </View>
          </View>
          <Pressable hitSlop={10} style={styles.iconBtn}>
            <Ionicons name="call" size={18} color={Colors.textPrimary} />
          </Pressable>
          <Pressable hitSlop={10} style={[styles.iconBtn, { marginLeft: 6 }]}>
            <Ionicons name="ellipsis-vertical" size={18} color={Colors.textPrimary} />
          </Pressable>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.messagesContainer}
          renderItem={({ item, index }) => {
            const fromMe = item.senderId === STUDENT_ID;
            const prev = messages[index - 1];
            const showAvatar = !fromMe && (!prev || prev.senderId !== item.senderId);
            return (
              <View
                style={[styles.bubbleRow, fromMe && { justifyContent: 'flex-end' }]}
              >
                {!fromMe && (
                  <View style={{ width: 28, marginRight: 8 }}>
                    {showAvatar && (
                      <Image source={{ uri: trainer.photo }} style={styles.bubbleAvatar} />
                    )}
                  </View>
                )}
                <View style={[styles.bubble, fromMe ? styles.bubbleMe : styles.bubbleThem]}>
                  <Text style={[styles.bubbleText, fromMe && { color: Colors.textPrimary }]}>
                    {item.text}
                  </Text>
                  <Text
                    style={[
                      styles.bubbleTime,
                      fromMe && { color: 'rgba(255,255,255,0.7)' },
                    ]}
                  >
                    {item.timestamp}
                    {fromMe && '  ✓✓'}
                  </Text>
                </View>
              </View>
            );
          }}
          ListHeaderComponent={
            <View style={styles.dateChip}>
              <Text style={styles.dateChipText}>HOJE</Text>
            </View>
          }
        />

        <View style={styles.composer}>
          <Pressable hitSlop={6} style={styles.attachBtn}>
            <Ionicons name="add" size={22} color={Colors.textPrimary} />
          </Pressable>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Mensagem..."
            placeholderTextColor={Colors.textMuted}
            style={styles.input}
            multiline
          />
          <Pressable
            onPress={send}
            disabled={!draft.trim()}
            style={[styles.sendBtn, !draft.trim() && { opacity: 0.4 }]}
          >
            <Ionicons name="arrow-up" size={20} color={Colors.textPrimary} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screen,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  back: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.skeleton,
  },
  name: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  status: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 11,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  messagesContainer: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    gap: 6,
  },
  dateChip: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  dateChipText: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.4,
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 2,
  },
  bubbleAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.skeleton,
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
    borderRadius: Radius.lg,
  },
  bubbleThem: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  bubbleMe: {
    backgroundColor: Colors.red,
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 14,
    lineHeight: 19,
  },
  bubbleTime: {
    color: Colors.textMuted,
    fontFamily: Fonts.bodyMedium,
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.base,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    gap: 8,
    backgroundColor: Colors.background,
  },
  attachBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 14,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import React, { useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { Icon } from '../../components/app/Icon';
import { ReadDeckCardItem } from '../../components/read/ReadDeckCard';

type RouteProps = RouteProp<MainStackParamList, 'ReadArticleDetail'>;
type NavProps = NativeStackNavigationProp<MainStackParamList>;

function formatReadTimeLabel(readTime: string): string {
  const t = readTime.trim();
  if (!t || t === '—') return '—';
  if (/read/i.test(t)) return t;
  return `${t} read`;
}

export const ReadArticleDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavProps>();
  const route = useRoute<RouteProps>();
  const article = route.params?.article;

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    const onBackPress = () => {
      handleBack();
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [handleBack]);

  if (!article) return null;

  const paragraphs = article.content
    ? article.content.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)
    : [];

  return (
    <View style={styles.screenRoot}>
      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.8}>
          <Icon name="arrow-left" size={18} color="#4A4A4A" />
          <Text style={styles.backText}>Back to Read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Article Header Block */}
        <View style={styles.headerBlock}>
          <Text style={styles.articleTitle}>{article.title}</Text>

          {Boolean(article.subtitle) && (
            <Text style={styles.articleSubtitle}>{article.subtitle}</Text>
          )}

          <View style={styles.metadataRow}>
            {Boolean(article.category) && (
              <View style={styles.categoryPill}>
                <Text style={styles.categoryPillText}>{article.category}</Text>
              </View>
            )}
            <View style={styles.readTimePill}>
              <Icon name="book-open" size={13} color="#6B6B6B" />
              <Text style={styles.readTimePillText}>
                {formatReadTimeLabel(article.readTime)}
              </Text>
            </View>
          </View>

          <View style={styles.dividerLine} />
        </View>

        {/* Article Body */}
        <View style={styles.bodyContainer}>
          {paragraphs.map((para, idx) => (
            <Text key={idx} style={styles.paragraphText}>
              {para}
            </Text>
          ))}
        </View>

        <View style={styles.endMarkerContainer}>
          <View style={styles.endMarkerDot} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: '#F9F8F3',
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 56 : 44,
    paddingBottom: 12,
    backgroundColor: '#F9F8F3',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A4A4A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 50,
  },
  headerBlock: {
    marginBottom: 8,
  },
  articleTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 30,
    fontWeight: '700',
    color: '#111111',
    lineHeight: 37,
    letterSpacing: -0.4,
    marginBottom: 12,
  },
  articleSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6B6B6B',
    lineHeight: 24,
    marginBottom: 16,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D8D4CC',
    backgroundColor: 'transparent',
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B6B6B',
  },
  readTimePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D8D4CC',
    backgroundColor: 'transparent',
  },
  readTimePillText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B6B6B',
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#E4E0D8',
    marginBottom: 24,
  },
  bodyContainer: {
    gap: 20,
    marginBottom: 40,
  },
  paragraphText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333333',
    lineHeight: 28,
  },
  endMarkerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  endMarkerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C8C4BC',
  },
});

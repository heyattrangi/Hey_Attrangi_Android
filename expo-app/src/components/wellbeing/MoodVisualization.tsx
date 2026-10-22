import React from 'react';
import { StyleSheet, View, Text, Image, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export interface MoodSegment {
  label: 'Good' | 'Great' | 'Low' | 'Meh' | 'Okay' | string;
  value: number;
  color: string;
  image?: string;
}

export interface MoodVisualizationProps {
  moods?: MoodSegment[];
  averageMood?: number;
  isMonthEmpty?: boolean;
}

const CLOUDINARY_FACES: Record<string, string> = {
  Good: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786730633/Good-emotion_jimbfs.png',
  Great: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786730630/Great-emotion_rbwtzb.png',
  Low: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786730629/Low-emotion_vbpanv.png',
  Meh: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786730630/Meh-emotion_nozhzi.png',
  Okay: 'https://res.cloudinary.com/dxoiluua8/image/upload/v1786730633/Okay-emotion_sscj34.png',
};

const MOOD_COLORS: Record<string, string> = {
  Okay: '#FFD5B7',
  Good: '#CEF8A4',
  Great: '#FCE5AF',
  Meh: '#C2DDF8',
  Low: '#E9C9FF',
};

// SVG Canvas Geometry matching Web App (components/wellbeing/MoodVisualization.tsx)
const CX = 120;
const CY = 120;
const RADIUS = 88;
const STROKE_WIDTH = 32;

function getArcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  let start = startAngle;
  let end = endAngle;
  if (end - start < 0.1) {
    end = start + 0.1;
  }
  const radStart = (start * Math.PI) / 180;
  const radEnd = (end * Math.PI) / 180;

  const x1 = cx + r * Math.cos(radStart);
  const y1 = cy + r * Math.sin(radStart);
  const x2 = cx + r * Math.cos(radEnd);
  const y2 = cy + r * Math.sin(radEnd);

  const largeArcFlag = end - start <= 180 ? 0 : 1;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
}

const DEFAULT_MOODS: MoodSegment[] = [
  { label: 'Okay', value: 0, color: '#FFD5B7', image: CLOUDINARY_FACES.Okay },
  { label: 'Good', value: 0, color: '#CEF8A4', image: CLOUDINARY_FACES.Good },
  { label: 'Great', value: 0, color: '#FCE5AF', image: CLOUDINARY_FACES.Great },
  { label: 'Meh', value: 0, color: '#C2DDF8', image: CLOUDINARY_FACES.Meh },
  { label: 'Low', value: 0, color: '#E9C9FF', image: CLOUDINARY_FACES.Low },
];

export const MoodVisualization: React.FC<MoodVisualizationProps> = ({
  moods = DEFAULT_MOODS,
  averageMood = 0.0,
  isMonthEmpty = false,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const cardWidth = Math.min(windowWidth - 80, 240);
  const scale = cardWidth / 240;

  const totalCheckIns = moods.reduce((acc, curr) => acc + (curr.value || 0), 0);

  /*
   * EMPTY STATE (Ported 1:1 from Web App components/wellbeing/MoodVisualization.tsx)
   */
  if (isMonthEmpty || totalCheckIns === 0) {
    const startAngle = 105;
    const endAngle = 435;
    const capAngle = ((STROKE_WIDTH / 2) / RADIUS) * (180 / Math.PI);
    const d = getArcPath(CX, CY, RADIUS, startAngle + capAngle, endAngle - capAngle);

    return (
      <View style={styles.container}>
        <View
          style={{
            width: cardWidth,
            height: cardWidth,
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Svg viewBox="0 0 240 240" style={StyleSheet.absoluteFill}>
            <Path
              d={d}
              fill="none"
              stroke="#9CA3AF"
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              opacity={0.8}
            />
          </Svg>

          <View style={styles.centerContent} pointerEvents="none">
            <Text style={styles.emptyScoreText}>0</Text>
            <Text style={styles.emptyLabelText}>Check in</Text>
          </View>
        </View>

        <Text style={styles.insufficientDataText}>Insufficient Data</Text>
      </View>
    );
  }

  /*
   * DYNAMIC SEGMENT CALCULATION (Ported 1:1 from Web App components/wellbeing/MoodVisualization.tsx)
   */
  const order = ['Good', 'Great', 'Low', 'Meh', 'Okay'];
  const orderedMoods = [...moods].sort(
    (a, b) => order.indexOf(a.label) - order.indexOf(b.label)
  );

  const nonZeroSegments = orderedMoods.filter((m) => (m.value || 0) > 0).length;
  const gapAngle = nonZeroSegments > 1 ? 8 : 0;

  let currentAngle = -90; // Start at top center (-90 degrees)

  const segmentsData = orderedMoods.map((mood) => {
    const val = mood.value || 0;
    if (val === 0) {
      return { ...mood, d: '', emojiX: 0, emojiY: 0, visible: false };
    }

    const percentage = val / totalCheckIns;
    const angleSpan = percentage * 360;

    const startAngle = currentAngle + gapAngle / 2;
    const endAngle = currentAngle + angleSpan - gapAngle / 2;

    const midAngle = currentAngle + angleSpan / 2;
    const rad = (midAngle * Math.PI) / 180;
    const emojiX = CX + RADIUS * Math.cos(rad);
    const emojiY = CY + RADIUS * Math.sin(rad);

    const capAngle = ((STROKE_WIDTH / 2) / RADIUS) * (180 / Math.PI);
    let adjustedStart = startAngle + capAngle;
    let adjustedEnd = endAngle - capAngle;

    if (adjustedStart >= adjustedEnd) {
      const midAngleAdjusted = (startAngle + endAngle) / 2;
      adjustedStart = midAngleAdjusted - 0.1;
      adjustedEnd = midAngleAdjusted + 0.1;
    }

    const d = getArcPath(CX, CY, RADIUS, adjustedStart, adjustedEnd);

    currentAngle += angleSpan;

    return {
      ...mood,
      color: mood.color || MOOD_COLORS[mood.label] || '#CEF8A4',
      image: mood.image || CLOUDINARY_FACES[mood.label] || CLOUDINARY_FACES.Good,
      d,
      emojiX,
      emojiY,
      visible: true,
    };
  });

  return (
    <View style={styles.container}>
      <View
        style={{
          width: cardWidth,
          height: cardWidth,
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* SVG Arc Segments */}
        <Svg viewBox="0 0 240 240" style={StyleSheet.absoluteFill}>
          {segmentsData.map((seg, idx) => {
            if (!seg.visible || !seg.d) return null;
            return (
              <Path
                key={idx}
                d={seg.d}
                fill="none"
                stroke={seg.color}
                strokeWidth={STROKE_WIDTH}
                strokeLinecap="round"
              />
            );
          })}
        </Svg>

        {/* Floating Emotion Emojis */}
        {segmentsData.map((seg, idx) => {
          if (!seg.visible || !seg.image) return null;
          const leftPos = seg.emojiX * scale - 14;
          const topPos = seg.emojiY * scale - 14;

          return (
            <Image
              key={`emoji-${idx}`}
              source={{ uri: seg.image }}
              style={[
                styles.faceImage,
                {
                  left: leftPos,
                  top: topPos,
                },
              ]}
              resizeMode="contain"
            />
          );
        })}

        {/* Center Average Score & Label */}
        <View style={styles.centerContent} pointerEvents="none">
          <Text style={styles.scoreText}>
            {Number.isFinite(averageMood) ? averageMood.toFixed(1) : '0.0'}
          </Text>
          <Text style={styles.labelText}>Avg mood</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceImage: {
    position: 'absolute',
    width: 28,
    height: 28,
    zIndex: 10,
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#73A730',
    textAlign: 'center',
    lineHeight: 52,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
  },
  emptyScoreText: {
    fontSize: 54,
    fontWeight: '700',
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 58,
  },
  emptyLabelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E9AA6',
    textAlign: 'center',
    marginTop: 4,
  },
  insufficientDataText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8E9AA6',
    textAlign: 'center',
    marginTop: 12,
  },
});

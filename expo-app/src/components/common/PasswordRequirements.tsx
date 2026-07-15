import React, { memo, useEffect, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Icon } from '../app/Icon';
import { Colors, Typography, Spacing } from '../../theme';
import { hapticLight } from '../../utils/haptics';

interface PasswordRequirementsProps {
  password?: string;
}

const RULES = [
  {
    id: 'length',
    label: 'At least 8 characters',
    test: (p: string) => p.length >= 8,
  },
  {
    id: 'number',
    label: '1 number',
    test: (p: string) => /\d/.test(p),
  },
  {
    id: 'special',
    label: '1 special character',
    test: (p: string) => /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/;'`~]/.test(p),
  },
] as const;

/** Live password criteria — matches Design “Set your password” requirements list. */
export const PasswordRequirements = memo<PasswordRequirementsProps>(({
  password = '',
}) => {
  const prevMet = useRef<Record<string, boolean>>({});

  useEffect(() => {
    RULES.forEach((rule) => {
      const met = rule.test(password);
      if (met && !prevMet.current[rule.id]) {
        void hapticLight();
      }
      prevMet.current[rule.id] = met;
    });
  }, [password]);

  return (
    <View style={styles.container} accessibilityRole="summary">
      <Text style={styles.title}>Requirements:</Text>
      {RULES.map((rule) => {
        const met = rule.test(password);
        return (
          <Animated.View
            key={rule.id}
            entering={FadeIn.duration(200)}
            style={styles.row}
          >
            <View style={[styles.bullet, met && styles.bulletMet]}>
              {met ? <Icon name="check" size={11} color={Colors.white} /> : null}
            </View>
            <Text style={[styles.item, met && styles.itemMet]}>{rule.label}</Text>
          </Animated.View>
        );
      })}
    </View>
  );
});

PasswordRequirements.displayName = 'PasswordRequirements';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  title: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  bullet: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: Colors.borderDefault,
    marginRight: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  bulletMet: {
    borderColor: Colors.success,
    backgroundColor: Colors.success,
  },
  item: {
    ...Typography.caption,
    color: Colors.textSecondary,
    flex: 1,
  },
  itemMet: {
    color: Colors.success,
    fontWeight: '600',
  },
});

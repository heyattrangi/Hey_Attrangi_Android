import React from 'react';
import { FlatList, FlatListProps, Platform } from 'react-native';
import { Performance } from '../../platform/Performance';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export type OptimizedFlatListProps<ItemT> = FlatListProps<ItemT>;

/**
 * FlatList with production defaults (windowing, batching).
 * Swap to FlashList when `@shopify/flash-list` is added to a custom binary.
 */
export function OptimizedFlatList<ItemT>(props: OptimizedFlatListProps<ItemT>) {
  const reduceMotion = useReducedMotion();
  const {
    initialNumToRender = Performance.listDefaults.initialNumToRender,
    maxToRenderPerBatch = Performance.listDefaults.maxToRenderPerBatch,
    windowSize = Performance.listDefaults.windowSize,
    removeClippedSubviews = Platform.OS === 'android'
      ? Performance.listDefaults.removeClippedSubviews
      : false,
    keyExtractor,
    ...rest
  } = props;

  return (
    <FlatList
      initialNumToRender={initialNumToRender}
      maxToRenderPerBatch={maxToRenderPerBatch}
      windowSize={windowSize}
      removeClippedSubviews={removeClippedSubviews}
      keyExtractor={
        keyExtractor ??
        ((item: ItemT, index) => {
          if (
            item &&
            typeof item === 'object' &&
            'id' in item &&
            (item as { id?: string }).id != null
          ) {
            return String((item as { id: string }).id);
          }
          return `row-${index}`;
        })
      }
      decelerationRate={reduceMotion ? 'fast' : 'normal'}
      {...rest}
    />
  );
}

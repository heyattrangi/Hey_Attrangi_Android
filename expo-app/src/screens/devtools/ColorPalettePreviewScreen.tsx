import React, { useEffect, useMemo } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import { GallerySection, TokenSwatch } from '../../components/devtools';
import { useDevToolsStore } from '../../store/devToolsStore';
import { MainStackParamList } from '../../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    'ColorPalettePreview'
  >;
};

export const ColorPalettePreviewScreen: React.FC<Props> = ({ navigation }) => {
  const swatches = useDevToolsStore((s) => s.snapshot?.colorSwatches ?? []);
  const loadSnapshot = useDevToolsStore((s) => s.loadSnapshot);

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  const groups = useMemo(() => {
    const map = new Map<string, typeof swatches>();
    for (const s of swatches) {
      const list = map.get(s.group) ?? [];
      list.push(s);
      map.set(s.group, list);
    }
    return map;
  }, [swatches]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Color Palette"
        subtitle="Brand + semantic tokens"
        onBack={() => navigation.goBack()}
      />
      {Array.from(groups.entries()).map(([group, items]) => (
        <GallerySection key={group} title={group}>
          {items.map((item) => (
            <TokenSwatch key={item.token} token={item.token} hex={item.hex} />
          ))}
        </GallerySection>
      ))}
    </AppScreen>
  );
};

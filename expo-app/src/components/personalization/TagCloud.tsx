import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TagChip } from './TagChip';

interface TagCloudProps {
  tags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
}

export const TagCloud: React.FC<TagCloudProps> = ({
  tags,
  selectedTags,
  onToggleTag,
}) => {
  return (
    <View style={styles.cloud}>
      {tags.map((tag) => (
        <TagChip
          key={tag}
          label={tag}
          selected={selectedTags.includes(tag)}
          onPress={() => onToggleTag(tag)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  cloud: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 12,
  },
});

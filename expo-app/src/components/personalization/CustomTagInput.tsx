import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput } from '../common/TextInput';

interface CustomTagInputProps {
  onAddTag: (tag: string) => void;
}

export const CustomTagInput: React.FC<CustomTagInputProps> = ({ onAddTag }) => {
  const [text, setText] = useState('');

  const handleChangeText = (val: string) => {
    if (val.endsWith(',') || val.endsWith('\n')) {
      const cleanTag = val.replace(/,|\n/g, '').trim();
      if (cleanTag) {
        onAddTag(cleanTag);
      }
      setText('');
    } else {
      setText(val);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Add custom tags"
        value={text}
        onChangeText={handleChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

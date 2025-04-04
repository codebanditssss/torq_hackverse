import React from 'react';
import { Button as PaperButton, ButtonProps } from 'react-native-paper';

export function Button(props: ButtonProps) {
  return (
    <PaperButton
      mode="contained"
      {...props}
      style={[
        {
          marginVertical: 8,
          borderRadius: 8,
        },
        props.style,
      ]}
    />
  );
}

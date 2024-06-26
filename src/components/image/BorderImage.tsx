import React, {useState} from 'react';

import {StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useAppTheme} from '../../utils/theme';

export interface BorderImage {
  source: any;
  dimension?: number;
  cricular?: boolean;
  borderColor?: string;
}

const NoImageAvailable = require('../../assets/noImage.png');

export const BorderImage: React.FC<BorderImage> = ({
  source,
  dimension = 96,
  cricular = false,
  borderColor,
}) => {
  const theme = useAppTheme();
  const [imageSource, setImageSource] = useState(source);
  const styles = makeStyles(theme.colors, cricular, dimension, borderColor);
  return (
    <FastImage
      resizeMode={FastImage.resizeMode.contain}
      source={imageSource}
      style={{...styles.imageContainer, width: dimension, height: dimension}}
      onError={() => setImageSource(NoImageAvailable)}
    />
  );
};

const makeStyles = (
  colors: any,
  cricular: boolean,
  dimension: number,
  borderColor: string | undefined,
) =>
  StyleSheet.create({
    imageContainer: {
      alignSelf: 'center',
      borderRadius: cricular ? dimension / 2 : 8,
      marginRight: 8,
      borderColor: borderColor ? borderColor : colors.neutral100,
      borderWidth: borderColor ? 2 : 1,
    },
  });

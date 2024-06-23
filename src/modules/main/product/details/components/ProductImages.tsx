import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import PagerView from 'react-native-pager-view';
import {BorderImage} from '../../../../../components/image/BorderImage';
import {useAppTheme} from '../../../../../utils/theme';

interface ProductImages {
  images: any[];
  roundedCorner?: boolean;
  fbProduct?: boolean;
}

const ProductImages: React.FC<ProductImages> = ({
  images,
  roundedCorner = false,
  fbProduct = false,
}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  const [selectedMediaPosition, setSelectedMediaPosition] = useState(0);

  return (
    <View style={styles.pagerContainer}>
      <PagerView
        onPageSelected={({nativeEvent: {position}}) =>
          setSelectedMediaPosition(position)
        }
        style={styles.pager}
        initialPage={0}>
        {images?.map((uri, index) => (
          <BorderImage key={`${index}image`} source={{uri}} dimension={350} />
        ))}
      </PagerView>
      <View style={styles.pageIndicator}>
        {images.map((item, index) => (
          <View
            key={`${index}dot`}
            style={
              index === selectedMediaPosition ? styles.selectedDot : styles.dot
            }
          />
        ))}
      </View>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    image: {
      width: '100%',
      objectFit: 'contain',
      alignSelf: 'center',
    },
    pagerContainer: {backgroundColor: 'white', paddingBottom: 8},
    pager: {
      zIndex: 999,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    fbImage: {
      height: 220,
    },
    otherImage: {
      height: 400,
    },
    pageIndicator: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      bottom: 0,
      marginTop: 16,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
      backgroundColor: colors.neutral100,
    },
    selectedDot: {
      width: 24,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
      backgroundColor: colors.primary,
    },
    roundedCorner: {
      borderRadius: 8,
    },
  });

export default ProductImages;

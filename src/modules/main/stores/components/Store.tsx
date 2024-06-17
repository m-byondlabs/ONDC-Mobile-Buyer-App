import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Text} from 'react-native-paper';

import {useAppTheme} from '../../../../utils/theme';

interface StoreImage {
  source: any;
}

const NoImageAvailable = require('../../../../assets/noImage.png');

const StoreImage: React.FC<StoreImage> = ({source}) => {
  const theme = useAppTheme();
  const [imageSource, setImageSource] = useState(source);
  const styles = makeStyles(theme.colors);

  return (
    <FastImage
      resizeMode={FastImage.resizeMode.contain}
      source={imageSource}
      style={styles.brandImage}
      onError={() => setImageSource(NoImageAvailable)}
    />
  );
};

const Store = ({store}: {store: any}) => {
  const navigation = useNavigation<any>();
  const {colors} = useAppTheme();
  const styles = makeStyles(colors);

  const navigateToDetails = (location: any) => {
    const routeParams: any = {
      brandId: location.provider,
    };
    routeParams.outletId = location.id;
    navigation.navigate('BrandDetails', routeParams);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigateToDetails(store)}>
      <StoreImage
        source={
          store?.provider_descriptor?.images?.length > 0
            ? {uri: store?.provider_descriptor?.images[0]}
            : NoImageAvailable
        }
      />
      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode={'tail'}>
          {store?.provider_descriptor?.name}
        </Text>
        <Text style={styles.details} numberOfLines={1} ellipsizeMode={'tail'}>
          {store?.categories?.join(', ')}
        </Text>
        <Text style={styles.details} numberOfLines={1} ellipsizeMode={'tail'}>
          {store?.address?.street}, {store?.address?.locality}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: 10,
    },
    brandImage: {
      borderRadius: 8,
      width: 96,
      height: 96,
      marginRight: 8,
      borderColor: colors.neutral100,
      borderWidth: 1,
    },
    name: {
      color: colors.neutral400,
      fontSize: 16,
      fontWeight: 'bold',
    },
    details: {
      color: colors.neutral400,
      fontSize: 12,
    },
    textContainer: {
      flexDirection: 'column',
    },
  });

export default Store;

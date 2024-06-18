import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';

import {BorderImage} from '../../../../components/image/BorderImage';
import {useAppTheme} from '../../../../utils/theme';

export type StoreModel = {
  id: string;
  name: string;
  categories: string[];
  iconUrl?: string;
  address: {
    street: string;
    locality: string;
  };
};

const StoreSummary = ({store}: {store: StoreModel}) => {
  const {colors} = useAppTheme();
  const styles = makeStyles(colors);

  return (
    <View style={styles.textContainer}>
      <Text style={styles.name} numberOfLines={1} ellipsizeMode={'tail'}>
        {store.name}
      </Text>
      <Text style={styles.details} numberOfLines={1} ellipsizeMode={'tail'}>
        {store?.categories?.join(', ')}
      </Text>
      <Text style={styles.details} numberOfLines={1} ellipsizeMode={'tail'}>
        {store?.address?.street}, {store?.address?.locality}
      </Text>
    </View>
  );
};

const NoImageAvailable = require('../../../../assets/noImage.png');

const Store = ({store, width = 96}: {store: StoreModel; width: number}) => {
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
      <BorderImage
        dimension={width}
        source={store.iconUrl ? {uri: store.iconUrl} : NoImageAvailable}
      />
      <StoreSummary store={store} />
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

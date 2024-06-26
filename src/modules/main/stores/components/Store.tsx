import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {BorderImage} from '../../../../components/image/BorderImage';
import {useAppTheme} from '../../../../utils/theme';

export type StoreModel = {
  id: string;
  brandId: string;
  name: string;
  categories: string[];
  iconUrl?: string;
  address: {
    street: string;
    locality: string;
  };
  searchQuery?: string;
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

  const navigateToDetails = () => {
    const routeParams: any = {
      brandId: store.brandId,
    };
    routeParams.outletId = store.id;
    routeParams.defaultSearchQuery = store.searchQuery;
    navigation.navigate('BrandDetails', routeParams);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigateToDetails()}>
      <View style={styles.summaryContainer}>
        <BorderImage
          dimension={width}
          source={store.iconUrl ? {uri: store.iconUrl} : NoImageAvailable}
        />
        <StoreSummary store={store} />
      </View>
      <Icon name={'arrow-forward'} size={28} color={colors.primary} />
    </TouchableOpacity>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingTop: 8,
      paddingBottom: 8,
      justifyContent: 'space-between',
    },
    summaryContainer: {
      width: '80%',
      flexDirection: 'row',
      alignItems: 'flex-start',
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
      flex: 1,
      paddingLeft: 8,
    },
  });

export default Store;

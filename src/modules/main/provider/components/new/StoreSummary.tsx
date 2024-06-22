import React from 'react';
import {useTranslation} from 'react-i18next';
import {Linking, Platform, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {BorderImage} from '../../../../../components/image/BorderImage';
import BrandSkeleton from '../../../../../components/skeleton/BrandSkeleton';
import {useAppTheme} from '../../../../../utils/theme';

interface StoreSummary {
  provider: any;
  outlet: any;
  apiRequested: boolean;
}

const NoImageAvailable = require('../../../../../assets/noImage.png');

const StoreSummary: React.FC<StoreSummary> = ({
  provider,
  outlet,
  apiRequested,
}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  const getDirection = async () => {
    const url =
      Platform.OS === 'android'
        ? `geo:0,0?q=${outlet?.gps[0]}+${outlet?.gps[1]}`
        : `maps:0,0?q=${outlet?.gps[0]}+${outlet?.gps[1]}`;
    await Linking.openURL(url);
  };

  const callProvider = () => Linking.openURL('tel:+91 92729282982');

  if (apiRequested) {
    return <BrandSkeleton />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.details}>
        <Text variant={'titleLarge'} style={styles.title}>
          {provider?.descriptor?.name}
        </Text>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={20} color="#FFD700" />
          <Text variant="titleLarge" style={styles.rating}>
            4.3
          </Text>
          <Text style={styles.dot}> · </Text>
          <Text
            variant="titleSmall"
            style={styles.shopperCount}
            ellipsizeMode={'tail'}
            numberOfLines={1}>
            1000+ Shoppers
          </Text>
        </View>
        <View style={styles.locationContainer}>
          <Icon name="location-on" size={20} color={theme.colors.neutral250} />
          <Text style={styles.distance}>1.6 km</Text>
          <Text style={styles.dot}> · </Text>
          <Text
            style={styles.shopperCount}
            ellipsizeMode={'tail'}
            numberOfLines={1}>
            {outlet?.address?.street || 'NA'}
          </Text>
        </View>
        <View style={styles.locationContainer}>
          <Icon
            name="query-builder"
            size={20}
            color={theme.colors.neutral250}
          />
          <Text style={styles.distance}>60-90 mins</Text>
          <Text style={styles.dot}> </Text>
        </View>
      </View>
      <BorderImage
        source={
          provider?.descriptor?.symbol
            ? {uri: provider?.descriptor?.symbol}
            : NoImageAvailable
        }
        dimension={72}
      />
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    details: {
      flex: 1,
    },
    title: {
      paddingLeft: 5,
      marginBottom: 5,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    rating: {
      marginLeft: 5,
    },
    shopperCount: {
      fontSize: 16,
      color: colors.neutral300,
      flex: 1,
      marginRight: 16,
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    distance: {
      marginLeft: 5,
      fontSize: 16,
      color: colors.neutral300,
    },
    dot: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.neutral200,
    },
    location: {
      fontSize: 16,
    },
    icon: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    brandImage: {
      height: 268,
      backgroundColor: colors.black,
    },
    brandDetails: {
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    borderBottom: {
      backgroundColor: colors.neutral100,
      height: 1,
      marginTop: 24,
    },
    address: {
      color: colors.neutral300,
      marginBottom: 12,
    },
    open: {
      color: colors.success600,
    },
    timing: {
      color: colors.neutral300,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 28,
    },
    separator: {
      width: 16,
    },
    actionButton: {
      borderRadius: 8,
      borderWidth: 1,
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderColor: colors.primary,
    },
    getDirection: {
      borderColor: colors.error400,
    },
    buttonText: {
      color: colors.primary,
    },
    getDirectionText: {
      color: colors.error400,
    },
  });

export default StoreSummary;

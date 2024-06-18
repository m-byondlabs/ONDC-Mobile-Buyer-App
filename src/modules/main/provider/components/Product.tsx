import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import {BorderImage} from '../../../../components/image/BorderImage';
import VegNonVegTag from '../../../../components/products/VegNonVegTag';
import useFormatNumber from '../../../../hooks/useFormatNumber';
import {CURRENCY_SYMBOLS, FB_DOMAIN} from '../../../../utils/constants';
import {useAppTheme} from '../../../../utils/theme';

export interface Product {
  product: ProductModel;
  search?: boolean;
}

const NoImageAvailable = require('../../../../assets/noImage.png');

export type ProductModel = {
  id: string;
  name: string;
  unitizedValue: string;
  price: string;
  currency: string;
  imageUrl?: string;
  search?: boolean;
  domain: string;
  tags: string[];
};

const Product: React.FC<Product> = (productModel: Product) => {
  const {product, search} = productModel;

  const {formatNumber} = useFormatNumber();
  const isFBDomain = product.domain === FB_DOMAIN;
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const navigateToProductDetails = () => {
    if (search) {
      const routeParams: any = {
        brandId: product.id,
      };
      navigation.navigate('BrandDetails', routeParams);
    } else {
      navigation.navigate('ProductDetails', {productId: product.id});
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={navigateToProductDetails}>
      <BorderImage
        source={
          product.imageUrl && product.imageUrl !== ''
            ? {uri: product.imageUrl}
            : NoImageAvailable
        }
        dimension={96}
      />
      {isFBDomain && (
        <View style={styles.vegNonVegContainer}>
          <VegNonVegTag tags={product.tags} />
        </View>
      )}
      <Text
        variant={'labelMedium'}
        numberOfLines={1}
        ellipsizeMode={'tail'}
        style={styles.name}>
        {product.name}
      </Text>
      {product.unitizedValue && (
        <Text
          variant={'labelSmall'}
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={styles.provider}>
          {product.unitizedValue}
        </Text>
      )}
      <View style={styles.row}>
        <Text variant={'bodyLarge'} style={styles.amount}>
          {CURRENCY_SYMBOLS[product.currency]}
          {formatNumber(product.price)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 8,
      flex: 1,
      marginBottom: 20,
    },
    gridImage: {
      width: 96,
      height: 96,
      borderRadius: 12,
      marginBottom: 12,
    },
    name: {
      color: colors.neutral400,
      marginBottom: 8,
    },
    provider: {
      color: colors.neutral300,
      marginBottom: 8,
    },
    amount: {
      color: colors.neutral400,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    vegNonVegContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      position: 'absolute',
      width: '100%',
      paddingTop: 12,
      paddingRight: 12,
    },
  });

export default Product;

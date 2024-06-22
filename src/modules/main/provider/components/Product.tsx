import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {BorderImage} from '../../../../components/image/BorderImage';
import useFormatNumber from '../../../../hooks/useFormatNumber';
import {FB_DOMAIN} from '../../../../utils/constants';
import {itemDetailsToProductModel} from '../../../../utils/formatter';
import {useAppTheme} from '../../../../utils/theme';
import ProductSummary from './new/ProductSummary';

interface Product {
  product: any;
  search?: boolean;
}

const NoImageAvailable = require('../../../../assets/noImage.png');

const Product: React.FC<Product> = ({product, search = false}) => {
  const {formatNumber} = useFormatNumber();
  const isFBDomain = product.context.domain === FB_DOMAIN;
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const navigateToProductDetails = () => {
    if (search) {
      const routeParams: any = {
        brandId: product.provider_details.id,
      };

      if (product.location_details) {
        routeParams.outletId = product.location_details.id;
      }
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
          product?.item_details?.descriptor?.symbol
            ? {uri: product?.item_details?.descriptor?.symbol}
            : NoImageAvailable
        }
        dimension={120}
      />
      <ProductSummary product={itemDetailsToProductModel(product)} />
    </TouchableOpacity>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 8,
      flex: 1,
      marginBottom: 20,
      width: 130,
    },
    gridImage: {
      width: '100%',
      height: 180,
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

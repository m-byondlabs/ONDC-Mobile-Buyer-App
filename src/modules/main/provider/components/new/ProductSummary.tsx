import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import VegNonVegTag from '../../../../../components/products/VegNonVegTag';
import useFormatNumber from '../../../../../hooks/useFormatNumber';
import {CURRENCY_SYMBOLS, FB_DOMAIN} from '../../../../../utils/constants';
import {useAppTheme} from '../../../../../utils/theme';
import {ProductModel} from '../../../types/Product';

const ProductSummary = ({product}: {product: ProductModel}) => {
  const {formatNumber} = useFormatNumber();
  const isFBDomain = product.domain === FB_DOMAIN;
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.summaryContainer}>
      {isFBDomain && (
        <View style={styles.vegNonVegContainer}>
          <VegNonVegTag tags={product.tags} />
        </View>
      )}
      <Text
        variant={'labelMedium'}
        numberOfLines={2}
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
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    summaryContainer: {
      flexDirection: 'column',
      flex: 1,
      padding: 8,
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

export default ProductSummary;

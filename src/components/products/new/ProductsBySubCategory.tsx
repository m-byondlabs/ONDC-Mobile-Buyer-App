import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Text} from 'react-native-paper';
import Product from '../../../modules/main/provider/components/Product';
import {ProductModel} from '../../../modules/main/types/Product';
import {useAppTheme} from '../../../utils/theme';
import {BorderImage} from '../../image/BorderImage';

export type SubcategoryModel = {
  id: string;
  name: string;
  iconUrl?: string | number;
};

const NoImageAvailable = require('../../../assets/noImage.png');

const SubcategoryHeader = ({subcategory}: {subcategory: SubcategoryModel}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const iconSource = () => {
    // if iconUrl is a number, it is a local image
    if (typeof subcategory.iconUrl === 'number') {
      return subcategory.iconUrl;
    }
    return subcategory.iconUrl ? {uri: subcategory.iconUrl} : NoImageAvailable;
  };

  return (
    <View style={styles.subcategoryContainer}>
      <BorderImage source={iconSource()} dimension={36} />
      <Text variant={'titleLarge'}>{subcategory.name}</Text>
    </View>
  );
};

const ProductsBySubCategory = ({
  products,
  subcategory,
}: {
  products: ProductModel[];
  subcategory: SubcategoryModel;
}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  const renderItem = useCallback(({item}: {item: ProductModel}) => {
    return <Product product={item} />;
  }, []);

  const horizontalProductList = (productsList: ProductModel[]) => {
    return (
      <FlatList
        data={productsList}
        renderItem={renderItem}
        horizontal
        keyExtractor={item => item.id}
      />
    );
  };

  return (
    <View style={styles.container}>
      <SubcategoryHeader subcategory={subcategory} />
      {horizontalProductList(products)}
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
      paddingVertical: 0,
      paddingHorizontal: 8,
      width: '100%',
    },
    listContainer: {
      paddingHorizontal: 8,
      flex: 1,
    },
    subcategoryContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
    },
  });

export default ProductsBySubCategory;

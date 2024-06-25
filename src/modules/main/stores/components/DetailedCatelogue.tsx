import {Text} from 'react-native-paper';

import React, {useMemo} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import reactotron from '../../../../../ReactotronConfig';
import {BorderImage} from '../../../../components/image/BorderImage';
import {ProductsBySubCategory} from '../../../../components/products/new/StorePageProducts';
import {useAppTheme} from '../../../../utils/theme';
import Product from '../../provider/components/Product';
import {ProductModel} from '../../types/Product';

// generate 8 grocery categories

export type StoreCatalogue = {
  productsBySubCategory: ProductsBySubCategory[];
  initialSubcategoryIndex: number;
};

const VerticalFilterItem = ({title, icon, onPress, styles}) => (
  <TouchableOpacity style={styles.filterItem} onPress={onPress}>
    <BorderImage source={icon} dimension={48} cricular />
    <Text style={styles.title} numberOfLines={2}>
      {title}
    </Text>
  </TouchableOpacity>
);

const useEvenProducts = (products: ProductModel[]) =>
  useMemo(() => {
    // Clone the products array to avoid mutating the original array
    const evenProducts = [...products];
    // Add empty product to make it even if odd
    if (evenProducts.length % 2 === 1) {
      evenProducts.push({
        id: 'empty',
        name: '',
        unitizedValue: '',
        imageUrl: '',
        price: '',
        currency: '',
        domain: '',
        tags: [],
      });
    }
    return evenProducts;
  }, [products]);

const ProducstList = ({products}: {products: ProductModel[]}) => {
  const {colors} = useAppTheme();
  const styles = makeStyles(colors);

  const renderProduct = ({item}) => {
    if (item.id === 'empty') {
      return <View style={styles.emptyItem} />;
    }
    return <Product product={item} />;
  };

  return (
    <FlatList
      data={useEvenProducts(products)}
      renderItem={({item}) => renderProduct({item})}
      keyExtractor={item => item.id}
      numColumns={2}
    />
  );
};

const DetailedCatelogue = ({route, navigation}) => {
  const {colors} = useAppTheme();
  const styles = makeStyles(colors);
  const {productsBySubCategory, initialSubcategoryIndex} = route.params;
  reactotron.log('catalogue', {productsBySubCategory, initialSubcategoryIndex});

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const renderItem = ({
    item,
    index,
  }: {
    item: ProductsBySubCategory;
    index: number;
  }) => (
    <VerticalFilterItem
      title={item.subcategory.name}
      icon={item.subcategory.iconUrl}
      onPress={() => setSelectedIndex(index)}
      styles={styles}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.list}>
        <FlatList
          data={productsBySubCategory}
          renderItem={renderItem}
          keyExtractor={item => item.subcategory.id}
        />
      </View>
      <View style={styles.divider} />
      <View style={styles.detailsContainer}>
        <ProducstList
          products={productsBySubCategory[selectedIndex].products}
        />
      </View>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      flex: 1,
      backgroundColor: colors.white,
    },
    list: {
      width: 70,
      flex: 0,
    },
    filterItem: {
      width: 70,
      paddingHorizontal: 4,
      paddingVertical: 8,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 16,
    },
    detailsContainer: {
      flex: 1,
    },
    detailsText: {
      fontSize: 18,
      color: '#888',
    },
    divider: {
      width: 1,
      backgroundColor: '#ccc',
    },
    emptyItem: {
      paddingHorizontal: 8,
      flex: 1,
      marginBottom: 8,
      marginRight: 16,
      width: 130,
    },
  });

export default DetailedCatelogue;

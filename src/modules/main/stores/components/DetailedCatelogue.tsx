import {Text} from 'react-native-paper';

import React, {useMemo} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
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

const VerticalFilterItem = ({
  title,
  icon,
  onPress,
  styles,
  selectedIndex,
  index,
  colors,
}) => {
  const isSelected = selectedIndex === index;
  const borderColor = isSelected ? colors.primary : undefined;
  const textStyles = isSelected ? styles.selectedTitle : styles.title;
  return (
    <TouchableOpacity style={styles.filterItem} onPress={onPress}>
      <BorderImage
        source={icon}
        dimension={48}
        cricular
        borderColor={borderColor}
      />
      <Text style={textStyles} numberOfLines={2}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

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

const PillComponent = ({styles}) => {
  return (
    <View style={styles.pillContainer}>
      <TouchableOpacity style={styles.pill}>
        <Icon name="sort" size={20} color="#000" style={styles.icon} />
        <Text style={styles.pillText}>Sort By</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.pill}>
        <Icon name="filter-list" size={20} color="#000" style={styles.icon} />
        <Text style={styles.pillText}>Filter</Text>
      </TouchableOpacity>
    </View>
  );
};

const ProducstList = ({products}: {products: ProductModel[]}) => {
  const {colors} = useAppTheme();
  const styles = makeStyles(colors);

  const renderProduct = ({item}) => {
    reactotron.log('render product');
    if (item.id === 'empty') {
      return <View style={styles.emptyItem} />;
    }
    return <Product product={item} />;
  };

  return (
    <View style={styles.productsContainer}>
      <PillComponent styles={styles} />
      <FlatList
        data={useEvenProducts(products)}
        renderItem={({item}) => renderProduct({item})}
        keyExtractor={item => item.id}
        numColumns={2}
      />
    </View>
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
  }) => {
    reactotron.log('render vertical item');
    return (
      <VerticalFilterItem
        title={item.subcategory.name}
        icon={item.subcategory.iconUrl}
        index={index}
        selectedIndex={selectedIndex}
        onPress={() => setSelectedIndex(index)}
        styles={styles}
        colors={colors}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.list}>
        <FlatList
          data={productsBySubCategory}
          renderItem={renderItem}
          keyExtractor={item => item.subcategory.id}
          extraData={selectedIndex}
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
    selectedFilterItem: {
      backgroundColor: colors.primary,
    },
    title: {
      fontSize: 14,
    },
    selectedTitle: {
      fontSize: 18,
      fontWeight: 'bold',
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
    pillContainer: {
      flexDirection: 'row',
      padding: 10,
    },
    pill: {
      flexDirection: 'row', // Align icon and text horizontally
      backgroundColor: colors.white,
      borderRadius: 20,
      borderColor: colors.neutral200,
      borderWidth: 1,
      paddingVertical: 4,
      paddingHorizontal: 16,
      marginHorizontal: 5,
      alignItems: 'center', // Center items vertically within the pill
    },
    pillText: {
      color: '#000',
    },
    icon: {
      marginRight: 8, // Add some space between the icon and the text
    },

    productsContainer: {
      flex: 1,
      backgroundColor: colors.white,
      paddingVertical: 0,
      paddingHorizontal: 8,
      width: '100%',
    },
  });

export default DetailedCatelogue;

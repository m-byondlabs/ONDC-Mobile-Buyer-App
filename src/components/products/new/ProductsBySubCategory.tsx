import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
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

const SubcategoryHeader = ({
  subcategory,
  onSubcategorySelected,
}: {
  subcategory: SubcategoryModel;
  onSubcategorySelected: (subcategory: SubcategoryModel) => void;
}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const iconSource = () => {
    // if iconUrl is a number, it is a local image
    if (typeof subcategory.iconUrl === 'number') {
      return subcategory.iconUrl;
    }
    return subcategory.iconUrl ? {uri: subcategory.iconUrl} : NoImageAvailable;
  };

  return (
    <TouchableOpacity
      onPress={() => {
        onSubcategorySelected(subcategory);
      }}>
      <View style={styles.subcategoryContainer}>
        <View style={styles.subcategoryName}>
          <BorderImage source={iconSource()} dimension={36} />
          <Text variant={'titleLarge'}>{subcategory.name}</Text>
        </View>
        <Icon
          style={styles.cheveron}
          name={'chevron-right'}
          size={28}
          color={theme.colors.primary}
        />
      </View>
    </TouchableOpacity>
  );
};

const ProductsBySubCategory = ({
  products,
  subcategory,
  onSubcategorySelected,
}: {
  products: ProductModel[];
  subcategory: SubcategoryModel;
  onSubcategorySelected: (subcategory: SubcategoryModel) => void;
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
      <SubcategoryHeader
        subcategory={subcategory}
        onSubcategorySelected={onSubcategorySelected}
      />
      {horizontalProductList(products)}
      <View style={styles.divider} />
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
      height: 340,
    },
    listContainer: {
      paddingHorizontal: 8,
      flex: 1,
    },
    subcategoryContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 8,
      paddingBottom: 16,
      justifyContent: 'space-between',
    },
    divider: {
      height: 2,
      backgroundColor: colors.neutral100,
      marginVertical: 4,
    },
    subcategoryName: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    cheveron: {
      color: colors.primary,
      paddingHorizontal: 16,
    },
  });

export default ProductsBySubCategory;

import {Text} from 'react-native-paper';

import React from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import reactotron from '../../../../../ReactotronConfig';
import {BorderImage} from '../../../../components/image/BorderImage';
import {ProductsBySubCategory} from '../../../../components/products/new/StorePageProducts';

// generate 8 grocery categories

export type StoreCatalogue = {
  productsBySubCategory: ProductsBySubCategory[];
  initialSubcategoryIndex: number;
};

const Item = ({title, icon, onPress}) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <BorderImage source={icon} dimension={48} cricular />
    <Text style={styles.title} numberOfLines={2}>
      {title}
    </Text>
  </TouchableOpacity>
);

const DetailedCatelogue = ({route, navigation}) => {
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
    <Item
      title={item.subcategory.name}
      icon={item.subcategory.iconUrl}
      onPress={() => setSelectedIndex(index)}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.list}>
        <FlatList
          data={productsBySubCategory}
          renderItem={renderItem}
          keyExtractor={item => item.subcategory.id}
          contentContainerStyle={{width: 100}}
          getItemLayout={(data, index) => ({
            length: 100,
            offset: 100 * index,
            index,
          })}
        />
      </View>
      <View style={styles.divider} />
      <View style={styles.detailsContainer}>
        {/* Render the selected item's details here */}
        <Text style={styles.detailsText}>
          Category test long {selectedIndex}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  list: {
    width: 70,
    flex: 0,
  },
  item: {
    width: 70,
    padding: 4,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
  },
  detailsContainer: {
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsText: {
    fontSize: 18,
    color: '#888',
  },
  divider: {
    width: 1,
    backgroundColor: '#ccc',
  },
});

export default DetailedCatelogue;

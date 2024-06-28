import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import reactotron from '../../../../ReactotronConfig';
import useSelectItems from '../../../hooks/useSelectItems';
import {StoreWithProducts, groupCartByProvider} from '../../../utils/formatter';

const AllCarts = () => {
  const openFulfillmentSheet = () => {
    // TODO: remove the need for this
  };

  const {
    loading,
    cartItems,
    checkoutLoading,
    getCartItems,
    onCheckoutFromCart,
    haveDistinctProviders,
    isProductAvailableQuantityIsZero,
    isProductCategoryIsDifferent,
    setCartItems,
    selectedItems,
    setSelectedItems,
    selectedItemsForInit,
    updateSelectedItemsForInit,
  } = useSelectItems(openFulfillmentSheet);

  const [storesWithCartItems, setStoreWithCartItems] = React.useState<
    StoreWithProducts[]
  >([]);

  useEffect(() => {
    reactotron.log('cartItems', cartItems);
    const storesWithCartItems = groupCartByProvider(cartItems);
    setStoreWithCartItems(storesWithCartItems);
  }, [cartItems]);

  useEffect(() => {
    getCartItems();
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={storesWithCartItems}
        renderItem={({item}) => <Text>{item.store.name}</Text>}
        keyExtractor={item => item.store.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AllCarts;

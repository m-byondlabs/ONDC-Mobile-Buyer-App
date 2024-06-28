import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import reactotron from '../../../../ReactotronConfig';
import {BorderImage} from '../../../components/image/BorderImage';
import useSelectItems from '../../../hooks/useSelectItems';
import {StoreWithProducts, groupCartByProvider} from '../../../utils/formatter';
import {useAppTheme} from '../../../utils/theme';
import {StoreModel} from '../stores/components/Store';

const StoreSummary = ({store, styles}: {store: StoreModel; styles: any}) => {
  return (
    <View style={styles.storeSummaryContainer}>
      <View style={styles.storeContentContainer}>
        <BorderImage source={{uri: store.iconUrl}} dimension={48} />
        <View style={styles.textContainer}>
          <Text variant="titleLarge" style={styles.storeName}>
            {store.name}
          </Text>
          <Text style={styles.storeLocation}>{store.address.street}</Text>
        </View>
        <Icon name={'close'} size={28} />
      </View>
      <View style={styles.divider} />
    </View>
  );
};

const AllCarts = () => {
  const openFulfillmentSheet = () => {
    // TODO: remove the need for this
  };
  const theme = useAppTheme();

  const styles = makeStyles(theme.colors);

  const {cartItems, getCartItems} = useSelectItems(openFulfillmentSheet);

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

  const renderCartStore = (cart: StoreWithProducts) => {
    return (
      <View>
        <StoreSummary store={cart.store} styles={styles} />
        <FlatList
          data={cart.products}
          renderItem={({item}) => <Text>{item.name}</Text>}
          keyExtractor={item => item.id}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={storesWithCartItems}
        renderItem={({item}) => renderCartStore(item)}
        keyExtractor={item => item.store.id}
      />
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    storeSummaryContainer: {
      flexDirection: 'column',
    },
    storeContentContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    container: {
      padding: 16,
      flex: 1,
    },
    textContainer: {
      flex: 1,
      flexDirection: 'column',
    },
    storeName: {
      fontWeight: 'bold',
    },
    storeLocation: {
      color: 'gray',
    },
    divider: {
      height: 2,
      backgroundColor: colors.neutral100,
      marginVertical: 4,
    },
  });

export default AllCarts;

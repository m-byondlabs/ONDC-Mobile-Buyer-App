import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {BorderImage} from '../../../components/image/BorderImage';
import {CURRENCY_SYMBOLS} from '../../../utils/constants';
import {StoreWithProducts, groupCartByProvider} from '../../../utils/formatter';
import {useAppTheme} from '../../../utils/theme';
import {StoreModel} from '../stores/components/Store';
import {ProductModel} from '../types/Product';

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

const quantityCount = (products: ProductModel[]) => {
  return products.reduce(
    (acc, product) => acc + (product.cartQuantity ?? 0),
    0,
  );
};

const cartTotalAmount = (products: ProductModel[]) => {
  return products.reduce(
    (acc, product) =>
      acc + parseFloat(product.price) * (product.cartQuantity ?? 0),
    0,
  );
};

const CartItemsSummary = ({
  products,
  styles,
  colors,
}: {
  products: ProductModel[];
  styles: any;
  colors: any;
}) => {
  const navigation = useNavigation<any>();

  const navigateToCart = () => {
    navigation.navigate('Cart');
  };

  // TODO: Replace with actual data
  return (
    <TouchableOpacity
      style={styles.cartItemsSummaryContainer}
      onPress={() => {
        navigateToCart();
      }}>
      <Text variant="titleMedium" style={styles.itemsInCart}>
        {'Items in cart (' + quantityCount(products) + ')'}
      </Text>
      <View style={styles.productsSummary}>
        <BorderImage source={{uri: products[0].imageUrl}} dimension={64} />
        <Text
          ellipsizeMode={'tail'}
          numberOfLines={2}
          style={styles.productNames}>
          {products.map((product: any) => product.name).join(', ')}
        </Text>
      </View>
      <View style={styles.cartTotal}>
        <View style={styles.payable}>
          <Text variant="bodyLarge">Total: </Text>
          <Text variant="titleLarge">{`${
            CURRENCY_SYMBOLS[products[0].currency]
          }${cartTotalAmount(products)}`}</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillText}>View Cart</Text>
          <Icon
            name="chevron-right"
            size={20}
            style={styles.icon}
            color={colors.white}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const AllCarts = () => {
  const theme = useAppTheme();

  const styles = makeStyles(theme.colors);

  const {cartItems} = useSelector(({cartReducer}) => cartReducer);

  const [storesWithCartItems, setStoreWithCartItems] = React.useState<
    StoreWithProducts[]
  >([]);

  useEffect(() => {
    setStoreWithCartItems(groupCartByProvider(cartItems));
  }, [cartItems]);

  const renderCartStore = (cart: StoreWithProducts) => {
    return (
      <View style={styles.listContainer}>
        <StoreSummary store={cart.store} styles={styles} />
        <CartItemsSummary
          products={cart.products}
          styles={styles}
          colors={theme.colors}
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
        ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
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
      paddingBottom: 8,
    },
    listContainer: {
      padding: 16,
      borderRadius: 16,
      backgroundColor: colors.white,
    },
    container: {
      padding: 8,
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
      height: 1,
      backgroundColor: colors.neutral100,
      marginVertical: 4,
    },
    cartItemsSummaryContainer: {
      flexDirection: 'column',
      paddingHorizontal: 16,
      paddingTop: 8,
    },
    itemsInCart: {
      fontWeight: 'bold',
    },
    productsSummary: {
      flexDirection: 'row',
      paddingVertical: 8,
    },
    productNames: {
      flex: 1,
      marginLeft: 8,
      marginRight: 8,
    },
    cartTotal: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
    },
    pill: {
      flexDirection: 'row', // Align icon and text horizontally
      backgroundColor: colors.primary,
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 16,
      marginHorizontal: 5,
      alignItems: 'center', // Center items vertically within the pill
    },
    pillText: {
      color: colors.white,
    },
    listSeparator: {
      height: 8,
    },
    payable: {
      flexDirection: 'row',
    },
  });

export default AllCarts;

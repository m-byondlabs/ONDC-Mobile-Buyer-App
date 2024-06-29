import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useEffect, useRef} from 'react';
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import reactotron from '../../../../ReactotronConfig';
import {BorderImage} from '../../../components/image/BorderImage';
import useNetworkHandling from '../../../hooks/useNetworkHandling';
import {updateCartItems} from '../../../redux/cart/actions';
import {API_BASE_URL, CART} from '../../../utils/apiActions';
import {CURRENCY_SYMBOLS} from '../../../utils/constants';
import {StoreWithProducts, groupCartByProvider} from '../../../utils/formatter';
import {useAppTheme} from '../../../utils/theme';
import {ProductModel} from '../types/Product';

const showAlert = (
  cart: StoreWithProducts,
  handleRemoveCart: (cart: StoreWithProducts) => void,
) => {
  const {store, products} = cart;

  const handleCancel = () => {
    reactotron.log('Cancel remove cart');
  };

  Alert.alert(
    'Remove Cart?',
    `Are you sure you want to remove all items from ${store.name}?`,
    [
      {
        text: 'Cancel',
        onPress: () => handleCancel(),
        style: 'cancel',
      },
      {text: 'Yes, remove', onPress: () => handleRemoveCart(cart)},
    ],
    {
      cancelable: true,
    },
  );
};

const StoreSummary = ({
  cart,
  handleRemoveCart,
  styles,
}: {
  cart: StoreWithProducts;
  handleRemoveCart: (cart: StoreWithProducts) => void;
  styles: any;
}) => {
  const {store} = cart;
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
        <TouchableOpacity
          onPress={() => {
            reactotron.log('Clear store cart');
            showAlert(cart, handleRemoveCart);
          }}>
          <Icon name={'close'} size={28} />
        </TouchableOpacity>
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
  cart,
  styles,
  colors,
}: {
  cart: StoreWithProducts;
  styles: any;
  colors: any;
}) => {
  const navigation = useNavigation<any>();

  const {store, products} = cart;

  const navigateToCart = () => {
    navigation.navigate('Cart', {providerId: store.id});
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
const CancelToken = axios.CancelToken;

const AllCarts = () => {
  const theme = useAppTheme();

  const styles = makeStyles(theme.colors);

  const {cartItems} = useSelector(({cartReducer}) => cartReducer);

  const [storesWithCartItems, setStoreWithCartItems] = React.useState<
    StoreWithProducts[]
  >([]);

  const {uid} = useSelector(({authReducer}) => authReducer);

  const {deleteDataWithAuth, getDataWithAuth, putDataWithAuth} =
    useNetworkHandling();

  const source = useRef<any>(null);

  const dispatch = useDispatch();

  const handleRemoveCart = async (cart: StoreWithProducts) => {
    try {
      const {products} = cart;
      products.forEach(async product => {
        source.current = CancelToken.source();
        await deleteDataWithAuth(
          `${API_BASE_URL}${CART}/${uid}/${product.cartItemId}`,
          source.current.token,
        );
      });
      // filter all the items from cartItems that are not in the current store
      reactotron.log('cartItems before deletion', cartItems);
      const newCartItems = cartItems.filter(
        item => item.item.provider.id !== cart.store.id,
      );
      dispatch(updateCartItems(newCartItems));
    } catch (error) {
      console.log('Error fetching product details:', error);
    }
  };

  useEffect(() => {
    reactotron.log('cartItems should be updated after deletion', cartItems);
    setStoreWithCartItems(groupCartByProvider(cartItems));
  }, [cartItems]);

  const renderCartStore = (cart: StoreWithProducts) => {
    return (
      <View style={styles.listContainer}>
        <StoreSummary
          cart={cart}
          styles={styles}
          handleRemoveCart={handleRemoveCart}
        />
        <CartItemsSummary cart={cart} styles={styles} colors={theme.colors} />
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

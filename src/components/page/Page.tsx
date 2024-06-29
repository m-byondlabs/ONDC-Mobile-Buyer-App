import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import useFormatNumber from '../../hooks/useFormatNumber';
import {filterCartByProvider, totalQuantityCount} from '../../utils/formatter';
import {useAppTheme} from '../../utils/theme';

interface Page {
  providerId?: any;
  children: React.ReactNode;
}

const Page: React.FC<Page> = ({providerId, children}) => {
  const {formatNumber} = useFormatNumber();
  const {t} = useTranslation();
  const theme = useAppTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const {cartItems} = useSelector(({cartReducer}) => cartReducer);
  const styles = makeStyles(theme.colors);

  const navigateToCart = () => {
    if (!providerId) {
      navigation.navigate('All Carts');
      return;
    }
    navigation.navigate('Cart', {providerId: providerId});
  };

  const itemCount = totalQuantityCount(
    filterCartByProvider(cartItems, providerId),
  );
  return (
    <View style={styles.pageContainer}>
      {children}
      {itemCount > 0 && (
        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={navigateToCart}>
            <Text variant={'bodyLarge'} style={styles.text}>
              {formatNumber(itemCount)}{' '}
              {itemCount > 1 ? t('Page.Items Added') : t('Page.Item Added')}
              {t('Page., Go To Cart')}
            </Text>
            <Icon
              name={'keyboard-arrow-right'}
              size={18}
              color={theme.colors.white}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    pageContainer: {
      flex: 1,
      backgroundColor: colors.white,
    },
    container: {
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    button: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 13,
      borderRadius: 8,
    },
    text: {
      color: colors.white,
    },
  });

export default Page;

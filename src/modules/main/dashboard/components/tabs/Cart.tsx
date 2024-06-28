import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';

import {useAppTheme} from '../../../../../utils/theme';
import AllCarts from '../../../cart/AllCarts';

const DashboardCart = () => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant={'titleLarge'} style={styles.pageTitle}>
          {t('Cart.All Carts')}
        </Text>
      </View>
      <AllCarts />
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    header: {
      padding: 16,
    },
    pageTitle: {
      color: colors.neutral400,
    },
  });

export default DashboardCart;

import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';

import Products from '../../../../../components/products/Products';
import {useAppTheme} from '../../../../../utils/theme';
import CustomMenu from '../CustomMenu';
import StoreSummary from './StoreSummary';

interface StoreDetails {
  provider: any;
  outlet: any;
  apiRequested: boolean;
  defaultSearchQuery?: string;
}

const StoreDetails: React.FC<StoreDetails> = ({
  provider,
  outlet,
  apiRequested,
  defaultSearchQuery = '',
}) => {
  const {t} = useTranslation();
  const {colors} = useAppTheme();
  const styles = makeStyles(colors);
  const [selectedMenu, setSelectedMenu] = useState<any>(null);

  if (provider) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <StoreSummary
            provider={provider}
            outlet={outlet}
            apiRequested={apiRequested}
          />
          <View style={styles.divider} />
          <CustomMenu
            providerId={provider.id}
            providerDomain={provider.domain}
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
          />
          <Products
            providerId={provider.id}
            customMenu={selectedMenu}
            subCategories={[]}
            defaultSearchQuery={defaultSearchQuery}
          />
        </View>
      </ScrollView>
    );
  } else {
    return (
      <View style={styles.providerNotFound}>
        <Text variant={'bodyLarge'}>{t('Global.Details not available')}</Text>
      </View>
    );
  }
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    divider: {
      height: 1,
      backgroundColor: colors.neutral200,
      marginVertical: 8,
    },
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    providerNotFound: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default StoreDetails;

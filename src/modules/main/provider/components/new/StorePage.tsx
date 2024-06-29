import React, {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';

import RBSheet from 'react-native-raw-bottom-sheet';
import reactotron from '../../../../../../ReactotronConfig';
import {BorderImage} from '../../../../../components/image/BorderImage';
import StorePageProducts from '../../../../../components/products/new/StorePageProducts';
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
  const refSubcategorySheet = useRef<any>(null);
  const [productsGroupedByCategory, setProductsGroupedByCategory] = useState<
    any[]
  >([]);
  const [subcategoryIndex, setSubcategoryIndex] = useState<number>(0);

  const onCategoriesFilterSelected = (categories: any[]) => {
    if (categories.length > 0) {
      setProductsGroupedByCategory(categories);
      refSubcategorySheet.current.open();
    }
  };

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
          <StorePageProducts
            providerId={provider.id}
            customMenu={selectedMenu}
            subCategories={[]}
            defaultSearchQuery={defaultSearchQuery}
            onCategoriesFilterSelected={onCategoriesFilterSelected}
            subcategoryIndex={subcategoryIndex}
          />
          <RBSheet
            ref={refSubcategorySheet}
            height={300}
            openDuration={250}
            customStyles={{
              container: styles.sheetContainer,
            }}>
            <View>
              <FlatList
                data={productsGroupedByCategory}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    onPress={() => {
                      reactotron.log('selected index', index);
                      setSubcategoryIndex(index);
                      refSubcategorySheet.current.close();
                    }}>
                    <View style={styles.row}>
                      <BorderImage
                        source={item.subcategory.iconUrl}
                        dimension={64}
                      />
                      <Text variant={'titleLarge'}>
                        {item.subcategory.name}
                      </Text>
                      <View style={styles.divider} />
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.subcategory.id}
              />
            </View>
          </RBSheet>
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
      height: 5,
      backgroundColor: colors.neutral100,
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
    sheetContainer: {
      padding: 10,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    divider: {
      height: 5,
      backgroundColor: colors.neutral100,
      marginVertical: 8,
    },
  });

export default StoreDetails;

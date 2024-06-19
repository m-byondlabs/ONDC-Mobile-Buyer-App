import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import Page from '../../../components/page/Page';
import {locationToStoreModels} from '../../../utils/formatter';
import {useAppTheme} from '../../../utils/theme';
import Store, {StoreModel} from './components/Store';

const StoresNearMe = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {locations} = useSelector(({storeReducer}) => storeReducer);

  useEffect(() => {
    navigation.setOptions({
      title: t('Stores Near me.Stores Near me'),
    });
  }, []);

  const renderItem = ({item}: {item: StoreModel}) => (
    <Store store={item} width={96} />
  );

  return (
    <Page>
      <View style={styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={locationToStoreModels(locations)}
          renderItem={renderItem}
          numColumns={1}
          keyExtractor={(item: any) => item.id}
        />
      </View>
    </Page>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingVertical: 20,
      paddingHorizontal: 8,
      backgroundColor: colors.white,
      flex: 1,
    },
  });

export default StoresNearMe;

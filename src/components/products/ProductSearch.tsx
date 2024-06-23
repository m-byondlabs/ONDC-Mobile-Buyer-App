import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAppTheme} from '../../utils/theme';

const ProductSearch = ({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (text: string) => void;
}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.container}>
      <Icon name={'search'} size={20} color={theme.colors.neutral300} />
      <TextInput
        mode={'outlined'}
        contentStyle={styles.input}
        style={styles.inputContainer}
        placeholder={t('Product SubCategories.Search')}
        placeholderTextColor={theme.colors.neutral300}
        onChangeText={text => setSearchQuery(text)}
        value={searchQuery}
        textColor={theme.colors.neutral400}
        outlineColor="transparent"
        activeOutlineColor="transparent"
      />
      {searchQuery.length === 0 ? (
        <></>
      ) : (
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <Icon name={'clear'} size={20} color={theme.colors.neutral300} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderRadius: 60,
      padding: 10,
      height: 40,
      borderColor: colors.neutral200,
      borderWidth: 1,
    },
    inputContainer: {
      marginLeft: 6,
      flex: 1,
      // height: 20,
      fontSize: 14,
      textDecorationLine: 'none',
      fontWeight: '400',
    },
    input: {
      height: 20,
      borderWidth: 0,
    },
  });

export default ProductSearch;

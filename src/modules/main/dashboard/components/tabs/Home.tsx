import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import Carousel from '../../../../../components/carousel/Carousel';
import {useAppTheme} from '../../../../../utils/theme';
import StoresNearMe from '../../../category/components/StoresNearMe';
import Header from '../header/Header';
import Categories from '../home/Categories';

const Home = () => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const images = [
    'https://i.imgur.com/T9F1G5J.png',
    'https://imgur.com/y47UTGI.png',
    'https://imgur.com/KENnRn5.png',
    'https://imgur.com/WxYyIlR.png',
  ];

  const navigation = useNavigation<StackNavigationProp<any>>();

  const handlePress = (index: number) => {
    console.log(`Image ${index} pressed`);
    let searchQuery = '';
    switch (index) {
      case 0:
        searchQuery = 'Oil';
        break;
      case 1:
        searchQuery = 'Cleaner';
        break;
      case 2:
        searchQuery = 'Iron';
        break;
      case 3:
        searchQuery = 'Plant';
        break;
      default:
        break;
    }
    navigation.navigate('SearchProducts', {query: searchQuery});
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Carousel images={images} onPress={handlePress} />
        <Categories />
        <StoresNearMe />
      </ScrollView>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
  });

export default Home;

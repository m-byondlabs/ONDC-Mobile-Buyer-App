import {Text} from 'react-native-paper';

import React from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// generate 8 grocery categories
const data = [
  {key: '1', title: 'Home', icon: 'home'},
  {key: '2', title: 'Settings', icon: 'settings'},
  {key: '3', title: 'Profile', icon: 'person'},
  {key: '4', title: 'Notifications', icon: 'notifications'},
  {key: '5', title: 'Help', icon: 'help'},
];

const Item = ({title, icon, onPress}) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Icon name={icon} size={24} color="#000" />
    <Text style={styles.title}>{title}</Text>
  </TouchableOpacity>
);

const DetailedCatelogue = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const renderItem = ({item, index}) => (
    <Item
      title={item.title}
      icon={item.icon}
      onPress={() => setSelectedIndex(index)}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.list}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.key}
          contentContainerStyle={{width: 100}}
          getItemLayout={(data, index) => ({
            length: 100,
            offset: 100 * index,
            index,
          })}
        />
      </View>
      <View style={styles.detailsContainer}>
        {/* Render the selected item's details here */}
        <Text style={styles.detailsText}>
          Category test long {selectedIndex}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  list: {
    width: 70,
    backgroundColor: '#26934e',
    flex: 0,
  },
  item: {
    width: 70,
    flexDirection: 'column',
    backgroundColor: '#c81fb7',
    borderColor: '#26934e',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  title: {
    fontSize: 16,
  },
  detailsContainer: {
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff000',
  },
  detailsText: {
    fontSize: 18,
    color: '#888',
  },
});

export default DetailedCatelogue;

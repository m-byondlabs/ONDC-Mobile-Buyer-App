import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

interface CarouselProps {
  images: string[];
  onPress: (index: number) => void;
}

const {width} = Dimensions.get('window');
const AUTO_SCROLL_INTERVAL = 3000; // 3 seconds

const Carousel: React.FC<CarouselProps> = ({images, onPress}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const autoScroll = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex > images.length) {
        nextIndex = 0;
      }
      scrollToIndex(nextIndex);
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(autoScroll);
  }, [currentIndex, images.length]);

  const scrollToIndex = (index: number) => {
    if (scrollViewRef.current) {
      if (index === images.length) {
        scrollViewRef.current.scrollTo({x: index * width, animated: true});
        setTimeout(() => {
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({x: 0, animated: false});
          }
        }, 500); // The duration should match the animation duration
      } else {
        scrollViewRef.current.scrollTo({x: index * width, animated: true});
      }
      setCurrentIndex(index);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);

    if (index !== currentIndex) {
      if (index === images.length) {
        setCurrentIndex(0);
      } else {
        setCurrentIndex(index);
      }
    }
  };

  const handlePress = (index: number) => {
    onPress(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{width: width * (images.length + 1)}}>
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handlePress(index)}
            style={styles.imageContainer}>
            <Image source={{uri: image}} style={styles.image} />
          </TouchableOpacity>
        ))}
        {/* Duplicate the first item */}
        <TouchableOpacity
          key="duplicate"
          onPress={() => handlePress(0)}
          style={styles.imageContainer}>
          <Image source={{uri: images[0]}} style={styles.image} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    padding: 10,
  },
  image: {
    width: width - 20, // Subtract padding
    height: 200,
    borderRadius: 15,
  },
});

export default Carousel;

import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, Image, View, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import img1 from '../../images/sliderImage1.png';
import img2 from '../../images/sliderImage2.webp';
import img3 from '../../images/sliderImage3.jpg';
import img4 from '../../images/sliderImage4.jpg';
import img5 from '../../images/sliderImage5.jpeg';

const data = [
  {
    id: 1,
    uri: img1,
  },
  {
    id: 2,
    uri: img2,
  },
  {
    id: 3,
    uri: img3,
  },
  {
    id: 4,
    uri: img4,
  },
  {
    id: 5,
    uri: img5,
  },
];

function CustomCarousel() {
  const width = Dimensions.get('window').width;
  const [loading, setLoading] = useState(true);

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        loop
        width={width}
        height={width / 2}
        autoPlay={true}
        mode="parallax"
        parallaxScrollingScale={0.9}
        parallaxScrollingOffset={50}
        scrollAnimationDuration={1000}
        data={data}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={typeof item.uri === 'string' ? { uri: item.uri } : item.uri}
              onLoadStart={() => setLoading(true)}
              onLoad={() => setLoading(false)}
              onError={() => setLoading(false)}
            />
          
          </View>
        )}
        onSnapToItem={() => setLoading(true)} // Reset loading on item change
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, // Add borderRadius to match shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5, // For Android
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10, // Match the borderRadius with the container
  },
  loader: {
    position: 'absolute',
  },
});

export default CustomCarousel;

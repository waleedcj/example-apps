import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { useAppColors } from '@/hooks/useAppColors';
import ScrollingPaginationDots from '@/components/ui/PaginationDots';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Sample Image Data (replace with your actual image URIs or local requires)
const SAMPLE_IMAGES = [
  { id: '1', uri: `https://picsum.photos/seed/picsum1/${Math.round(screenWidth)}/${Math.round(screenHeight * 0.5)}` },
  { id: '2', uri: `https://picsum.photos/seed/picsum2/${Math.round(screenWidth)}/${Math.round(screenHeight * 0.5)}` },
  { id: '3', uri: `https://picsum.photos/seed/picsum3/${Math.round(screenWidth)}/${Math.round(screenHeight * 0.5)}` },
  { id: '4', uri: `https://picsum.photos/seed/picsum4/${Math.round(screenWidth)}/${Math.round(screenHeight * 0.5)}` },
  { id: '5', uri: `https://picsum.photos/seed/picsum5/${Math.round(screenWidth)}/${Math.round(screenHeight * 0.5)}` },
  { id: '6', uri: `https://picsum.photos/seed/picsum6/${Math.round(screenWidth)}/${Math.round(screenHeight * 0.5)}` },
  { id: '7', uri: `https://picsum.photos/seed/picsum7/${Math.round(screenWidth)}/${Math.round(screenHeight * 0.5)}` },
  { id: '8', uri: `https://picsum.photos/seed/picsum8/${Math.round(screenWidth)}/${Math.round(screenHeight * 0.5)}` },
];

type ImageItem = {
  id: string;
  uri: string;
};
export default function ImageCarouselPage() {
  
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<FlatList<ImageItem>>(null);
  const colors = useAppColors();

  // Reanimated scroll handler to update scrollX
  const scrollHandler = useAnimatedScrollHandler(
    (event) => {
      scrollX.value = event.contentOffset.x;
    },
    []
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50, // Item is considered visible if 50% is on screen
  }).current;

  // Render a single image slide
  const renderImageItem = ({ item }: { item: ImageItem }) => {
    return (
      <View style={styles.slide}>
        <Image source={{ uri: item.uri }} style={styles.image} resizeMode="cover" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Animated.FlatList
          ref={flatListRef}
          data={SAMPLE_IMAGES}
          renderItem={renderImageItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16} 
          viewabilityConfig={viewabilityConfig}
        />
        <View style={styles.paginationContainer}>
          <ScrollingPaginationDots
            count={SAMPLE_IMAGES.length}
            scrollX={scrollX}
            slideWidth={screenWidth} 
            dotColor={colors.Neutral700}        
            inactiveDotColor={colors.Neutral500}     
            dotSize={10}
            spacing={8}
            inactiveDotOpacity={0.5}
            maxVisibleDots={5} 
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  slide: {
    width: screenWidth, 
    height: screenHeight * 0.5, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '90%',
    height: '90%', 
    borderRadius: 10, 
  },
  paginationContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
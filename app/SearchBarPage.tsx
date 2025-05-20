import React from "react";
import {
	SafeAreaView,
	StyleSheet,
	Text,
	View,
	Alert,
	ScrollView,
	FlatList,
	Image,
	TouchableOpacity,
	Dimensions,
	Platform,
} from "react-native";
import SearchBar from "@/components/ui/SearchBar";
import { useAppColors } from "@/hooks/useAppColors";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7; // Width for featured course cards
const CATEGORY_ITEM_SIZE = width / 3 - 20; // For category items

// Dummy Data
const featuredCourses = [
	{
		id: "1",
		title: "Advanced React Native Mastery",
		instructor: "Jane Doe",
		image: "https://dummyjson.com/image/300x180/A020F0?fontFamily=pacifico&text=I+am+walid+memon",
		rating: 4.8,
		students: 1200,
	},
	{
		id: "2",
		title: "Full-Stack JavaScript Web Dev",
		instructor: "John Smith",
		image: "https://dummyjson.com/image/300x180/FFFF00?fontFamily=pacifico&text=Full+stack+dev",
		rating: 4.9,
		students: 2500,
	},
	{
		id: "3",
		title: "Data Science with Python & AI",
		instructor: "Alice Brown",
		image: "https://dummyjson.com/image/300x180/82CAFF?fontFamily=pacifico&text=Data+Science+Python",
		rating: 4.7,
		students: 1800,
	},
	{
		id: "4",
		title: "Expo & Reanimated Deep Dive",
		instructor: "Dev Guru",
		image: "https://dummyjson.com/image/300x180/98FB98?fontFamily=roboto&text=Expo",
		rating: 4.6,
		students: 950,
	},
];

const courseCategories = [
	{
		id: "cat1",
		name: "Mobile Dev",
		icon: "phone-portrait-outline",
		color: "#E3A547",
	},
	{ id: "cat2", name: "Web Dev", icon: "globe-outline", color: "#9C5BF5" },
	{
		id: "cat3",
		name: "Data Science",
		icon: "analytics-outline",
		color: "#01BF7A",
	},
	{ id: "cat4", name: "Cloud", icon: "cloud-outline", color: "#1656D0" },
	{
		id: "cat5",
		name: "Design",
		icon: "color-palette-outline",
		color: "#F65936",
	},
	{ id: "cat6", name: "DevOps", icon: "git-network-outline", color: "#FFA24B" },
];

export default function SearchBarPage() {
	const colors = useAppColors();

	const handleSearch = (term: string) => {
		Alert.alert("Search Submitted", `Navigating to search results for: ${term}`);
	};

	const renderFeaturedCourse = ({ item }: { item: (typeof featuredCourses)[0] }) => (
		<TouchableOpacity
			style={[styles.featuredCard, { backgroundColor: colors.Neutral0 }]}
			onPress={() => Alert.alert("Course Selected", item.title)}
		>
			<Image source={{ uri: item.image }} style={styles.featuredCardImage} />
			<View style={styles.featuredCardContent}>
				<Text style={[styles.featuredCardTitle, { color: colors.Neutral900 }]}>{item.title}</Text>
				<Text style={[styles.featuredCardInstructor, { color: colors.Neutral500 }]}>{`By ${item.instructor}`}</Text>
				<View style={styles.featuredCardFooter}>
					<Ionicons name="star" size={16} color={colors.AuxColorTwo} />
					<Text style={[styles.featuredCardRating, { color: colors.Neutral700 }]}>{item.rating}</Text>
					<Text style={[styles.featuredCardStudents, { color: colors.Neutral500 }]}>{`${item.students} students`}</Text>
				</View>
			</View>
		</TouchableOpacity>
	);

	const renderCategoryItem = ({ item }: { item: (typeof courseCategories)[0] }) => (
		<TouchableOpacity
			style={[
				styles.categoryItem,
				{
					backgroundColor: item.color + "20" /* Light background from color */,
				},
			]}
			onPress={() => Alert.alert("Category Selected", item.name)}
		>
			<Ionicons name={item.icon as any} size={30} color={item.color} />
			<Text style={[styles.categoryName, { color: item.color }]}>{item.name}</Text>
		</TouchableOpacity>
	);

	return (
		<SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bgColor }]}>
			<View style={{ flex: 1 }}>
				{/* AnimatedSearchBar is outside the ScrollView to remain fixed or behave as a header */}
				<View style={styles.searchBarContainer}>
					<SearchBar
						onSearchSubmit={handleSearch}
						placeholder="Search courses, instructors..."
						searchStartIcon={<Ionicons name="search-outline" size={22} color={colors.Neutral500} style={styles.icon} />}
						recentSearchStartIcon={
							<Ionicons name="time-outline" size={18} color={colors.Neutral500} style={styles.icon} />
						}
						recentSearchEndIcon={<Ionicons name="close-outline" size={22} color={colors.Neutral300} />}
						reduceMotion="never"
						containerBackgroundColor={colors.Neutral0}
						inputTextColor={colors.Neutral900}
						loaderColor={colors.Neutral500}
						recentSearchesTitleColor={colors.Neutral700}
						recentSearchTextColor={colors.Neutral900}
					/>
				</View>

				<ScrollView
					style={styles.scrollView}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled" // Important if search bar stays open while scrolling
				>
					<View style={styles.headerContent}>
						<Text style={[styles.welcomeTitle, { color: colors.Neutral900 }]}>Welcome Back!</Text>
						<Text style={[styles.welcomeSubtitle, { color: colors.Neutral500 }]}>What will you learn today?</Text>
					</View>
					{/* Featured Courses Section */}
					<View style={styles.sectionContainer}>
						<Text style={[styles.sectionTitle, { color: colors.Neutral700 }]}>Featured Courses</Text>
						<FlatList
							data={featuredCourses}
							renderItem={renderFeaturedCourse}
							keyExtractor={(item) => item.id}
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.horizontalListPadding}
						/>
					</View>
					{/* Categories Section */}
					<View style={styles.sectionContainer}>
						<Text style={[styles.sectionTitle, { color: colors.Neutral700 }]}>Categories</Text>
						<FlatList
							data={courseCategories}
							renderItem={renderCategoryItem}
							keyExtractor={(item) => item.id}
							numColumns={3} // Adjust as needed
							columnWrapperStyle={styles.categoryRow}
							contentContainerStyle={styles.categoryListContainer}
							scrollEnabled={false} // if it's short, disable scroll
						/>
					</View>
					<View style={{ height: 50 }} />
				</ScrollView>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	searchBarContainer: {
		paddingTop: Platform.OS === "android" ? 10 : 0,
	},
	scrollView: {
		flex: 1,
	},
	icon: {
		marginRight: 8,
	},
	headerContent: {
		paddingHorizontal: 20,
		paddingTop: 20,
		paddingBottom: 20,
	},
	welcomeTitle: {
		fontSize: 28,
		fontWeight: "bold",
	},
	welcomeSubtitle: {
		fontSize: 16,
		marginTop: 4,
	},
	sectionContainer: {
		marginBottom: 30,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "600",
		marginHorizontal: 20,
		marginBottom: 15,
	},
	horizontalListPadding: {
		paddingHorizontal: 20,
	},
	featuredCard: {
		width: CARD_WIDTH,
		marginRight: 15,
		borderRadius: 12,
		overflow: "hidden", // For borderRadius on image
	},
	featuredCardImage: {
		width: "100%",
		height: 150, // Adjust as needed
	},
	featuredCardContent: {
		padding: 12,
	},
	featuredCardTitle: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 4,
	},
	featuredCardInstructor: {
		fontSize: 13,
		marginBottom: 8,
	},
	featuredCardFooter: {
		flexDirection: "row",
		alignItems: "center",
	},
	featuredCardRating: {
		fontSize: 13,
		fontWeight: "bold",
		marginLeft: 4,
	},
	featuredCardStudents: {
		fontSize: 12,
		marginLeft: 2,
	},
	categoryListContainer: {
		paddingHorizontal: 15,
	},
	categoryRow: {
		justifyContent: "space-between",
		marginBottom: 10,
	},
	categoryItem: {
		width: CATEGORY_ITEM_SIZE,
		height: CATEGORY_ITEM_SIZE,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
		padding: 10,
	},
	categoryName: {
		fontSize: 12,
		fontWeight: "500",
		marginTop: 8,
		textAlign: "center",
	},
	buttonContainer: {
		paddingHorizontal: 20,
		marginTop: 20,
		marginBottom: 40,
	},
});

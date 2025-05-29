import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Alert, ListRenderItem, TouchableOpacity } from "react-native";
import DropdownPicker, { DropdownPickerItem } from "@/components/ui/DropdownPicker";
import { useAppColors } from "@/hooks/useAppColors";
import Ionicons from "@expo/vector-icons/Ionicons";

interface MyCustomItem extends DropdownPickerItem {
	// id, label, value are inherited
	description?: string;
}

const sampleData: MyCustomItem[] = [
	{ id: "1", label: "Toyota", value: "toyota", description: "Reliable Japanese brand" },
	{ id: "2", label: "Honda", value: "honda", description: "Known for efficiency" },
	{ id: "3", label: "Ford", value: "ford", description: "American classic" },
	{ id: "4", label: "BMW", value: "bmw", description: "German luxury" },
	{ id: "5", label: "Mercedes-Benz", value: "mercedes", description: "Premium engineering" },
	{ id: "6", label: "Audi", value: "audi", description: "Progressive technology" },
	{ id: "7", label: "Volkswagen", value: "vw", description: "People's car" },
	{ id: "8", label: "Chevrolet", value: "chevy", description: "American heritage" },
	{ id: "9", label: "Hyundai", value: "hyundai", description: "Value-oriented" },
	{ id: "10", label: "Kia", value: "kia", description: "Modern design" },
	{ id: "11", label: "Nissan", value: "nissan", description: "Innovation focus" },
	{ id: "12", label: "Mazda", value: "mazda", description: "Driving dynamics" },
	{ id: "13", label: "Subaru", value: "subaru", description: "All-wheel specialists" },
	{ id: "14", label: "Lexus", value: "lexus", description: "Luxury comfort" },
	{ id: "15", label: "Volvo", value: "volvo", description: "Safety priority" },
	{ id: "16", label: "Porsche", value: "porsche", description: "Performance heritage" },
	{ id: "17", label: "Tesla", value: "tesla", description: "Electric innovation" },
	{ id: "18", label: "Jeep", value: "jeep", description: "Off-road capable" },
	{ id: "19", label: "Land Rover", value: "landrover", description: "Luxury capability" },
	{ id: "20", label: "Jaguar", value: "jaguar", description: "British elegance" },
	{ id: "21", label: "Acura", value: "acura", description: "Premium Japanese" },
	{ id: "22", label: "Cadillac", value: "cadillac", description: "American luxury" },
];

export default function DropdownPickerPage() {
	const colors = useAppColors();
	const [selectedCar, setSelectedCar] = useState<MyCustomItem | null>(null);
	const [isPickerOpen, setIsPickerOpen] = useState(false);

	const handleCarSelect = (item: MyCustomItem) => {
		setSelectedCar(item);
		setIsPickerOpen(false);
		Alert.alert("Selected", `ID: ${item.id}, Value: ${item.value}, Label: ${item.label}`);
	};

	// custom renderItem
	const renderCustomDropdownItem: ListRenderItem<MyCustomItem> = ({ item }) => (
		<TouchableOpacity
			style={styles.customItem}
			onPress={() => handleCarSelect(item)} // Ensure your custom item handles press
		>
			<Ionicons name="car-sport-outline" size={20} color={colors.PrimaryNormal} />
			<View style={{ marginLeft: 10 }}>
				<Text style={[styles.customItemLabel, { color: colors.Neutral900 }]}>{item.label}</Text>
				{item.description && (
					<Text style={[styles.customItemDesc, { color: colors.Neutral500 }]}>{item.description}</Text>
				)}
			</View>
		</TouchableOpacity>
	);

	return (
		<SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bgColor }]}>
			<View style={styles.container}>
				<Text style={[styles.title, { color: colors.Neutral900 }]}>Dropdown Picker</Text>

				<DropdownPicker<MyCustomItem> // Specify the item type
					data={sampleData}
					isOpen={isPickerOpen}
					setIsOpen={setIsPickerOpen}
					onItemSelected={handleCarSelect}
					selectedValue={selectedCar}
					placeholder="Select Car Make"
					renderItem={renderCustomDropdownItem}
					// Styling Props
					triggerContainerStyle={{ borderColor: colors.PrimaryNormal, backgroundColor: colors.Neutral0 }}
					triggerTextStyle={{ color: colors.Neutral700 }}
					triggerIcon={<Ionicons name="chevron-down-outline" size={24} color={colors.Neutral500} />}
					reduceMotion="never"
					dropdownBackgroundColor={colors.Neutral0}
					dropdownItemTextStyle={{ color: colors.Neutral700 }}
					dropdownSeparatorColor={colors.Neutral500}
					containerStyle={{ marginBottom: 20, zIndex: 10 }}
				/>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: { flex: 1 },
	container: {
		flex: 1,
		padding: 20,
		alignItems: "center", // Center dropdown for demo
	},
	title: {
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 30,
	},
	selectedValueText: {
		marginTop: 20,
		fontSize: 16,
	},
	// For custom renderItem example
	customItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 12,
		paddingHorizontal: 16,
	},
	customItemLabel: {
		fontSize: 16,
		fontWeight: "500",
	},
	customItemDesc: {
		fontSize: 12,
	},
});

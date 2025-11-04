import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

interface AddButtonProps {
	onPress: () => void
}
export function AddButton({ onPress }: AddButtonProps) {
	return (
		<TouchableOpacity
			className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-lg"
			activeOpacity={0.8}
			onPress={onPress}>
			<Ionicons name="add" size={28} color="white" />
		</TouchableOpacity>
	);
}

import { theme } from "@/theme";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
interface PokeResponse {
    name: string;
    url: string;
}

export default function Index() {
    const [pokemons, setpokemons] = useState<PokeResponse[]>([]);
    const [fontsLoaded] = useFonts({
        inter: require("@/assets/fonts/Inter-VariableFont_opsz,wght.ttf"),
        inter_italics: require("@/assets/fonts/Inter-Italic-VariableFont_opsz,wght.ttf"),
    });

    useEffect(() => {
        const fetchPokemons = async () => {
            try {
                const response = await fetch(
                    "https://pokeapi.co/api/v2/pokemon?limit=10",
                );
                const data = await response.json();
                setpokemons(data.results);
            } catch (err) {
                console.log(err);
            }
        };
        fetchPokemons();
    }, []);

    if (!fontsLoaded) {
        return (
            <SafeAreaView
                style={[
                    styles.body,
                    { justifyContent: "center", alignItems: "center" },
                ]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.body}>
            <View>
                <Text style={styles.headerText}>Pokédex</Text>
                <Text style={styles.headerBody}>
                    Search for a Pokémon by name or using its National Pokédex
                    number.
                </Text>
            </View>
            <View style={styles.inputBoxBody}>
                <TextInput
                    style={styles.inputBox}
                    placeholder="Name or Number"
                />
                <Pressable style={styles.buttonStyle}>
                    <Text>Search</Text>
                </Pressable>
            </View>
            <View>
                <FlatList
                    data={pokemons}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => {
                        const urlParts = item.url.split("/");

                        const pokemonId = urlParts[urlParts.length - 2];
                        //example : ["https:", "", "pokeapi.co", "api", "v2", "pokemon", "8", ""]

                        // Now we build the official image URL using that ID
                        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

                        return (
                            <View style={styles.pokemonCard}>
                                {/* Render the image from the network using the 'uri' prop */}
                                <Image
                                    source={{ uri: imageUrl }}
                                    style={styles.pokemonImage}
                                />
                                <Text style={styles.pokemonName}>
                                    {item.name}
                                </Text>
                            </View>
                        );
                    }}
                    // Optional: Adds a little gap between items
                    contentContainerStyle={{ gap: 10, paddingBottom: 20 }}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: theme.colors.background,
        flex: 1,
        padding: 26,
    },
    inputBoxBody: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        gap: 20,
        marginTop: 30,
    },
    headerText: {
        color: theme.colors.primary,
        fontSize: 48,
        fontWeight: "900",
        marginBottom: 10,
        marginTop: 20,
        textAlign: "left",
        fontFamily: "inter",
    },
    headerBody: {
        color: theme.colors.primary + "80",
        fontFamily: "inter_italics",
        fontSize: 16,
        lineHeight: 30,
    },
    inputBox: {
        backgroundColor: theme.colors.secondry + "30",
        fontFamily: "inter",
        height: 60,
        paddingHorizontal: 30,
        borderRadius: 20,
        color: theme.colors.primary,
        width: 250,
        alignItems: "center",
    },
    buttonStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.primary + "70",
        paddingHorizontal: 15,
        borderRadius: 15,
        height: 60,
        color: theme.colors.primary,
    },
    pokemonCard: {
        backgroundColor: theme.colors.secondry + "20",
        padding: 15, // Reduced padding slightly to make room for the image
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "center",
    },
    pokemonImage: {
        width: 60,
        height: 60,
        marginRight: 15, // Adds space between the image and the text
    },
    pokemonName: {
        color: theme.colors.primary,
        fontFamily: "inter",
        fontSize: 20,
        textTransform: "capitalize",
        fontWeight: "bold",
    },
});

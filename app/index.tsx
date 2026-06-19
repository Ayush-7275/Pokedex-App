import { theme } from "@/theme";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    Keyboard,
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
    const [searchLimit, setSearchLimit] = useState(""); // 1. New state for the input box

    // 2. Extract the fetch function so it takes a "limit" parameter
    const fetchPokemons = async (limit: number) => {
        try {
            const response = await fetch(
                `https://pokeapi.co/api/v2/pokemon?limit=${limit}`,
            );
            const data = await response.json();
            setpokemons(data.results);
        } catch (err) {
            console.log(err);
        }
    };

    // Initial load: Fetch 10 Pokémon when the screen opens
    useEffect(() => {
        fetchPokemons(10);
    }, []);

    const handleSearch = () => {
        const limitNumber = parseInt(searchLimit, 10);

        // Make sure it's a valid number greater than 0 before fetching
        if (!isNaN(limitNumber) && limitNumber > 0) {
            fetchPokemons(limitNumber);
            Keyboard.dismiss(); // Hides the keyboard after searching
        }
    };

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
                    placeholder="Enter the number"
                    value={searchLimit} // Bind the state
                    onChangeText={setSearchLimit} // Update state when typing
                    keyboardType="numeric"
                />
                <Pressable style={styles.buttonStyle} onPress={handleSearch}>
                    <Text>Search</Text>
                </Pressable>
            </View>
            <View style={styles.flatListContainer}>
                <FlatList
                    data={pokemons}
                    keyExtractor={(item) => item.name}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={{ paddingBottom: 250 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        const urlParts = item.url.split("/");
                        const pokemonId = urlParts[urlParts.length - 2];
                        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
                        return (
                            <Pressable
                                style={styles.pokemonCard}
                                onPress={() => {
                                    router.push(`/pokemon/${item.name}/`);
                                }}>
                                <Image
                                    source={{ uri: imageUrl }}
                                    style={styles.pokemonImage}
                                />
                                <Text style={styles.pokemonName}>
                                    {item.name}
                                </Text>
                            </Pressable>
                        );
                    }}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: theme.colors.background,
        flex: 1,
        padding: 25,
    },
    inputBoxBody: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        gap: 20,
        marginTop: 30,
    },
    flatListContainer: {
        marginTop: 20,
    },
    headerText: {
        color: theme.colors.primary,
        fontSize: 48,
        marginBottom: 10,
        marginTop: 20,
        textAlign: "left",
        fontFamily: "poppinsExtraBold",
    },
    headerBody: {
        color: theme.colors.primary + "80",
        fontFamily: "poppinsSemiBold",
        fontSize: 16,
        lineHeight: 30,
    },
    inputBox: {
        backgroundColor: theme.colors.secondry + "30",
        fontFamily: "poppins",
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
        paddingVertical: 40,
        borderRadius: 15,
        alignItems: "center",
        width: "48%",
    },
    pokemonImage: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    pokemonName: {
        color: theme.colors.primary,
        fontFamily: "poppinsSemiBold",
        fontSize: 20,
        textTransform: "capitalize",
        fontWeight: "bold",
    },
    row: {
        justifyContent: "space-between",
        marginBottom: 15,
    },
});

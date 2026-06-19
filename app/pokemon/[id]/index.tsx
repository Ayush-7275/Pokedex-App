import { theme } from "@/theme";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// The main interface for our tailored Pokémon details
export interface PokemonDetailsResponse {
    id: number;
    name: string;
    height: number;
    weight: number;
    types: TypeSlot[];
    abilities: AbilitySlot[];
    stats: StatSlot[];
    sprites: Sprites;
}

interface TypeSlot {
    slot: number;
    type: {
        name: string;
        url: string;
    };
}

interface AbilitySlot {
    is_hidden: boolean;
    slot: number;
    ability: {
        name: string;
        url: string;
    };
}

interface StatSlot {
    base_stat: number;
    effort: number;
    stat: {
        name: string;
        url: string;
    };
}

interface Sprites {
    front_default: string | null;
    front_shiny: string | null;
    other: {
        "official-artwork": {
            front_default: string | null;
            front_shiny: string | null;
        };
    };
}

const PokemonDetails = () => {
    const { id } = useLocalSearchParams();
    const tabs = ["About", "Base Stats"];
    const [activeTab, setactiveTab] = useState("About");
    const [pokemonDetails, setpokemonDetails] =
        useState<PokemonDetailsResponse | null>(null);

    // FETCHING LOGIC
    const fetchPokemonDetails = async () => {
        try {
            const response = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${id}`,
            );
            const data = await response.json();
            setpokemonDetails(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPokemonDetails();
    }, []);

    // Format ID into a classic pokedex style string (e.g. #0493)
    const formatPokemonId = (num?: number) => {
        if (!num) return "";
        return `#${num.toString().padStart(4, "0")}`;
    };

    // Helper mapping human-readable labels to PokeAPI stat names
    const statAbbreviationMap: { [key: string]: string } = {
        hp: "HP",
        attack: "ATK",
        defense: "DEF",
        "special-attack": "SATK",
        "special-defense": "SDEF",
        speed: "SPD",
    };

    return (
        <SafeAreaView style={styles.body}>
            {/* HERO SECTION NAME AND ID */}
            <View style={styles.headerRow}>
                <Text style={styles.headerText}>
                    {pokemonDetails?.name || "Loading..."}
                </Text>
                <Text style={styles.idText}>
                    {formatPokemonId(pokemonDetails?.id)}
                </Text>
            </View>

            <View style={styles.imageContainer}>
                {/* HERO SECTION IMAGE */}
                {pokemonDetails?.sprites.other["official-artwork"].front_default ? (
                    <Image
                        source={{
                            uri: pokemonDetails.sprites.other["official-artwork"].front_default,
                        }}
                        style={styles.imageStyle}
                    />
                ) : (
                    <View style={[styles.imageStyle, styles.imagePlaceholder]}>
                        <Text style={styles.infoText}>No Image Available</Text>
                    </View>
                )}
            </View>

            {/* TYPES ROW */}
            <View style={styles.typesRow}>
                {pokemonDetails?.types.map((typeSlot) => (
                    <View key={typeSlot.type.name} style={styles.typeBadge}>
                        <Text style={styles.typeText}>{typeSlot.type.name}</Text>
                    </View>
                ))}
            </View>

            {/* DETAILS MENU NAVIGATION TABS */}
            <View style={styles.tabMenu}>
                {tabs.map((tab) => (
                    <Pressable
                        key={tab}
                        onPress={() => setactiveTab(tab)}
                        style={[
                            styles.tabButton,
                            activeTab === tab && styles.activeTabButton,
                        ]}>
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === tab && styles.activeTabText,
                            ]}>
                            {tab}
                        </Text>
                    </Pressable>
                ))}
            </View>

            {/* --- BOTTOM: CONDITIONAL TAB CONTENT --- */}
            <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
                {activeTab === "About" && pokemonDetails && (
                    <View style={styles.contentSection}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Height</Text>
                            <Text style={styles.infoValue}>
                                {pokemonDetails.height / 10} m
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Weight</Text>
                            <Text style={styles.infoValue}>
                                {pokemonDetails.weight / 10} kg
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Abilities</Text>
                            <Text style={styles.infoValue}>
                                {pokemonDetails.abilities
                                    .map((a) => a.ability.name)
                                    .join(", ")}
                            </Text>
                        </View>
                    </View>
                )}

                {activeTab === "Base Stats" && pokemonDetails && (
                    <View style={styles.contentSection}>
                        {pokemonDetails.stats.map((statSlot) => {
                            const label = statAbbreviationMap[statSlot.stat.name] || statSlot.stat.name;
                            // Safe percentage bounding values between 0 and 100 maxing out at an assumed max 255 stat baseline
                            const percentage = Math.min((statSlot.base_stat / 255) * 100, 100);

                            return (
                                <View key={statSlot.stat.name} style={styles.statRow}>
                                    <Text style={styles.statLabel}>{label}</Text>
                                    <Text style={styles.statValue}>{statSlot.base_stat}</Text>
                                    <View style={styles.progressBarBackground}>
                                        <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    body: {
        backgroundColor: theme.colors.background,
        flex: 1,
        padding: 25,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: 20,
    },
    headerText: {
        textTransform: "capitalize",
        fontSize: 32,
        fontFamily: "poppinsBold",
        color: theme.colors.primary,
    },
    idText: {
        fontSize: 20,
        fontFamily: "poppinsBold",
        color: theme.colors.primary + "80",
    },
    imageContainer: {
        backgroundColor: theme.colors.secondry + "30",
        paddingHorizontal: 30,
        paddingVertical: 40,
        borderRadius: 20,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    imageStyle: {
        width: 220,
        height: 220,
    },
    imagePlaceholder: {
        alignItems: "center",
        justifyContent: "center",
    },
    typesRow: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
        marginTop: 20,
        marginBottom: 10,
        width: "100%",
    },
    typeBadge: {
        backgroundColor: theme.colors.primary + "15",
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    typeText: {
        textTransform: "capitalize",
        fontFamily: "poppinsBold",
        color: theme.colors.primary,
        fontSize: 14,
    },
    tabMenu: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: theme.colors.primary + "15",
        width: "100%",
        marginTop: 15,
    },
    tabButton: {
        paddingBottom: 10,
        width: "45%",
        alignItems: "center",
    },
    activeTabButton: {
        borderBottomWidth: 3,
        borderColor: theme.colors.primary,
    },
    tabText: {
        fontSize: 16,
        color: theme.colors.secondry + "A0",
        fontFamily: "poppins",
    },
    activeTabText: {
        color: theme.colors.primary,
        fontFamily: "poppinsBold",
    },
    tabContent: {
        flex: 1,
        width: "100%",
        marginTop: 15,
    },
    contentSection: {
        gap: 18,
        paddingBottom: 40,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 2,
    },
    infoLabel: {
        width: 100,
        fontSize: 15,
        color: theme.colors.secondry,
        fontFamily: "poppinsBold",
    },
    infoText: {
        fontSize: 14,
        color: theme.colors.secondry,
        fontFamily: "poppins",
    },
    infoValue: {
        flex: 1,
        fontSize: 15,
        color: theme.colors.primary,
        fontFamily: "poppins",
        textTransform: "capitalize",
    },
    statRow: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },
    statLabel: {
        width: 50,
        fontSize: 14,
        color: theme.colors.secondry,
        fontFamily: "poppinsBold",
    },
    statValue: {
        width: 40,
        textAlign: "right",
        paddingRight: 10,
        fontSize: 14,
        color: theme.colors.primary,
        fontFamily: "poppins",
    },
    progressBarBackground: {
        flex: 1,
        height: 8,
        backgroundColor: theme.colors.secondry + "20",
        borderRadius: 4,
        overflow: "hidden",
    },
    progressBarFill: {
        height: "100%",
        backgroundColor: theme.colors.primary,
        borderRadius: 4,
    },
});

export default PokemonDetails;
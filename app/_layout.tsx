import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        poppins: require("@/assets/fonts/Poppins-Regular.ttf"),
        poppinsBold: require("@/assets/fonts/Poppins-Bold.ttf"),
        poppinsSemiBold: require("@/assets/fonts/Poppins-SemiBold.ttf"),
        poppinsLight: require("@/assets/fonts/Poppins-Light.ttf"),
        poppinsExtraBold: require("@/assets/fonts/Poppins-ExtraBold.ttf"),
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="index"
                options={{
                    title: "Home",
                }}
            />
        </Stack>
    );
}

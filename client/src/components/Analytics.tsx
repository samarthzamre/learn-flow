import { useEffect } from "react";
import { useSettings } from "@/contexts/SettingsContext";

export const Analytics = () => {
    const { settings } = useSettings();

    useEffect(() => {
        if (settings?.enableAnalytics === "true") {
            console.log("Analytics Service Initialized");
            // In a real app, you would initialize Google Analytics or similar here
        }
    }, [settings?.enableAnalytics]);

    return null; // Analytics components usually don't render anything visible
};

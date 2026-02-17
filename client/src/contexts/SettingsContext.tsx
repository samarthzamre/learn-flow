import { createContext, useContext, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSettings, type Settings } from "@/lib/api";

interface SettingsContextType {
    settings: Settings | undefined;
    isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({ settings: undefined, isLoading: true });

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const { data: settings, isLoading } = useQuery({
        queryKey: ["client-settings"],
        queryFn: getSettings,
        staleTime: 1000 * 60 * 5,
        retry: 2,
    });

    useEffect(() => {
        if (settings) {
            if (settings.siteName) {
                document.title = settings.siteName;
            }
            if (settings.darkModeDefault === "true") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }
    }, [settings]);

    return (
        <SettingsContext.Provider value={{ settings, isLoading }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    return useContext(SettingsContext);
};

import React, { createContext, useState } from "react";
import GlobalLoader from "./GlobalLoader";

interface LoaderContextType {
    start: () => void;
    stop: () => void;
}

export const LoaderContext =
    createContext<LoaderContextType | null>(null);

export default function LoaderProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(false);

    const start = () => setLoading(true);
    const stop = () => setLoading(false);

    return (
        <LoaderContext.Provider value={{ start, stop }}>
            {children}
            <GlobalLoader open={loading} />
        </LoaderContext.Provider>
    );
}
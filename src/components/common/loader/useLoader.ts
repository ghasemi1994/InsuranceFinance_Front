import { useContext } from "react";
import { LoaderContext } from "./LoaderProvider";

export const useLoader = () => {
    const context = useContext(LoaderContext);

    if (!context) {
        throw new Error(
            "useLoader must be used inside LoaderProvider"
        );
    }

    return context;
};
import React, { Suspense, useEffect } from "react";
import { useLoader } from "./useLoader";

function LoaderBridge({ children }: any) {
    const loader = useLoader();

    useEffect(() => {
        loader.start();
        return () => loader.stop();
    }, []);

    return children;
}

export default function SuspenseLoader({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Suspense
            fallback={
                <LoaderBridge>
                    <div />
                </LoaderBridge>
            }
        >
            {children}
        </Suspense>
    );
}
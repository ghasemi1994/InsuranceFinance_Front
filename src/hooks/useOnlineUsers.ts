import { useOnlineUsersStore } from "@/stores/useOnlineUsersStore";
import { startOnlineUsersConnection } from "@/utils/onlineUserService";
import { useEffect } from "react";

export const useOnlineUsers = (accessToken?: string) => {
    const setCount = useOnlineUsersStore(
        (state) => state.setCount,
    );

    useEffect(() => {
        if (!accessToken) {
            return;
        }

        let mounted = true;

        startOnlineUsersConnection(
            accessToken,
            (count) => {
                if (!mounted) {
                    return;
                }

                console.log(
                    "ONLINE USERS EVENT =>",
                    count,
                );

                setCount(count);
            },
        ).catch((error) => {
            console.error(
                "Online users SignalR connection failed",
                error,
            );
        });

        return () => {
            mounted = false;
        };
    }, [accessToken, setCount]);
};
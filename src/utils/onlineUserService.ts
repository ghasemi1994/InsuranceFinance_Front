import {
    HubConnection,
    HubConnectionBuilder,
} from "@microsoft/signalr";

let connection: HubConnection | null = null;
let connectionPromise: Promise<HubConnection> | null = null;

export const startOnlineUsersConnection = async (
    accessToken: string,
    onCountChanged: (count: number) => void,
) => {
    if (connection?.state === "Connected") {
        return connection;
    }

    if (connectionPromise) {
        return connectionPromise;
    }

    connection = new HubConnectionBuilder()
        .withUrl(
            `${import.meta.env.VITE_API_URL}/hubs/online-users`,
            {
                accessTokenFactory: () => accessToken,
            },
        )
        .withAutomaticReconnect()
        .build();

    connection.on(
        "OnlineUsersCountChanged",
        onCountChanged,
    );

    connectionPromise = connection
        .start()
        .then(() => {
            console.log("ONLINE USERS SIGNALR CONNECTED");

            return connection!;
        })
        .catch((error) => {
            connection = null;
            throw error;
        })
        .finally(() => {
            connectionPromise = null;
        });

    return connectionPromise;
};

export const stopOnlineUsersConnection = async () => {
    if (!connection) {
        return;
    }

    try {
        await connection.stop();
    } finally {
        connection = null;
        connectionPromise = null;
    }
};
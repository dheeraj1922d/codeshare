import { io } from "socket.io-client";

export const initSocket = async () => {
    const option = {
        forceNew: true,
        reconnectionAttempts: "Infinity",
        timeout: 10000,
        transports: ["websocket"],
    };

    console.log(process.env.REACT_APP_BACKEND_URL)

    return io(process.env.REACT_APP_BACKEND_URL, option);
};

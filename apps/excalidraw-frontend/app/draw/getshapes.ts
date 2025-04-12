import axios from "axios";
export async function getExistingShapes(roomId: string) {
    const response = await axios.get(`http://localhost:3001/api/v1/user/chats/${roomId}`);
    if (!response.data) return [];

    const messages = response.data.texts;
    const shapes = messages.map((msg: { message: string }) => {
        const messageData = JSON.parse(msg.message);
        return messageData.shape;
    });

    return shapes;
}
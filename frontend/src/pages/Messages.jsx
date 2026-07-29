import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { messagesApi } from "../api/messages";
import { useAuth } from "../context/AuthContext";

export default function Messages() {
    const {matchId} = useParams();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);

    const currentUserId = user?.user_id || user?.id;
    const otherUserName =
        messages.find(
            (message) =>
                Number(message.sender_user_id) !== Number(currentUserId)
        )?.sender_name || "Your Match";

    useEffect(() => {
        loadConversation();
    }, [matchId]);

    async function loadConversation() {
        try {
            const data = await messagesApi.getConversation(matchId);
            setMessages(data.messages || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleSend(e) {
        e.preventDefault();

        if (!text.trim()) return;

        try {
            const newMessage = await messagesApi.send(matchId, text);

            setMessages((prev) => [...prev, newMessage]);
            setText("");
        } catch (err) {
            console.error(err);
        }
    }

    if (loading) {
        return <p>Loading conversation...</p>;
    }


    return (
        <main className="messages-page">
            <section className="messages-shell">
                <header className="messages-header">
                    <div>
                        <Link className="messages-back" to="/matches">
                            ← Back to Matches
                        </Link>
                        <h1>{otherUserName}</h1>
                        <p>Accepted Roommate Match</p>
                    </div>
                    <div className="messages-avatar">
                        {otherUserName
                            .split(" ")
                            .map((name) => name[0])
                            .join("")
                            .slice(0, 2)}
                    </div>
                </header>

                <div className="messages-thread">
                    {messages.length === 0 ? (
                        <div className="messages-empty">
                            <h2>No messages yet</h2>
                            <p>
                                Start the conversation with your roommate!
                            </p>
                        </div>

                    ) : (

                        messages.map((message) => {

                            const mine =
                                Number(message.sender_user_id) === Number(currentUserId);

                            return (

                                <div
                                    key={message.message_id}
                                    className={
                                        mine
                                            ? "message-row mine"
                                            : "message-row"
                                    }
                                >

                                    <div
                                        className={
                                            mine
                                                ? "message-bubble mine"
                                                : "message-bubble"
                                        }
                                    >

                                        {!mine && (
                                            <strong>{message.sender_name}</strong>
                                        )}

                                        <p>{message.message_text}</p>

                                    </div>

                                </div>

                            );
                        })

                    )}

                </div>

                <form
                    className="message-form"
                    onSubmit={handleSend}
                >

                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type a message..."
                    />

                    <button type="submit">
                        Send
                    </button>

                </form>

            </section>
        </main>
    );
}
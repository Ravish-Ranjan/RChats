import { useChatStore } from "../../store/useChatStore.js";
import Sidebar from "./Sidebar.jsx";
import NoChats from "./NoChat.jsx";
import ChatContainer from "./ChatContainer.jsx";
import PropTypes from "prop-types";

function Home({ addToast }) {
    const { selectedUser } = useChatStore();

    return (
        <div className="bg-indigo-300 p-4" style={{ minHeight: "90vh" }}>
            <div className="flex items-center justify-center px-4">
                <div className="bg-gray-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100dvh-8rem)]">
                    <div className="flex h-full rounded-lg overflow-hidden">
                        <Sidebar addToast={addToast} />
                        {!selectedUser ? (
                            <NoChats />
                        ) : (
                            <ChatContainer addToast={addToast} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
Home.propTypes = {
    addToast: PropTypes.func.isRequired,
};
export default Home;

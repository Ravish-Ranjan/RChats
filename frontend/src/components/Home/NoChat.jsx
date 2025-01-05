import { Chat } from "@blueprintjs/icons";
import PropTypes from "prop-types";

function NoChat({ content }) {
    return (
        <div className="flex flex-col gap-2 h-full justify-center items-center w-full">
            <Chat className="" size={100} color="#C5CBD3" />
            <h1 className=" text-xl text-gray-500">
                {content || "Select a chat from sidebar to start conversation"}
            </h1>
        </div>
    );
}
NoChat.propTypes = {
    content: PropTypes.string,
};
export default NoChat;

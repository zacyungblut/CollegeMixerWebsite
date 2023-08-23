import { Rnd } from "react-rnd";
import { useState } from "react";
import { InputBase, IconButton, Checkbox, Tabs, Tab, Box } from '@mui/material';
import { sendEmail } from '../actions/autoInbound';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import IndentDecreaseIcon from '@mui/icons-material/FormatIndentDecrease';
import IndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease';
import ChevronDownIcon from '@mui/icons-material/ExpandMore';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import LinkIcon from '@mui/icons-material/Link';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ToolbarIcon from '@mui/icons-material/FormatPaint';
import { Editor, EditorState, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';


interface ComposePopupProps {
    onClose: () => void;
    initString: string;
    user: any;
    // emailAccounts: any;
    emailAccountSentTo: any;
    isReply: boolean;
    replyTo: string;
    replySubject: string;
}


const ComposePopup: React.FC<ComposePopupProps> = ({ onClose, initString, user, emailAccountSentTo, isReply, replyTo, replySubject }) => {

    const width = 600;
    const height = 500;

    const defaultSendFrom = user.email;

    const [isMinimized, setMinimized] = useState(false);
    const [scrollY, setScrollY] = useState(window.scrollY);
    const [scrollX, setScrollX] = useState(window.scrollX);
    const [isClosed, setClosed] = useState(false);
    const [textAreaValue, setTextAreaValue] = useState(initString || "");
    const [sendFrom, setSendFrom] = useState(emailAccountSentTo.emailAccount || defaultSendFrom);
    const [sendTo, setSendTo] = useState(isReply && replyTo || "");
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [initSubject, setInitSubject] = useState(isReply && replySubject || "");
    const [userToken, setUserToken] = useState(localStorage.getItem('profile') || '');
    const dispatch = useAppDispatch();


    const toggleInlineStyle = (event: React.MouseEvent, inlineStyle: string) => {
        event.preventDefault();
        const newState = RichUtils.toggleInlineStyle(editorState, inlineStyle);
        setEditorState(newState);
    }

    const onChange = (editorState: any) => setEditorState(editorState);

    const handleKeyCommand = (command: string, editorState: EditorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
    
        if (newState) {
            setEditorState(newState);
            return 'handled';
        }
    
        return 'not-handled';
    }

    const _onBoldClick = () => {
        const newState = setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
    }

    const _onItalicClick = () => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
    }

    const _onUnderlineClick = () => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
    }

    const style: React.CSSProperties = {
        position: 'fixed' as 'fixed',
        bottom: 0,
        right: 0,
        width: width,
        height: isMinimized ? 20 : height,
        borderRadius: '15px',
        border: "1px solid #ddd",
        background: "#fff",
    };

    const sendEmailFunction = async () => {
        await dispatch(sendEmail(userToken, initSubject, textAreaValue, emailAccountSentTo, sendTo));
        onClose();

    }


    const ComposeToolbar = () => (
        <div>
            <div className="toolbar rounded bg-white shadow shadow-gray-400 sticky p-2 flex justify-between items-center">
                <div className="flex space-x-2">
                    <button><UndoIcon /></button>
                    <button><RedoIcon /></button>
                    <button onClick={_onBoldClick}><FormatBoldIcon /></button>                   
                    <button><FormatItalicIcon /></button>
                    <button><FormatUnderlinedIcon /></button>
                    <button><FormatAlignLeftIcon /></button>
                    <button><FormatAlignCenterIcon /></button>
                    <button><FormatAlignRightIcon /></button>
                    <button><FormatListNumberedIcon /></button>
                    <button><FormatListBulletedIcon /></button>
                    <button><IndentDecreaseIcon /></button>
                    <button><IndentIncreaseIcon /></button>
                </div>
                <div className="flex space-x-2">
                    <button><TextFieldsIcon /></button>
                    <button><FormatSizeIcon /></button>
                    <button><ChevronDownIcon /></button>
                </div>
            </div>
            <div className="actions-toolbar flex justify-between items-center mt-6">
                <div className="flex space-x-2">
                <button onClick={sendEmailFunction} className="rounded-full shadow-lg hover:shadow-xl shadow-emerald-100 bg-emerald-500 text-white p-2 hover:bg-emerald-600 transition duration-200 ease-in-out hover:scale-110 transform mr-4">
                    <SendIcon />
                </button>
                <IconButton><ToolbarIcon /></IconButton>
                <IconButton><AttachFileIcon /></IconButton>
                <IconButton><LinkIcon /></IconButton>
                <IconButton><EmojiEmotionsIcon /></IconButton>
                <IconButton><InsertPhotoIcon /></IconButton>
                </div>
                <div>
                <IconButton><MoreVertIcon /></IconButton>
                </div>
            </div>
        </div>
    );

    const composeHeader = (
        
        <div onClick={()=>setMinimized(false)} className={`bg-blue-50 flex justify-between items-center px-3 py-1 rounded-t-lg ${isMinimized ? 'cursor-pointer hover:shadow-inner hover:bg-blue-100 transition duration-150' : 'cursor-default'}`}>
            <div className="font-medium text-sm">New Message</div>
            <div onClick={(event)=> {event.stopPropagation();}}>
                <IconButton
                    className="text-gray-500 hover:text-gray-600 mx-1"
                    onClick={() => setMinimized(!isMinimized)}
                >
                    <RemoveIcon className="" />
                </IconButton>
                <IconButton
                    className="text-gray-500 hover:text-gray-600 mx-1"
                    onClick={() => setMinimized(!isMinimized)}
                >
                    {isMinimized ? <FullscreenExitIcon /> : <FullscreenIcon />} 
                </IconButton>
                <IconButton
                    className="text-gray-500 hover:text-gray-600 mx-1"
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
            </div>
        </div>
    );

    const composeBody = (
        <div className="p-3 space-y-2 flex flex-col">
        <div className="flex text-sm items-center space-x-2 mb-2">
            <span className="font-base">From</span>
            <span>{user?.name} {"<"}{sendFrom}{">"}</span>
            <ExpandMoreIcon />
        </div>
        <div className="flex text-sm flex-row border-b pb-3 border-gray-200 focus:outline-none focus:border-blue-300">
            <label className="font-medium mr-4">To</label>
            <input className="focus:outline-none" value={sendTo} onChange={e => setSendTo(e.target.value)} />
        </div>
        <div className="flex flex-row border-b pb-3 w-full border-gray-200 focus:outline-none focus:border-blue-300">
            <input placeholder="Subject" className="focus:outline-none" value={initSubject} onChange={e => setInitSubject(e.target.value)} />
        </div>
        <textarea value={textAreaValue} onChange={e => setTextAreaValue(e.target.value)} className="w-full focus:outline-none rounded p-2 flex-grow mt-2 h-[165px]" placeholder="">

        </textarea>
        {/* <div className="w-full focus:outline-none rounded p-2 flex-grow mt-2 h-[165px]">
            <Editor editorState={editorState} handleKeyCommand={handleKeyCommand} onChange={onChange} />
        </div> */}
        <div className="p-3 space-y-2">
            <ComposeToolbar />
        </div>

        </div>
    );

    

    if (isClosed) return null;


    return (
        <Rnd
            style={style}
            size={{ width: isMinimized ? 10 : width, height: isMinimized ? 50 : height }}
            position={{
                x: !isMinimized ? (window.innerWidth - width - 140 + scrollX) : window.innerWidth - width + 100 + scrollX, 
                y: !isMinimized ? (window.innerHeight - height - 70 + scrollY) : window.innerHeight - height +387 + scrollY,
              }}
            minHeight={50} // minimum height to show header when minimized
            minWidth={300}
            enableResizing={!isMinimized}
            // disableDragging={isMinimized}
            disableDragging={true}
            dragAxis="x"
            className="shadow-lg"
        >
            {composeHeader}
            {!isMinimized && composeBody}
        </Rnd>
    );
};

export default ComposePopup;

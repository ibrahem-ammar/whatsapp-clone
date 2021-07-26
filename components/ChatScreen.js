import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth,db } from "../firebase";
import { useRouter } from "next/router";
import { Avatar, IconButton } from "@material-ui/core";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import getRecipientEmail from "../utls/getRecipientEmail";
import { useState } from 'react';
import firebase from "firebase";
import TimeAgo from "timeago-react";

export default function ChatScreen({ chat,messages }) {
    // console.log(chat,messages);
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [input, setInput] = useState("")
    const [messagesSnapshot] = useCollection(db.collection('chats').doc(router.query.id).collection('messages').orderBy('timestamp','asc'));
    
    const recipientEmail = getRecipientEmail(chat.users,user.email)

    const [recipientSnapshot] = useCollection(
        db.collection("users").where('email','==',recipientEmail)
    );

    const recipient = recipientSnapshot?.docs?.[0]?.data();

    const showMessages = () => {
        if(messagesSnapshot) {
            return messagesSnapshot.docs.map(message => (
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime(),
                    }} 
                />
            ));
        } else {
            return JSON.parse(messages).map(message=>(
                <Message
                    key={message.id}
                    user={message.user}
                    message={message} 
                />
            ))
        }
    }

    const sendMessage = e => {
        e.preventDefault();

        db.collection("users").doc(user.uid).set({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        },{ merge: true });

        db.collection("chats").doc(router.query.id).collection("messages").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL,
        });

        setInput("");


    }



    return (
        <Container>
            <Header>
                {
                    recipient ? (
                        <Avatar  src={recipient?.photoUrl} />
                    ) : (
                        <Avatar>{recipientEmail[0]}</Avatar>
                    )
                }

                <HeaderInformation>
                    <h3>{ recipientEmail }</h3>
                    {
                        recipientSnapshot ? (
                            <p>
                                Last Active : {" "} 
                                {
                                    recipient?.lastSeen?.toDate() ? (
                                        <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                                    ) : (
                                        "unavailable"
                                    )
                                }
                            </p>

                        ) : (
                            "Loading ...."
                        )
                    }
                </HeaderInformation>

                <HeaderIcons>

                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>

                </HeaderIcons>

            </Header>

            <MessagesContainer>
                {/* SHOW MESSAGES FUNCTION */}
                {showMessages()}

                <EndOfMessages />
            </MessagesContainer>

            <InputContainer onSubmit={input && sendMessage}>
                <InsertEmoticonIcon />
                <Input value={input} onChange={ e => setInput(e.target.value)} />
                <MicIcon />
            </InputContainer>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
`;

const Header = styled.div`
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: white;
    display: flex;
    padding:11px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;

    > h3 {
        margin-bottom: 3px;
    }

    > p {
        font-size: 14px;
        color: gray;
    }
`;

const HeaderIcons = styled.div`

`;

const MessagesContainer = styled.div`
    flex: 1;
    padding: 30px;
    background-color: #e5ded8
`;

const EndOfMessages = styled.div``;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    position: sticky;
    bottom: 0;
    padding: 10px;
    background-color: white;
    z-index: 100;
`;

const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 10px;
    margin-left: 15px;
    margin-right: 15px;
    padding: 20px;
    background-color: whitesmoke;
`;

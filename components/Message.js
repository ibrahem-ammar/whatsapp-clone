import styled from 'styled-components'
import { useAuthState } from "react-firebase-hooks/auth";
import { auth,db } from "../firebase";
import moment from 'moment';

export default function Message({ user,message }) {
    const [loggedInUser] = useAuthState(auth);
    const TypeOfMessage = user === loggedInUser ? Sender : Reciever;
    return (
        <Container>
            <TypeOfMessage>
                {message.message}
                <Timestamp>
                    {
                        message.timestamp ? moment(message.timestamp).format('LT') : "..."
                    }
                </Timestamp>
            </TypeOfMessage>
        </Container>
    )
}

const Container = styled.div``;

const MessageElement = styled.p`
    width: fit-content;
    padding: 15px;
    border-radius: 0 8px 8px;
    margin: 10px;
    min-width: 60px;
    padding-bottom: 26px;
    poition: relative;
    text-align: right;
`;

const Sender = styled(MessageElement)`
    margin-left: auto;
    background-color: #dcf8c6;
    border-radius: 8px 0 8px 8px;

`;

const Reciever = styled(MessageElement)`
    text-align: left;
    background-color: whitesmoke;
`;

const Timestamp = styled.span`
    color: gray;
    padding: 10px;
    font-size: 9px;
    position: absolute;
    bottom: 0;
    right: 0;
    align-text: right;
`;
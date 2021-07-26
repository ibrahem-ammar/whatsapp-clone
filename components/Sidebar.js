import styled from 'styled-components';
import { Avatar,Button,IconButton} from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import * as EmailValidator from 'email-validator';
import { auth,db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import Chat from './Chat';

export default function Sidebar() {
    const [user] = useAuthState(auth);
    const userChatRef = db.collection('chats').where('users','array-contains',user.email);
    const [chatsSnapshot] = useCollection(userChatRef);

    const checkIfChatExists = (recipientEmil) => !!chatsSnapshot?.docs.find(
            (chat)=>chat.data().users.find(
                (user)=> user === recipientEmil
                )?.length > 0 
            );

    const createChat = () => {
        const input = prompt("Please Enter User Email To Start The Chat");

        if (!input) return null;

        if(EmailValidator.validate(input) && !checkIfChatExists(input) && input !== user.email ){
            db.collection('chats').add({
                users: [user.email,input],
            });
        }
    }

    return (
        <Container>

            <Header>

                <UserAvatar src={user.photoURL}/>
                
                <IconsContainer>

                    <IconButton>
                        <ChatIcon />
                    </IconButton>

                    <IconButton onClick={() => auth.signOut()}>
                        <ExitToAppIcon />
                    </IconButton>

                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>

                </IconsContainer>
                
            </Header>

            <Search>

                <SearchIcon />

                <SearchInput placeholder="search in chats"/>

            </Search>

            <SidebarButton onClick={createChat}>start a new chat</SidebarButton>

            {/* LIST OF CHATS */}

            {
                chatsSnapshot?.docs.map(
                    (chat) => (
                        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
                    )
                )
            }

        </Container>
    )
}


const Container = styled.div`
    flex: 0.45;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    min-width: 200px;
    max-width: 350px;
    overflow-y: scroll;

    ::-webkit-scrollbar{
        display: none;
    }

    -ms-overflow-style: none;

    scrollbar-width: none;
`;

const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
    align-items: center;
    justify-content: space-between;
    padding:15px;
    height:80px;
    border-bottom: 1px solid whitesmoke;

`;

const UserAvatar = styled(Avatar)`
    cursor: pointer;

    :hover{
        opacity: 0.8;
    }
`;

const IconsContainer = styled.div``;

const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 2px;

`;

const SearchInput = styled.input`
    outline: none;
    border: none;
    flex: 1;
`;

const SidebarButton = styled(Button)`
    width: 100%;

    &&& {
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }
`;
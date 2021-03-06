import styled from 'styled-components'
import { Avatar } from '@material-ui/core'
import getRecipientEmail from '../utls/getRecipientEmail';
import { auth,db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter } from 'next/router';

export default function Chat({ id,users }) {
    const [user] = useAuthState(auth);
    const recipientEmail = getRecipientEmail(users,user.email);

    const [recipientSnapshot] = useCollection(
        db.collection('users').where('email','==',recipientEmail)
    );

    const recipient = recipientSnapshot?.docs?.[0]?.data();

    const router = useRouter();

    const enterChat = () => {
        router.push(`/chat/${ id }`);
    }


    return (
        <Container onClick={enterChat}>
            {
                recipient ? (
                    <UserAvatar  src={recipient?.photoUrl} />
                ) : (
                    <UserAvatar>{recipientEmail[0]}</UserAvatar>
                )
            }
            <p>{ recipientEmail }</p>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break: break-word;

    :hover {
        background-color: #e9eaeb;
    }
`;

const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`;
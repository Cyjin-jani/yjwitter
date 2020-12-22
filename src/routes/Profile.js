import { authService, dbService } from 'fbase'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';

function Profile({ refreshUser, userObj }) {
    const history = useHistory();
    const [newDisplayName, setnewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    }

    const onChange = (event) => {
        const {target: {value},} = event;
        setnewDisplayName(value);
    }

    const getMyCweets = async() => {
        const cweets = await dbService.collection("cweets").where("creatorId", "==", userObj.uid).
        orderBy("createdAt").get();
        // console.log(cweets.docs.map(doc => doc.data()));
    }

    useEffect(() => {
        getMyCweets();
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName) {
            await userObj.updateProfile({
                displayName: newDisplayName,
            });
            refreshUser();
        }
    }

    return (
        <>
        <form onSubmit={onSubmit}>
            <input type="text" placeholder="Display name" onChange={onChange} value={newDisplayName} />
            <input type="submit" value="Update Profile" />
        </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    )
}

export default Profile

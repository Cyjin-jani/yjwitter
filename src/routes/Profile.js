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
        const cweets = await dbService.collection("cweets").where("creatorId", "==", userObj.uid).orderBy("createdAt").get();
        console.log(cweets.docs.map(doc => doc.data()));
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
        <div className="container">
        <form onSubmit={onSubmit} className="profileForm">
            <input type="text" placeholder="Display name" onChange={onChange} value={newDisplayName} autoFocus className="formInput" />
            <input
                type="submit"
                value="Update Profile"
                className="formBtn"
                style={{
                    marginTop: 10,
                }}
            />
        </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                Log Out
            </span>
        </div>
    )
}

export default Profile
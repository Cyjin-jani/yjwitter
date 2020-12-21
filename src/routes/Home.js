import { dbService, storageService } from 'fbase';
import React, { useEffect, useState } from 'react';
import Cweet from '../components/Cweet';
import {v4 as uuidv4} from 'uuid';

function Home({ userObj }) {
    const [cweet, setCweet] = useState("");
    const [cweets, setCweets] = useState([]);
    const [attachment, setAttachment] = useState();
    
    useEffect(() => {
        
        dbService.collection("cweets").onSnapshot(snapshot => {
            const cweetArray = snapshot.docs.map(doc => ({
                id: doc.id, ...doc.data(),
            }));
            setCweets(cweetArray);
        })
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        let attachmentUrl = "";

        if(attachment !== "") {
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const cweetObj = {
            text: cweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        }

        await dbService.collection("cweets").add(cweetObj);
        setCweet("");
        setAttachment("");

    }

    const onChange = (event) => {
        const { target: { value }} = event;
        setCweet(value);
    }

    const onFileChange = (event) => {
        const {target: {files}} = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {currentTarget: {result}} = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }
    const onClearAttachment = () => setAttachment(null);
    
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={cweet} onChange={onChange} type="text" placeholder="what's on your mind?" maxLength={120} />
                <input type="file" accept="image/*" onChange={onFileChange} />
                <input type="submit" onSubmit={onSubmit} value="Cweet" />
                { attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px" /> 
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>
                )} 
            </form>
            <div>
                {cweets.map(cweet => (
                    <Cweet key={cweet.id} cweetObj={cweet} isOwner={cweet.creatorId === userObj.uid} />
                ))}
            </div>
        </div>
    )
}

export default Home;

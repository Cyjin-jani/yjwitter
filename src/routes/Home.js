import { dbService } from 'fbase';
import React, { useEffect, useState } from 'react';
import Cweet from '../components/Cweet';

function Home({ userObj }) {
    const [cweet, setCweet] = useState("");
    const [cweets, setCweets] = useState([]);
    
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
        await dbService.collection("cweets").add({
            text: cweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
        });
        setCweet("");
    }

    const onChange = (event) => {
        const { target: { value }} = event;
        setCweet(value);
    }
    
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={cweet} onChange={onChange} type="text" placeholder="what's on your mind?" maxLength={120} />
                <input type="submit" onSubmit={onSubmit} value="Cweet" />
            </form>
            <div>
                {cweets.map(cweet => (
                    <Cweet key={cweet.id} cweetObj={cweet} isOwner={cweet.creatorId === userObj.uid} />
                ))}
            </div>
        </div>
    )
}

export default Home

import { dbService } from 'fbase';
import React, { useEffect, useState } from 'react';
import Cweet from '../components/Cweet';
import CweetFactory from 'components/CweetFactory';

function Home({ userObj }) {
    const [cweets, setCweets] = useState([]);
        
    useEffect(() => {
        
        dbService.collection("cweets").onSnapshot(snapshot => {
            const cweetArray = snapshot.docs.map(doc => ({
                id: doc.id, ...doc.data(),
            }));
            setCweets(cweetArray);
        })
    }, []);
    
    return (
        <div className="container">
            <CweetFactory userObj={userObj} />
            <div style={{ marginTop: 30 }}>
                {cweets.map(cweet => (
                    <Cweet key={cweet.id} cweetObj={cweet} isOwner={cweet.creatorId === userObj.uid} />
                ))}
            </div>
        </div>
    )
}

export default Home;

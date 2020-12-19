import { dbService } from 'fbase';
import React, { useState } from 'react'

function Cweet({ cweetObj, isOwner }) {
    const [editing, setEditing] = useState(false);
    const [newCweet, setNewCweet] = useState(cweetObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you Sure you want to Delete this cweet?");
        if(ok) {
            //delete cweet
            await dbService.doc(`cweets/${cweetObj.id}`).delete();
        }
    }
    const toggleEditing = () => setEditing(prev => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`cweets/${cweetObj.id}`).update({
            text: newCweet
        });
        setEditing(false);
    }
    const onChange = (event) => {
        const {target: {value}} = event;
        setNewCweet(value);
    }

    return (
        <div>
            {
                editing ? (
                    <>
                    {isOwner && <>
                        <form onSubmit={onSubmit}>
                            <input type="text" placeholder="edit cweet" value={newCweet} required onChange={onChange} />
                            <input type="submit" value="Update Cweet" />
                        </form>
                            <button onClick={toggleEditing}>Cancel</button>
                        </>
                    }
                    </>
                ) : (<>
                    <h4>{cweetObj.text}</h4>
                    {isOwner && (
                        <>
                            <button onClick={onDeleteClick}>Delete</button>
                            <button onClick={toggleEditing}>Edit</button>
                        </>
                    )}
                 </>)
            }

        </div>
    )
}

export default Cweet

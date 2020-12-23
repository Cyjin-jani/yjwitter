import { dbService, storageService } from 'fbase';
import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

function Cweet({ cweetObj, isOwner }) {
    const [editing, setEditing] = useState(false);
    const [newCweet, setNewCweet] = useState(cweetObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you Sure you want to Delete this cweet?");
        if(ok) {
            //delete cweet
            await dbService.doc(`cweets/${cweetObj.id}`).delete();
            //delete photo
            await storageService.refFromURL(cweetObj.attachmentUrl).delete();
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
        <div className="nweet">
            {
                editing ? (
                    <>
                    {isOwner && <>
                        <form onSubmit={onSubmit} className="container nweetEdit">
                            <input type="text" placeholder="edit cweet" value={newCweet} required onChange={onChange} autoFocus className="formInput" />
                            <input type="submit" value="Update Cweet" className="formBtn" />
                        </form>
                        <span onClick={toggleEditing} className="formBtn cancelBtn">
                            Cancel
                        </span>
                        </>
                    }
                    </>
                ) : (<>
                    <h4>{cweetObj.text}</h4>
                    {cweetObj.attachmentUrl && <img src={cweetObj.attachmentUrl} />}
                    {isOwner && (
                         <div class="nweet__actions">
                              <span onClick={onDeleteClick}>
                                <FontAwesomeIcon icon={faTrash} />
                              </span>
                              <span onClick={toggleEditing}>
                                <FontAwesomeIcon icon={faPencilAlt} />
                              </span>   
                        </div>
                    )}
                 </>)
            }

        </div>
    )
}

export default Cweet

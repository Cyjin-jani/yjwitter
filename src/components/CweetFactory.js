import React, { useState } from 'react';
import { dbService, storageService } from 'fbase';
import {v4 as uuidv4} from 'uuid';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

function CweetFactory({ userObj }) {

    const [cweet, setCweet] = useState("");
    const [attachment, setAttachment] = useState("");

    const onSubmit = async (e) => {
        if (cweet === "") {
            return;
        }
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
    const onClearAttachment = () => setAttachment("");


    return (
        <div>
            <form onSubmit={onSubmit} className="factoryForm">
                <div className="factoryInput__container">
                    <input
                    className="factoryInput__input"
                    value={cweet}
                    onChange={onChange}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120}
                    />
                    <input type="submit" value="&rarr;" className="factoryInput__arrow" />
                </div>
                <label for="attach-file" className="factoryInput__label">
                    <span>Add photos</span>
                    <FontAwesomeIcon icon={faPlus} />
                </label>

                <input 
                    id="attach-file"
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    style={{
                        opacity: 0,
                      }}
                />
               
                { attachment && (
                    <div className="factoryForm__attachment">
                        <img
                            src={attachment}
                            style={{
                              backgroundImage: attachment,
                            }}
                        />
                        <div className="factoryForm__clear" onClick={onClearAttachment}>
                            <span>Remove</span>
                            <FontAwesomeIcon icon={faTimes} />
                        </div>
                    </div>
                )} 
            </form>
        </div>
    )
}

export default CweetFactory

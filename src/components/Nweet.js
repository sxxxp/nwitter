import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { dbService } from "FirebaseInst";
import { storageService } from "FirebaseInst";
import { deleteObject, ref } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
const Nweet = ({ nweetObj, isOwner }) => {
  const TextRef = doc(dbService, "nweets", nweetObj.id);
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("정말로 이 메시지를 지울까요?");
    if (ok) {
      await deleteDoc(TextRef);
      if (nweetObj.attachmentURL !== "")
        await deleteObject(ref(storageService, nweetObj.attachmentURL));
    }
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(TextRef, {
      text: newNweet,
    });
    setEditing(false);
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  return (
    <div className="nweet">
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit} className="container nweetEdit">
                <input
                  type="text"
                  placeholder="수정할 메시지를 작성해주세요."
                  value={newNweet}
                  onChange={onChange}
                  required
                  autoFocus
                  className="formInput"
                />
                <input type="submit" value="업데이트" className="formBtn" />
              </form>
              <span onClick={toggleEditing} className="formBtn cancelBtn">
                취소
              </span>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentURL && (
            <img src={nweetObj.attachmentURL} alt="attachment" />
          )}
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;

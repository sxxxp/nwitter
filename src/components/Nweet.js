import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { dbService } from "FirebaseInst";

const Nweet = ({ nweetObj, isOwner }) => {
  const TextRef = doc(dbService, "nweets", nweetObj.id);
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("정말로 이 메시지를 지울까요?");
    if (ok) {
      await deleteDoc(TextRef);
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
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="수정할 메시지를 작성해주세요."
              value={newNweet}
              onChange={onChange}
              required
            />
            <input type="submit" value="업데이트" />
          </form>
          <button onClick={toggleEditing}>취소</button>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>메시지 삭제</button>
              <button onClick={toggleEditing}>메시지 수정</button>
              <br />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;

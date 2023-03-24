import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { authService, dbService, storageService } from "FirebaseInst";
import { updateProfile } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const Profile = ({ refreshUser, userObj }) => {
  console.log(userObj);
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [attachment, setAttachment] = useState(userObj.photoURL);
  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };
  const getMynweets = async () => {
    const q = query(
      collection(dbService, "nweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt", "asc")
    );
    const nweets = await getDocs(q);
    nweets.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(theFile);
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentURL = "";
    if (attachment !== "" && attachment !== userObj.photoURL) {
      const attachmentRef = ref(storageService, `profileImage/${userObj.uid}`);
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentURL = await getDownloadURL(response.ref);
    }
    if (
      userObj.displayName !== newDisplayName ||
      userObj.photoURL !== attachment
    ) {
      console.log(attachmentURL);
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
        photoURL: attachmentURL,
      });
      refreshUser();
    }
  };
  useEffect(() => {
    getMynweets();
  });
  console.log(attachment);
  return (
    <div className="article">
      <div className="container">
        <form onSubmit={onSubmit} className="profileForm">
          {attachment && (
            <div className="factoryForm__attachment">
              <img
                src={attachment}
                style={{
                  backgroundImage: attachment,
                  margin: "0 auto",
                  marginBottom: 18,
                }}
                alt="attachemnet"
              />
            </div>
          )}
          <input
            type="text"
            placeholder="닉네임 변경"
            onChange={onChange}
            autoFocus
            required
            value={newDisplayName}
            className="formInput"
          />

          <label
            htmlFor="attach-file"
            className="factoryInput__label"
            style={{ textAlign: "center", marginTop: 16 }}
          >
            <span>사진 변경하기</span>
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
          <input
            type="submit"
            value="프로필 업데이트"
            className="formBtn"
            style={{ marginTop: 10 }}
          />
        </form>
        <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
          로그아웃
        </span>
      </div>
    </div>
  );
};

export default Profile;

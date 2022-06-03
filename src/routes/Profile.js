import { authService, dbService } from "myBase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "@firebase/firestore";
import { updateProfile } from "@firebase/auth";

function Profile({ userObj, refreshUser }) {
  const [disName, setDisName] = useState(userObj.displayName);
  const navigate = useNavigate();
  const onOutClick = () => {
    authService.signOut();
    navigate("/");
  };
  const getNweets = async () => {
    const q = query(
      collection(dbService, "nweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => console.log(doc.id, "=>", doc.data()));
  };
  useEffect(() => {
    getNweets();
  }, []);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setDisName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== disName) {
      await updateProfile(authService.currentUser, { displayName: disName });
    }
    refreshUser();
  };
  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          autoFocus
          onChange={onChange}
          value={disName}
          type="text"
          placeholder="display name "
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onOutClick}>
        Log Out
      </span>
    </div>
  );
}

export default Profile;

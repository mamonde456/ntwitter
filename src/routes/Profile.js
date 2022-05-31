import { authService } from "myBase";
import React from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const onOutClick = () => {
    authService.signOut();
    navigate("/");
  };
  return (
    <>
      <button onClick={onOutClick}>Log Out</button>
    </>
  );
}

export default Profile;

import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { dbService, storageService } from "myBase";
import { useState } from "react";

function Nweet({ nweetObj, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newNweet, setNweet] = useState(nweetObj.Nweet);
  const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);
  const onDelete = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      await deleteDoc(NweetTextRef);
      if (nweetObj.imgFileUrl) {
        const imgFileRef = ref(storageService, nweetObj.imgFileUrl);
        await deleteObject(imgFileRef);
      }
    }
  };
  const onEditing = () => {
    setIsEditing((prev) => !prev);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(NweetTextRef, { text: newNweet });
    setIsEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  return (
    <div>
      {isEditing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your nweet"
              value={newNweet}
              onChange={onChange}
              required
            />
            <input type="submit" value="update" />
          </form>
          <button onClick={onEditing}>cancel</button>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.imgFileUrl && (
            <img src={nweetObj.imgFileUrl} width="50px" height="50px" />
          )}
          {isOwner && (
            <>
              <button onClick={onDelete}>delete</button>
              <button onClick={onEditing}>edit</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Nweet;

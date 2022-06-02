import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { dbService, storageService } from "myBase";
import React, { useEffect, useRef, useState } from "react";
import Nweet from "../components/Nweet";
import { v4 } from "uuid";

function Home({ userObj }) {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [imgFile, setImgFile] = useState("");
  const imgInput = useRef();

  useEffect(() => {
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const nweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArr);
    });
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    let imgFileUrl = "";
    if (imgFileUrl !== "") {
      const imgRef = ref(storageService, `${userObj.uid}/${v4()}`);
      const response = await uploadString(imgRef, imgFile, "data_url");
      imgFileUrl = await getDownloadURL(response.ref);
    }
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      imgFileUrl,
    };
    await addDoc(collection(dbService, "nweets"), nweetObj);
    setNweet("");
    setImgFile("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };
  const onFile = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setImgFile(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearImg = () => {
    console.log(imgInput.current);

    setImgFile("");
    imgInput.current.value = "";
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
          onChange={onChange}
          value={nweet}
        />
        <input type="file" accept="image/*" onChange={onFile} ref={imgInput} />
        <input type="submit" value="Nweet" />
        {imgFile && (
          <div>
            <img src={imgFile} width="50px" height="50px" />
            <button onClick={onClearImg}>clear</button>
          </div>
        )}
      </form>
      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;

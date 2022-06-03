import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { dbService, storageService } from "myBase";
import { useRef, useState } from "react";
import { v4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function NweetFactory({ userObj }) {
  const [nweet, setNweet] = useState("");
  const [imgFile, setImgFile] = useState("");
  const imgInput = useRef();

  const onSubmit = async (event) => {
    if (nweet === "") {
      return;
    }
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
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onChange}
        style={{
          opacity: 0,
        }}
        ref={imgInput}
      />
      {imgFile && (
        <div className="factoryForm__attachment">
          <img
            src={imgFile}
            style={{
              backgroundImage: imgFile,
            }}
          />{" "}
          <div className="factoryForm__clear" onClick={onClearImg}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
}

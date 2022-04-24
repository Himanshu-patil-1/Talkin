import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import React from 'react';
import { useSelector } from 'react-redux';
import { app, db } from '../../firebase/config';
import styles from './Home.module.scss';
import useRecorder from '../../hooks/useRecorder';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const Home = () => {
  let [audioURL, isRecording, startRecording, stopRecording, ClearAudioURL] =
    useRecorder();
  const { user } = useSelector((state) => state.user);
  const colRef = collection(db, 'messages');
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState(null);
  const [uploadingAudio, setUploadingAudio] = React.useState(false);
  const [deletingAudio, setDeletingAudio] = React.useState(false);
  const storage = getStorage(app);

  const getMessages = () => {
    const q = query(colRef, orderBy('createdAt'));
    return onSnapshot(q, (snapshot) => {
      let messagesData = [];
      snapshot.docs.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messagesData);
    });
  };

  const sendMessage = async () => {
    if (message !== '' || ' ') {
      try {
        await addDoc(colRef, {
          message: message,
          name: user.name,
          email: user.email,
          createdAt: serverTimestamp(),
        });
        setMessage('');
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  const deleteMessage = async (id) => {
    const deleteRef = doc(db, 'messages', id);
    try {
      await deleteDoc(deleteRef);
    } catch (err) {
      console.log(err.message);
    }
  };

  const sendAudio = () => {
    setUploadingAudio(true);
    let fileName = uuidv4();
    const storageRef = ref(storage, `voiceNotes/${fileName}`);
    uploadBytes(storageRef, audioURL).then((snapshot) => {
      getDownloadURL(storageRef).then((url) => {
        addDoc(colRef, {
          audio: url,
          fileName: fileName,
          name: user.name,
          email: user.email,
          createdAt: serverTimestamp(),
        });
        ClearAudioURL();
        setUploadingAudio(false);
      });
    });
  };

  const deleteAudio = (fileName, id) => {
    const desertRef = ref(storage, `voiceNotes/${fileName}`);
    setDeletingAudio(true);
    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        console.log('file delted');
        const deleteRef = doc(db, 'messages', id);
        deleteDoc(deleteRef).then(() => {
          console.log('message deleted');
          setDeletingAudio(false);
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  React.useEffect(() => {
    const unsubscribe = getMessages();
    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.MessageArea}>
        {messages === null ? (
          <h1>loading</h1>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={styles.Message}
              style={{
                alignSelf:
                  message.email === user.email ? 'flex-end' : 'flex-start',
              }}
            >
              <h1>
                {message.message}
                {message.email === user.email && !message.audio ? (
                  <i
                    className="fa-solid fa-trash ml-3"
                    onClick={() => deleteMessage(message.id)}
                  ></i>
                ) : null}
              </h1>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px',
                }}
              >
                <p>{message.name.split(' ')[0]}</p>
                {message.audio ? (
                  deletingAudio ? (
                    <h1>deleting ...</h1>
                  ) : (
                    <i
                      className="fa-solid fa-trash ml-3"
                      onClick={() => deleteAudio(message.fileName, message.id)}
                    ></i>
                  )
                ) : null}
              </div>
              {message.audio && <audio src={message.audio} controls />}
            </div>
          ))
        )}
      </div>
      <div className={`${styles.SendMessageContainer} is-flex`}>
        <input
          className="input"
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          placeholder="Enter your message"
        />
        {!isRecording && !audioURL && (
          <button className="button" onClick={startRecording}>
            <i className="fa-solid fa-microphone"></i>
          </button>
        )}
        {isRecording && !audioURL && (
          <button className="button" onClick={stopRecording}>
            <i className="fa-solid fa-microphone-slash"></i>
          </button>
        )}
        {audioURL && (
          <button
            className={`button ${uploadingAudio && 'is-loading'}`}
            onClick={sendAudio}
          >
            send voice note
          </button>
        )}
        {audioURL && (
          <button className="button" onClick={ClearAudioURL}>
            cancel
          </button>
        )}
        {!audioURL && (
          <button className="button is-link" onClick={sendMessage}>
            Send <i className="fa-solid fa-paper-plane ml-3"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;

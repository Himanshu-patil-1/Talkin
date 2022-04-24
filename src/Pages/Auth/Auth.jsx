import React from 'react';
import styles from './Auth.module.scss';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../../firebase/config';
import { setUser } from '../../features/userSlice';
import { useDispatch } from 'react-redux';
import { doc, setDoc } from 'firebase/firestore';

const Auth = () => {
  const dispatch = useDispatch();
  const provider = new GoogleAuthProvider();

  const handleSignIn = async (e) => {
    e.preventDefault();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      try {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL,
        });
        dispatch(
          setUser({
            name: user.displayName,
            email: user.email,
            avatar: user.photoURL,
            id: user.uid,
          })
        );
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  return (
    <div class={styles.container}>
      <form className={`${styles.loginContainer} box`} onSubmit={handleSignIn}>
        <div className="block">
          <h1 className="title py-2 has-text-centered">TalkIn chat app</h1>
          <p className="subtitle py-2">
            Welcome to the new talkIn app <br /> authenticate to start using it
          </p>
        </div>
        <button className="button is-link" type="submit">
          Sign In with google <i class="fa-brands fa-google ml-3"></i>
        </button>
      </form>
    </div>
  );
};

export default Auth;

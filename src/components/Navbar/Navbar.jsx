import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from 'firebase/auth';
import { removeUser } from '../../features/userSlice';
import { auth } from '../../firebase/config';

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(removeUser());
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return (
    <nav className="box is-flex is-justify-content-space-between is-align-items-center">
      <h1
        className="is-size-4-desktop 
      is-size-5-mobile has-text-weight-bold "
      >
        TalkIn 🔥
      </h1>
      {user.auth && (
        <div className="is-flex is-align-items-center">
          <div className="mr-4">
            <h1>{user.user.name.split(' ')[0]}</h1>
          </div>
          <button
            className="button is-small is-outlined has-text-weight-medium is-danger"
            onClick={handleSignOut}
          >
            SignOut
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

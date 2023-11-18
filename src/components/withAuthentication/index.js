import React, { useEffect, useState } from 'react';
import { withFirebase } from './Firebase';

const withAuthentication = (Component) => {
  const WithAuthentication = (props) => {
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
      props.firebase.auth.onAuthStateChanged((authUser) => {
        authUser
          ? setAuthUser(authUser)
          : setAuthUser(null);
      });
    }, [props.firebase.auth]);

    return (
      <>
        {authUser ? <Component {...props} /> : null}
      </>
    );
  };

  return withFirebase(WithAuthentication);
};

export default withAuthentication;

import AppRouter from "components/Router";
import { useEffect, useState } from "react";
import { authService } from "FirebaseInst";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        let user_info = {
          displayName: user.displayName,
          uid: user.uid,
          photoURL: user.photoURL,
        };
        setUserObj(user_info);
        if (user.displayName === null) {
          const name = user.email.split("@")[0];
          user_info.displayName = name;
        }
      } else {
        setUserObj(false);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    let user_info = {
      displayName: user.displayName,
      uid: user.uid,
      photoURL: user.photoURL,
    };
    setUserObj(user_info);
  };
  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        "Initializing"
      )}
    </>
  );
}

export default App;

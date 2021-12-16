// import React, { useState } from 'react';
import React from 'react';

export const CurrentUserContext = React.createContext();

// export const CurrentUserContext = React.createContext({
//   currentUser: {},
//   changeCurrentUser: (data) => {},
//   isLoggedIn: false,
//   updateLogin: () => {},
// });

// // eslint-disable-next-line import/no-anonymous-default-export
// export default (props) => {
//   const [user, setUser] = useState({});
//   const [loggedIn, setLoggedIn] = useState(false);

//   const changeUser = (data) => {
//     setUser(data);
//   };

//   const toggleLoggedIn = () => {
//     setLoggedIn(!loggedIn);
//   };

//   return (
//     <CurrentUserContext.Provider
//       value={{
//         currentUser: user,
//         changeCurrentUser: changeUser,
//         isLoggedIn: loggedIn,
//         updateLogin: toggleLoggedIn,
//       }}
//     >
//       {props.children}
//     </CurrentUserContext.Provider>
//   );
// };

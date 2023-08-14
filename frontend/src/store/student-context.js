import React, { useState } from 'react';

const StudentContext = React.createContext({
  students: [],
  updateStudents: (students) => {}
});

export const StudentContextProvider = (props) => {
  const [groups, setGroups] = useState([]);

  // useEffect(() => {
  //   const storedUserLoggedInInformation = localStorage.getItem('isLoggedIn');

  //   if (storedUserLoggedInInformation === '1') {
  //     setIsLoggedIn(true);
  //   }
  // }, []);

  const updateStudents = (data) => {
    setGroups(data);
    console.log('test update state');
  };

  // const loginHandler = () => {
  //   localStorage.setItem('isLoggedIn', '1');
  //   setIsLoggedIn(true);
  // };

  return (
    <StudentContext.Provider
      value={{
        students: groups,
        updateStudents: updateStudents,
      }}
    >
      {props.children}
    </StudentContext.Provider>
  );
};

export default StudentContext;
import React, { useState } from 'react';

const StudentContext = React.createContext({
  students: [],
  updateStudents: (students) => {}
});

export const StudentContextProvider = (props) => {
  const [groups, setGroups] = useState([]);


  const updateStudents = (data) => {
    setGroups(data);
    console.log('test update state');
  };

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
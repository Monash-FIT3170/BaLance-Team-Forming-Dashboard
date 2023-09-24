/**
 * The following module defines minimum expected csv headers for different
 * kinds of data a user might want to upload. The objects defined contain
 * key value pairs where keys are the variable name we want to assign to a
 * header and values are how we want to display them in the frontend.
 *
 * To extend support for more types of csv files, simply add the header
 * mappings as a const object and then add that object as a key-value
 * pair in headerMaps. The key will need to be added to the dropdown
 * options in ImportPage.jsx
 *
 * Note, there are some dependencies with the order the keys are
 * defined and how they are processed in the front and backend FIXME
 */

const studentDataHeaders = {
    studentId: "Student ID",
    labCode: "Lab code",
    lastName: "Last name",
    preferredName: "Preferred name",
    email: "Email address",
    wam: "WAM",
    gender: "Gender"
}

const belbinDataHeaders = {
    studentId: "Student ID",
    belbinType: "Belbin type"
}

const effortDataHeaders = {
    studentId: "Student ID",
    hourCommitment: "Estimated hour commitment",
    avgAssignmentMark: "Average assignment marks"
}

const headerMaps = {
    'students': studentDataHeaders,
    'belbin': belbinDataHeaders,
    'effort': effortDataHeaders
}

module.exports = {
    headerMaps
}

# Code guidelines for Balance: Team Forming Dashboard

Contributors should adhere to the following styleguide to ensure codebase remains consistent and readable.

## General guidelines

### Import structure

* When importing, have external imports first followed by an empty line followed by internal imports
* Order imports by increasing order of how many things are being imported
* If 1 thing is imported from a module, keep the statement in one line
* If 2 or 3 things are imported from a module it's optional to do it in one line or multiple
* If 4 or more things are imported from a module, do one item per line

For example, if we are importing things for a React component we are making

```javascript
/* External imports first */
import { useState } from 'react'; // importing 1 item in one line
import { AddIcon, ArrowBackIcon } from "@chakra-ui/icons"; // importing 2 or 3 items can be done in one line
import { // importing 4 or more items should be done with 1 item per line as shown
    Flex,
    Spacer,
    VStack,
    Center
} from '@chakra-ui/react';

/* Internal imports with an empty line separating it from external imports */
import csvHeaderMapping from "../helpers/csvHeaderMapping"; // importing 1 item in one line
import { // importing 2 or 3 items can be done with 1 item per line as shown or all in one line
    Dropdown,
    NavButton,
    PageHeader
} from "../components/_shared";
import {  // again, importing 4 or more items should be done with 1 item per line as shown
    DeleteProfileModal,
    CsvPreviewTable,
    AddProfileModal,
    EditProfileModal
} from "../components/importPage"
```

### Code structure

Readable code is the main thing that matters. BUT DO:

* Use 4 space indentations across all languages
* Use arrow functions for creating react components and for defining JS functions in general for the sake of consistency

## Frontend guidelines

### useNav vs Link

[Refer to this discussion](reddit.com/r/reactjs/comments/vq2hb6/which_is_better_to_use_link_or_usenavigate)

* use navigate when a redirect is needed as part of another action e.g. after form submission, we want to redirect
* use link when you want something to link to a page without other actions e.g. any linking button or hyperlink

## Backend guidelines

### Extracting MySQL data with bracket syntax

Where relevant, it's preferred to use destructure syntax to extract data from arrays over bracket syntax.
For example, the following MySQL query returns a single row and column of data in the following structure `[{key: value}]`

If we want to assign value to a variable, use the following method:

```javascript
    const [{ numEnrolledStudents }] = await promiseBasedQuery(
        "SELECT count(*) AS `numEnrolledStudents` FROM student s " +
        "   INNER JOIN unit_enrolment e ON e.stud_unique_id=s.stud_unique_id " +
        "   INNER JOIN unit_offering u ON u.unit_off_id=e.unit_off_id " +
        "WHERE" +
        "   u.unit_code=? " +
        "   AND u.unit_off_year=? " +
        "   AND u.unit_off_period=?;",
        [unitCode, year, period]
    );
```

Rather than:

```javascript
    const queryResult = await promiseBasedQuery(
        "SELECT count(*) AS `numEnrolledStudents` FROM student s " +
        "   INNER JOIN unit_enrolment e ON e.stud_unique_id=s.stud_unique_id " +
        "   INNER JOIN unit_offering u ON u.unit_off_id=e.unit_off_id " +
        "WHERE" +
        "   u.unit_code=? " +
        "   AND u.unit_off_year=? " +
        "   AND u.unit_off_period=?;",
        [unitCode, year, period]
    );

    numEnrolledStudents = queryResult[0]['numEnrolledStudents'];
```

## SQL guidelines

Improve query readability by:
* Use of caps lock for keywords rather than lower case e.g. `SELECT * FROM table1;` over `select * from table1;`
* Indent segments of the query such as INNER JOINs and WHERE clauses from SELECT and FROM such as shown in the example below

```mysql
SELECT * 
FROM table1
    INNER JOIN table2 ON table1.col1 = table2.col2
    INNER JOIN table3 ON table3.col1 = table2.col1
WHERE
    table1.col3=?
    AND table2.col4=?
ORDER BY table1.col5;
```

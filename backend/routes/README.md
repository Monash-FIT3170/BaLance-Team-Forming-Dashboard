### Description
Route files define a router and create API endpoints by 
* calling an associated HTML method
* providing the route specifier/url
* providing/defining the route handler function that should run when the endpoint is reached

### For maintainers/developers guide
Keep this modules purpose as dedicated to simply defining endpoints and associating them with 
appropriate route handlers.

Each file should generally house endpoints related to a single entity within the application domain.
For example:
* students.js -> routes related to CRUD of student data
* groups.js -> routes related to CRUD of group data

How these are grouped and distributed specifically can be semantics 
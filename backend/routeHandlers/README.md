### Description
Route handler files define route handler functions that are used by the express router endpoints 
defined in `../routes` 

### Maintainers/developers guide
Use anonymous (arrow) functions and export them by name at the end of the file e.g.

```javascript
myAnonFunc = async () => {}
myAnonFunc2 = async () => {}

module.exports = {
    myAnonFunc,
    myAnonFunc2
}
```
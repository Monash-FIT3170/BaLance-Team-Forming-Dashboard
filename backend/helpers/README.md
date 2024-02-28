### Description
Helper files contain common util functions such as in `commonHelpers.js` as well as functions
refactored out of and extracted from routeHandlers for the purpose of cleaning up routeHandler functions.

### Maintainer/develpers guide
If routeHandler functions become too convoluted and complex, consider refactoring code blocks into an
associated helper file

Use anonymous (arrow) functions and export them by name at the end of the file e.g.

```javascript
myAnonFunc = async () => {}
myAnonFunc2 = async () => {}

module.exports = {
    myAnonFunc,
    myAnonFunc2
}
```
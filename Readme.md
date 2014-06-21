#TypeScript Template

##initial command

```
> npm install

> tsd reinstall

> bower install

> grunt init
```

##change appName

###Gruntfile.js
```js
module.exports = function(grunt) {
    // config
    grunt.initConfig({
        appName: 'mine', // change to user app name
```

###src/main/webapp/index.html
```html
<!DOCTYPE html>
<html ng-app="mine"> <!-- ####change#### -->
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="scripts/vendor/bootstrap/css/bootstrap.min.css" />
    <link rel="stylesheet" href="styles/app/mine.css" /> <!-- ####change#### -->
  </head>
  <body>
    <div class="container">
      <div class="bg-primary">
        <h1>TypeScript Template Sample</h1>
      </div>
      <div class="well">
        <h2>{{message}}</h2>
      </div>
    </div>
    
    <div>
      <div></div>
    </div>
    
    <script src="scripts/vendor/jquery/jquery.min.js"></script>
    <script src="scripts/vendor/angular/angular.min.js"></script>
    <script src="scripts/vendor/bootstrap/js/bootstrap.min.js"></script>
    <!--[if lt IE 9]>
    <script src="scripts/vendor/html5shiv/html5shiv.min.js"></script>
    <script src="scripts/vendor/respond/respond.min.js"></script>
    <![endif]-->
    <script src="scripts/vendor/underscore/underscore.js"></script>
    <script src="scripts/app/mine.min.js"></script> <!-- ####change#### -->
  </body>
</html>
```

###src/main/webapp/styles/app/mine.css

rename

###src/main/ts/app.ts
```ts
angular
.module('mine', []) // change to user app name
.run(['$rootScope', (scope) => {
    scope.message = 'AngularJS with TypeScript.';
}]);
```


##Libraries

this template include follow libraries.

- jQuery
- AngularJS
- Bootstrap
- Underscore
- Jasmine (for test)

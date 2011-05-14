var path = require('path')

JsGit.Cli = function(args, commandRunner) {
  var that           = this
  
  that.args          = args || []
  that.gitDir        = path.join(process.cwd(), ".git")
  that.commandRunner = commandRunner || new JsGit.CommandRunner()
  that.argsWithoutOptions = []
  
  that.args.forEach(function(arg) {
    if (!/^-/.exec(arg)) that.argsWithoutOptions.push(arg)
    
    var result = /^--git-dir=(.*)$/.exec(arg)
    if (result) {
      if (result[1][0] == "/") { 
        that.gitDir = result[1] 
      } else {
        that.gitDir = path.join(process.cwd(), result[1])
      }
    }
  })
  that.commandName = that.argsWithoutOptions[0]
  
  that.repo = function() {
    return new JsGit.Repo(that.gitDir)
  }
  
  that.run = function() {
    if (that.commandName == "show") {
      that.commandRunner.show(that.repo(), that.argsWithoutOptions.slice(1), {}, function(output) {
        console.log(output)
      })
    } else if (that.commandName == "log") {
      that.commandRunner.log(that.repo())
    } else {
      console.log("git.js: '" + that.commandName + "' is not a supported git command. See 'git.js --help'.")
    }
  }
}
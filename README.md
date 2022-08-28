# FEG-Project
## Running & Testing
To run the project, you would two things: Node.js and Live Server. The latter could either be installed via the __Live Server__ extension in Visual Studio Code or downloaded via the npm package of the same name. I - personally - downloaded the package and positioning myself in the project directory and executing the following chain of commands in a bash terminal: `npm install live-server -g && npm install && live-server` in the terminal.

## Known Issues
* The search filters __do not work__. Reason is: they are not implemented as of yet.
  * The search filter checkboxes are not styled at all.
* The 'Load More' button behaves a little strangely on certain conditions.
  * One such _condition_ is searcing an item by name before expanding the list.

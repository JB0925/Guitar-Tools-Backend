# Guitar Tools

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# About Guitar Tools

As someone who has been playing guitar for roughly twenty five years, Guitar Tools
is a passion project. This app includes four main components:
- An interactive flashcard game where the user clicks, sees a card, tries to play the correct
  note, and will be given feedback on whether or not they played the correct note.
- A metronome, used to improve a guitarist's sense of timing and playing speed (if desired)
- A tuner, used to, well...tune the guitar. :)
- An "info getter" where the user can ask for information about a particular guitarist or musician
  and get information about them.

There are also Login and Register components, but neither are required to use the app, and were
create more to demonstrate capability. If you do decide to login, and you play the flashcard game, 
we keep track of your high score and will let you know when you break it!

If you would like to login to the app, you can do so with the following:
    username: testuser
    password: password

As a utility app, this app primarily has a frontend focus, but you are viewing the backend API!

The front end was written with React.js, CSS3, and HTML5 / JSX.
The back end was written with Node.js, Express.js, and Postgres.

# How To Install and/or View Guitar Tools

The easiest way to view Guitar Tools is to head over to
[Guitar Tools on Heroku](https://agile-beyond-78774.herokuapp.com/)

Alternatively, to clone this project, you can paste the following line in your terminal:
`git clone git@github.com:JB0925/Guitar-Tools.git` for the frontend,
and `git clone git@github.com:JB0925/Guitar-Tools-Backend.git` for the backend.

Following that, use `npm install` to install all dependencies in both repos separately.

Below are some available scripts that you can use to run Guitar Tools in 
development mode, as well as run the tests I wrote for Guitar Tools:

## Available Scripts Front End

In the project's root directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\

### `npm test`

Launches the test runner in the interactive watch mode.\
This will allow you to run the tests that I wrote for this
front end application using React Testing Library / Jest.


## Available Scripts Back End

In the project's root directory, you can run one of two commands:

### `node server.js` 
### `nodemon server.js`

If you choose to run the second one, be sure to install Nodemon using `npm i nodemon`

Runs the app in the development mode.\
Opens the API on port 3001 [http://localhost:3001](http://localhost:3001).

### `npm test --runInBand`

Launches the test runner in the interactive watch mode.\
This will allow you to run the tests that I wrote for the
backend using Jest.

Thank you for taking the time to check out Guitar Tools!
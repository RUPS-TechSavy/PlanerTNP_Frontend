# **PlanWise**
## Table of Contents

- [**PlanWise**](#planwise)
  - [Table of Contents](#table-of-contents)
- [Description](#description)
  - [Newly added features](#newly-added-features)
  - [Backend](#backend)
  - [Not yet complete functionalities](#not-yet-complete-functionalities)
- [Getting Started with Create React App](#getting-started-with-create-react-app)
  - [Available Scripts](#available-scripts)
- [`npm install`](#npm-install)
    - [`npm start`](#npm-start)
    - [`npm test`](#npm-test)
    - [`npm run build`](#npm-run-build)
    - [`npm run eject`](#npm-run-eject)
  - [Learn More](#learn-more)
    - [Code Splitting](#code-splitting)
    - [Analyzing the Bundle Size](#analyzing-the-bundle-size)
    - [Making a Progressive Web App](#making-a-progressive-web-app)
    - [Advanced Configuration](#advanced-configuration)
    - [Deployment](#deployment)
    - [`npm run build` fails to minify](#npm-run-build-fails-to-minify)
- [Docker](#docker)
  - [Prerequisites](#prerequisites)
  - [Instructions](#instructions)
- [Team TechSavvy](#team-techsavvy)

---

# Description

PlanWise allows users to organize their time more easily by visualizing tasks and their duration. The application enables color coordinated category marking and filtering, displaying tasks with a time table and sharing tasks between multiple users. It can also send reminders to its users when their tasks will start or end. In addition it supports Google authentication, private and public tasks plus a comprehensive privacy policy, disclaimer and terms of use.

## Newly added features

- **Categories through colors:** 
    - **Why:** When creating a task, the user also assigns it a color, which in the original version haD no practical meaning. Now the colors represent
    categories that the user defines himself. This will also improve the
    user experience of filtering and searching for tasks.
- **Google Oauth Login and Registration:** 
    - **Why:** We implemented Google OAuth login and registration to
    improve the user experience and provide a more secure and
    simple way to authenticate.  
- **Improving user deletion from the database:** 
    - **Why:** The previous implementation allowed users to continue interacting with the application even after deleting their account until they
    refreshed the page. 
- **Legend:** 
    - **Why:** Users have a hard time remembering the meaning of each color they have assigned. 
- **Enable task sharing within a group:** 
    - **Why:** Teamwork and team work planning are crucial
    for quality planning of the work process, events, and private matters.
- **Filtering by groups:** 
    - **Why:** So that the user can check which tasks are waiting for them within a certain group.
- **Introduction of legal protection of the application (Privacy policy,        disclaimer in terms of use ):** 
    - **Why:** Mandatory for the protection of our group and its members.  
- **Notifications for upcoming activities:** 
    - **Why:** We implemented notifications for upcoming activities to
    help users better manage their time and reduce the possibility of
    missing commitments.
- **App security improvements:** 
    - **Why:** While analyzing the app, we noticed many security issues that
could lead to cyberattacks.
- **Introducing Public Tasks:** 
    - **Why:** Enabling public tasks allows unregistered
    (public) users to be notified about upcoming events, deadlines, etc.
- **Adding a description when creating tasks:** 
    - **Why:** Allows users to write more detailed tasks, which increases
    clarity and reduces confusion when working with multiple tasks.
- **Added ability to delete and edit tasks:** 
    - **Why:** Gives users more control over managing their tasks.    
                          
## Backend
Link to [backend](https://github.com/RUPS-TechSavy/PlanerTNP_Backend).

## Not yet complete functionalities
- Text size and brightness settings:
  - Settings for the visually impaired.
- Filtering tasks by group:
   -  The base is implemented, the graphical part is
implemented, the only part missing is the part in the code that would select from the user's list of tasks matching the selected group.
- Filtering by public tasks:
   - Currently, the application does not support the user being able to filter the tasks in the calendar so that only public tasks are displayed (unless they log out
of the application).
- Improvements to the appearance of the application:
   - Since we are not graphic designers ourselves, the application is  not graphically perfect.
  
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


## Available Scripts

In the project directory first do:
# `npm install`

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# Docker

## Prerequisites

You will need to have the following installed on your system:

- git
- docker
- docker compose

## Instructions

Create a .env file in the root of the backend project and fill in the variables with your values:
```
FRONTEND_PORT=1234
```

Run `./setup_docker.sh` script.

# Team TechSavvy 
**Filip Aljaž Stopar**, **Ervin Haračić**, **Matevž Sladič**, **Anja Ostovršnik**
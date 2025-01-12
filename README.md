# Task Management Web App

A task management web application that allows users to create and manage multiple projects, add tasks with specific details, track their progress, and search through tasks. Each project gets a dynamically generated color for better visual organization. Tasks are saved locally using the browser's local storage, ensuring persistence across sessions.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)

## Project Overview

This project is a **task management web app** designed to help users stay organized by providing the ability to create projects, manage tasks, and track deadlines. It includes search and filter functionalities to quickly find tasks based on user input.

The app generates a random color for each project, giving users a unique and visually appealing interface. All task data, including their status (completed or pending), due date, and priority, is stored in the browser's **local storage**.

### Built With

- **JavaScript**: Core language for the app's logic.
- **HTML5**: Structuring the web page.
- **CSS3**: Styling the app's interface.
- **Webpack**: Bundling and compiling the code for efficient loading.
- **Local Storage**: For persisting data across sessions.

## Features

- **Create Projects**: Users can create multiple projects with a dynamic color assigned to each project.
- **Add Tasks**: Tasks can be added to each project, specifying a title, description, due date, and priority.
- **Mark Tasks as Completed**: Users can mark tasks as completed or pending.
- **Search Tasks**: A search bar allows users to search tasks by name.
- **Filter Tasks**: Users can filter tasks by project or status.
- **Persist Data**: All projects and tasks are saved to **local storage**, so the data persists between page reloads.

## Technologies Used

- **JavaScript**: The main programming language used for the logic behind the app.
- **HTML/CSS**: Used to structure and style the application.
- **Webpack**: A module bundler used for compiling and optimizing the assets.
- **Local Storage**: For storing user data such as tasks and projects on the client side.

## Installation

### Prerequisites

To run this project locally, you need to have [Node.js](https://nodejs.org/) installed on your machine. Node.js comes with npm (Node Package Manager), which is required to install the project's dependencies.

### Steps to Install and Run the App:

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/your-username/task-management-web-app.git
    cd task-management-web-app
    ```

2. Install the required dependencies by running:

    ```bash
    npm install
    ```

3. Run the app locally with the following command:

    ```bash
    npm start
    ```

    This will open the application in your default browser and automatically reload when you make changes.

## Usage

Once the app is up and running, you can interact with it in the following ways:

1. **Create Projects**: On the homepage, you can create a new project by entering a project title. Each project will get a random color for better visual organization.
2. **Add Tasks**: Inside each project, you can add tasks with a title, description, due date, and priority.
3. **Mark Tasks as Completed**: Click the checkbox next to a task to mark it as completed.
4. **Search Tasks**: Use the search bar to quickly find tasks by typing the name of the task.
5. **Filter Tasks**: Filter through tasks by project or status.
6. **Persistent Data**: All projects and tasks are saved in your browser's local storage, so even if you close the app, your data will be there when you return.


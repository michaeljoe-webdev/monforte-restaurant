DEMO
-------------

You can find the sample Live Demo here...

**[LIVE DEMO](http://--/)**


WIKI
-------------
# Monforte Dental - Online Scheduling System

![Project Logo](http://monfortedental-client.s3-website-ap-southeast-1.amazonaws.com/logo.png)

[Deployed version](http://monfortedental-client.s3-website-ap-southeast-1.amazonaws.com/)
[Backend with EKS] - Im sorry i have trouble with setting up external ip to run it online (ONGOING).

## Table of Contents

- [Objective](#project-description)
- [Project Description](#project-description)
- [Installation Instructions](#installation-instructions)
- [Usage Instructions](#usage-instructions)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Contributors](#contributors)
- [License](#license)
- [Contact Information](#contact-information)

## Project Description

Develop a web application for a dental office that allows patients to schedule and manage their appointments online.
    Frontend(React) and Backend(Node.js).

## Installation Instructions

1. **Clone the repository**:

    Using SSH

    ```bash
    git clone git@github.com:michaeljoe-webdev/dental-online-system.git
    cd dental-online-system
    ```

    Using HTTP

    ```bash
    git clone https://github.com/michaeljoe-webdev/dental-online-system.git
    cd dental-online-system
    ```

2. **Install dependencies**:

    For the client side (FRONT-END)

    ```bash
    cd client
    npm install
    ```

    For the client side (BACK-END)

    ```bash
    cd server
    npm install
    ```


3. **Set up environment variables**:

    Create a `.env` file in the root directory and add the necessary environment variables.

    (FRONT-END)
    
    ```bash
    VITE_APP_API_URL=http://127.0.0.1:3000/api
    ```

    (BACK-END)

    ```bash
    ACCESS_TOKEN_SECRET = 'mB8#5zP$7s@W3qL!9oY6rT0iU2wF4eD8gH1jK5lN1'
    PORT = 3000
    NODE_ENV="development"
    ```

4. **Run the project**:
    
    For the client side (FRONT-END)

    ```bash
    npm run dev
    ```

    For the client side (BACK-END)
    ```bash
    nodemon
    ```
5. **Setting up the local database with MySQL**:

    Create a database name `monfortedental_db`
    
    Inside the database `monfortedental_db`, import the `monfortedental_db.sql` located in database folder.
    
    ```bash
    cd mysql
    ```


## Usage Instructions

Provide instructions and examples for using the project. Include screenshots or code examples if applicable.

```bash
# Example usage
command to run the project
 ```

## Usage Instructions

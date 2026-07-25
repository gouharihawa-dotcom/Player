# Video Player (React + Vite)

A simple local video player application built with React and Vite.

This application allows users to:
- Upload videos
- Browse saved videos
- Play videos directly in the browser

Videos and their information are stored locally using browser storage technologies.

## Features

- Upload and manage videos
- Video playback
- Local storage support
- Responsive user interface

## Technologies Used

- React
- Vite
- JavaScript 
- IndexedDB
- LocalStorage

## Installation

Clone the repository:

```bash
https://github.com/gouharihawa-dotcom/Player.git
```

Go to the project folder:

```bash
cd your-project-name
```

Install dependencies:

```bash
npm install
```

## Run the Project

Start the development server:

```bash
npm run dev
```

The project will run locally, usually at:

```
http://localhost:5173
```

## Build for Production

Create the production version:

```bash
npm run build
```

## Project Structure

```
src/
│
├── main.jsx          
│
├── components/      
│
└── hooks/            
```

## Storage

The application uses:

- **IndexedDB** for storing video files
- **LocalStorage** for storing small data and settings

## Author

Hawa Gouhari

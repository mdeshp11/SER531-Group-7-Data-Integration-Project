# SER531 Group 7 - IPL Insights: A Semantic Ontology Approach for Data Querying and Match Prediction

This project leverages semantic ontology to analyze and query IPL cricket data, enabling advanced insights such as performance analysis, player impact in high-pressure games, and venue-specific trends. By integrating a React-based frontend, a Python backend, and an Apache Jena Fuseki server, it provides a unified platform for intelligent data querying and reasoning over complex cricket datasets.

## Table of Contents
- [Project Overview](#project-overview)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Technologies Used](#technologies-used)

---

## Project Overview

The SER531 Group 7 Data Integration Project demonstrates semantic data integration using Apache Jena Fuseki for RDF data handling. The system includes a Python backend for processing data and a React.js frontend for user interactions.

---

## Setup Instructions

### 1. Clone the Repository
Clone the repository to your local machine:
```bash
git clone https://github.com/mdeshp11/SER531-Group-7-Data-Integration-Project.git
cd SER531-Group-7-Data-Integration-Project
```

### 2. Backend Setup
Follow these steps to set up the backend:

1. Install the required Python packages:
    ```bash
    pip install -r requirements.txt
    ```
2. Navigate to the **Backend** folder:
    ```bash
    cd Backend
    ```
3. Start the backend server:
    ```bash
    python app.py
    ```

### 3. Apache Jena Fuseki Server Setup
Set up the Apache Jena Fuseki server by following these steps:

1. Download the Apache Jena Fuseki server from the official site: [Apache Jena Fuseki 5.2.0] (https://jena.apache.org/documentation/fuseki2/)
2. Extract the downloaded `.zip` file.
3. Navigate to the extracted folder.
4. Start the Fuseki server on port `8080`:
    ```bash
    fuseki-server --port=8080
    ```

### 4. Frontend Setup
Set up the frontend application with the following steps:

1. Navigate to the **Frontend** folder:
    ```bash
    cd ../Frontend
    ```
2. Install the required dependencies:
    ```bash
    npm install
    ```
3. Start the React application:
    ```bash
    npm start
    ```
---

## Usage

1. Ensure that the backend server, Apache Jena Fuseki server, and frontend application are running.
2. Access the application in your web browser at:
    ```bash
    
    http://localhost:3000

    ```
---

## Technologies Used

- **Backend**: Python, Flask
- **Frontend**: React.js
- **Semantic Data Integration**: Apache Jena Fuseki Server
- **Dataset preprocessing**: Google Sheets, Pandas
- **Knowledge graph**: Ontotext Refine

    

# ALAN-Adaptive_LeArning_Navigator

# ALAN

## Overview

The AI-Driven Roadmap Generator is an interactive, AI-powered tool designed to generate personalized learning roadmaps for technical topics. Leveraging cutting-edge technologies like Gemini 2.0 Flash, YouTube Data API, and Google Custom Search JSON API, this project delivers a dynamic, real-time educational experience. The roadmap is displayed using an interactive React Flow UI, allowing users to explore and interact with the generated learning modules.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Installation and Setup](#installation-and-setup)
- [Usage](#usage)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## Features

- **User Input:**  
  Users can input a topic and select their experience level (Heard of it, Know about it, Worked with it).

- **Dynamic Roadmap Generation:**  
  The system uses Gemini 2.0 Flash to generate a structured learning roadmap based on the provided inputs.

- **API Enhancements:**  
  The generated roadmap is enriched with relevant video and article data using the YouTube Data API and Google Custom Search JSON API.

- **Interactive UI:**  
  The roadmap is displayed using React Flow, featuring a zoomable, pannable flowchart interface. Detailed module information is accessible via modals.

- **Modular and Scalable:**  
  The project is built with modern frameworks and is deployed on Vercel, ensuring scalability and ease of future enhancements.

## Architecture

The project architecture is designed with a clear separation of concerns:

1. **User Interface (Frontend):**  
   Built with React and React Flow, the UI collects user inputs and displays the interactive roadmap.

2. **AI Generation Service:**  
   Uses Gemini 2.0 Flash to generate the base roadmap structure based on the topic and experience level.

3. **Enhancement Services:**  
   - **YouTube Data API:** Fetches relevant video content.
   - **Google Custom Search API:** Retrieves relevant article links.
  
4. **Dynamic Roadmap Generation:**  
   Combines the AI-generated roadmap with enhancement data, constructs the node and edge structures, and applies a dagre layout for a structured visualization.

5. **Deployment:**  
   The project is deployed on Vercel for quick, scalable, and reliable hosting.

### Architecture Diagram

```mermaid
flowchart TD
    A[User Input Form] --> B[Frontend React App]
    B --> C[Gemini 2.0 Flash API]
    C --> D[AI-Generated Roadmap Data]
    D --> E[Enhancement Layer]
    E --> F1[YouTube Data API]
    E --> F2[Google Custom Search API]
    F1 --> G[Enhanced Video Data]
    F2 --> H[Enhanced Article Data]
    G & H --> I[Dynamic Roadmap Generator]
    I --> J[React Flow UI]
    J --> K[Interactive Modal for Details]

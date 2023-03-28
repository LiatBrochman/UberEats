<br/>
<p align="center">
  <a href="https://github.com/LiatBrochman/UberEats">
  </a>

  <h3 align="center">UberEats</h3>

</p>



## About The Project

The UberEats Mobile App is a food delivery application developed 
for customers, couriers, and owners. 

The app utilizes React Native (Expo) and Google Maps API for live data syncing by subscribing to location update events and canvas rerendering. 

AWS Amplify was employed for auto backend development, 
auto-building the schema (GraphQL), data storage management (DynamoDB), auto-generating smart fetching mechanism (DataStore), including auto-local storage maintenance, hosting and deploying the app, and more.

## Built With

Features
User authentication (sign-up, login, and logout)
Browse nearby restaurants and their menus
Place and track orders
Real-time delivery tracking
In-app messaging between customers and couriers
Restaurant and courier management for owners

Technologies Used
React Native (Expo)
Context API for state management
Google Maps API for live data syncing
AWS Amplify for auto backend development, data storage management, and hosting and deploying the app
GraphQL for building the schema
DynamoDB for data storage
DataStore for smart fetching mechanism and local storage maintenance

## Getting Started

Prerequisites
Node.js (v14 or higher)
Expo CLI (v4 or higher)
AWS Amplify CLI (v4 or higher)

### Prerequisites

1. Clone the repository:
```sh
git clone https://github.com/yourusername/UberEats-Mobile-App.git
```

2. Install dependencies:
```sh
cd UberEats-Mobile-App
npm install
```

3. Set up AWS Amplify:
```sh
amplify init
amplify push
```

4. Run the app:
```sh
expo start
```

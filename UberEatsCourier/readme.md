<h1>🚴 UberEatsCourier</h1>
<p>UberEatsCourier is a mobile app built with React Native Expo libraries and AWS Amplify that empowers couriers to accept and fulfill food delivery orders from various restaurants. The app is available for Android users only and offers real-time updates and seamless navigation using Google Maps Directions API.</p>
<h2>🚀 Features</h2>
<ul>
  <li>📦 Browse available orders from nearby restaurants</li>
  <li>📍 Accept an order and get assigned with a courierID</li>
  <li>🗺️ Navigate to the restaurant and customer location with real-time directions</li>
  <li>⏲️ View estimated time of arrival and waypoints</li>
  <li>🍽️ See restaurant details when clicking on an icon in the map</li>
  <li>🔄 Receive real-time updates using AWS Amplify Pub/Sub</li>
  <li>🔋 Save battery life by stopping Pub/Sub when the app is inactive</li>
  <li>🔄 Automatically retrieve information about ongoing orders when reopening the app</li>
</ul>

<img src="https://github.com/LiatBrochman/UberEats/assets/92271841/f1cc44bb-9a3f-42a6-b394-2a88b3fa1f4d" width="200">
<img src="https://github.com/LiatBrochman/UberEats/assets/92271841/269eb421-e388-456b-b723-7ba250a1170d" width="200">
<img src="https://github.com/LiatBrochman/UberEats/assets/92271841/87a39340-62dd-4a21-89cd-facbe0b73294" width="200">

<h2>⚙️ Installation</h2>
<p>To use UberEatsCourier, you will need to have the following installed:</p>
<ul>
  <li>Node.js</li>
  <li>Expo CLI</li>
  <li>Android Studio (for Android development)</li>
</ul>
<p>To install the app, follow these steps:</p>
<ol>
  <li>Clone this repository to your local machine</li>
  <li>Navigate to the project directory and run <code>npm install</code> to install the necessary dependencies</li>
  <li>Run <code>expo start</code> to start the development server</li>
  <li>Use an Android device or emulator to run the app</li>
</ol>
<h2>📱 Usage</h2>
<p>After opening the app, couriers can view available orders from nearby restaurants. Upon accepting an order, the courier is assigned a courierID, and the order status is updated. The app then provides seamless navigation to the restaurant and customer location using Google Maps Directions API, along with estimated time of arrival and waypoints.</p>
<p>The courier will receive real-time updates through AWS Amplify Pub/Sub. If the app is closed, in the background, or inactive, the Pub/Sub service will stop to save battery life. When the app is reopened, it will automatically retrieve information about ongoing orders, including navigation details.</p>
<h2>🆘 Support</h2>
<p>If you encounter any issues with the app, please contact our 📧 customer support team at liatbrochman@gmail.com or shmuelyos@gmail.com.</p>
<h2>🤝 Contributing</h2>
<p>We welcome contributions from the community. To contribute to the project, please follow these steps:</p>
<ol>
  <li>Fork the repository</li>
  <li>Create a new branch for your feature or bug fix</li>
  <li>Make your changes and commit them</li>
  <li>Push your changes to your forked repository</li>
  <li>Create a pull request</li>
</ol>
<h2>📜 License</h2>
<p>This project is licensed under the MIT License. See the <a href="LICENSE">LICENSE</a> file for more details.</p>

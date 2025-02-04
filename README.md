**Dog Adoption App**
Welcome to the Fetch Dog Adoption App! This project was created as part of a front-end take-home exercise. It allows users to log in, search for shelter dogs, filter results by breed, and select their favorite dogs. After selecting their favorites, users can generate a match to find their perfect dog.

**Features**
**User Login:** Secure login using name and email, which authenticates the user with the backend.
**Dog Search:** Browse available dogs from a shelter database.
Filter dogs by breed.
Sort results alphabetically by breed (ascending/descending).
Paginated results for efficient browsing.
**Favorites:** Add dogs to your favorite list.
**Dog Match:** Generate a match based on the dogs added to your favorites list.
**Dog Information:** View detailed information about each dog (name, age, breed, zip code, image).

**Tech Stack**
React (with TypeScript)
Vite.js (for fast development build tool)
Axios (for making API requests)
CSS/Styled Components (for styling)
TypeScript (for type safety)
Requirements
Node.js
npm (or yarn) for package management

**Setup & Installation**
**Clone this repository:**

git clone https://github.com/yourusername/fetch-dog-adoption.git

**Install the dependencies:**

npm install

**Run the development server:**

npm run dev

Open your browser and go to http://localhost:3000 to see the app.

**Usage**
**Login:** On the login page, enter your name and email to authenticate with the backend.
**Dog Search:** After successful login, you will be directed to the dog search page. Use the search filters to browse dogs by breed, sort them alphabetically, and navigate through paginated results.
**Favorites:** Click on the heart icon next to the dog to add it to your favorites list.
**Generate Match:** After adding your favorite dogs, you can generate a match by sending all favorited dog IDs to the backend to receive a recommended dog match.

**API Integration**
This project integrates with the Fetch API to handle dog data and authentication:

**Login:** POST request to /auth/login with user credentials.
**Dog Data:** Fetch available dog breeds, search for dogs, and generate dog matches using the /dogs and /dogs/match endpoints.

For full API documentation, refer to the provided API Reference.

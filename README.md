# Bidsy Auction Website

Bidsy is a front-end auction website built for the Noroff Semester Project 2 assignment. The application uses the Noroff Auction House API v2 and lets users browse auctions, create listings, manage their profile and place bids.

The project is built with Vanilla JavaScript and Bootstrap.

## Live Site

Deployed with Vercel.

## Features

- Register and login with a `@stud.noroff.no` email address.
- Store login token and user data in localStorage.
- Show different navbar options for guests and logged-in users.
- Display user credits and profile avatar in the header.
- Browse auction listings from the Noroff API.
- Search and filter listings.
- Load more listings.
- View a single listing page.
- Create a new listing.
- Edit and delete listings owned by the logged-in user.
- View profile information, avatar, banner, credits and user listings.
- Update profile bio, avatar and banner.
- Place bids on listings.
- Block guests from bidding.
- Block users from bidding on their own listings.
- Show loading, success, empty and error messages.

## Built With

- HTML
- CSS
- Vanilla JavaScript
- Bootstrap 5
- Bootstrap Icons
- Vite
- Noroff Auction House API v2

## Pages

- `index.html` - Home page
- `listings.html` - Listings page
- `listing.html` - Single listing page
- `login.html` - Login page
- `register.html` - Register page
- `profile.html` - Profile page
- `create-listing.html` - Create listing page
- `edit-listing.html` - Edit listing page
- `edit-profile.html` - Edit profile page

## Project Structure

```txt
js/
  api/
  events/
  pages/
  ui/
  utils/
css/
img/
```

The project is split into small files:

- `api/` handles API requests.
- `events/` handles form and click events.
- `pages/` connects the logic for each page.
- `ui/` renders and updates HTML.
- `utils/` contains helper functions.

## Getting Started

Clone the repository and install dependencies:

```bash
npm install
```

Create a `.env` file in the root folder:

```txt
VITE_API_KEY=your-api-key-here
```

Start the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run format
npm run format:check
```

## API

This project uses the Noroff API v2:

- Auction House listings
- Auction House profiles
- Auth register
- Auth login
- API key authentication

The API key is loaded from:

```txt
VITE_API_KEY
```

The token is saved after login and sent with protected requests.

## Deployment

The project is prepared for Vercel deployment.

Vercel settings:

```txt
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

Environment variable required on Vercel:

```txt
VITE_API_KEY
```

## Testing

The project was checked with:

```bash
npm run lint
npm run format:check
npm run build
```

Manual testing was also used for login, registration, listing creation, profile updates and bidding.

## AI Usage

AI tools were mainly used for planning, debugging assistance, deployment troubleshooting, documentation improvements, and wording suggestions. All final implementation decisions and testing were reviewed manually.

## Entry 1

Tool used: ChatGPT
Date: 22.04.2026
Purpose: Help break the assignment into smaller development phases and organize the project workflow.
Outcome: A step-by-step project plan and Kanban structure were created to manage the work gradually.

## Entry 2

Tool used: ChatGPT
Date: 01.05.2026
Purpose: Generate a decorative background image for create listing page.
Outcome: Picture was used in project.

## Entry 3

Tool used: ChatGPT
Date: 05.05.2026
Purpose: Ask for guidance on using Bootstrap together with Vanilla JavaScript.
Outcome: Bootstrap was used for layout and utility classes without introducing additional front-end frameworks.

## Entry 4

Tool used: GitHub Copilot
Date: Throughout the project
Purpose: Help generate commit message.
Outcome: Commit messages became more consistent.

## Entry 5

Tool used: Codex
Date: 10.05.2026
Purpose: Help debug listings not showing correctly after creation.
Outcome: Listing loading and pagination behavior were reviewed and adjusted so newly created listings could be displayed correctly.

## Entry 6

Tool used: Codex
Date: 14.05.2026
Purpose: Help debug GitHub Pages deployment where CSS and JavaScript assets failed to load.
Outcome: The issue was traced to incorrect Vite asset paths and deployment configuration.

## Entry 7

Tool used: Codex
Date: 14.05.2026
Purpose: Help identify why the API key was missing after deployment.
Outcome: The missing VITE_API_KEY environment variable was identified and added to the deployed environment configuration.

## Entry 8

Tool used: Codex
Date: 14.05.2026
Purpose: Ask for guidance preparing the project for deployment on Vercel.
Outcome: Build settings and asset path handling were adjusted for deployment compatibility.

## Entry 9

Tool used: ChatGPT
Date: 15.05.2026
Purpose: Help improve README structure and wording.
Outcome: Documentation became clearer and easier to follow for setup and project explanation.

## Entry 10

Tool used: Codex
Date: 16.05.2026
Purpose: Help organize README content.
Outcome: README sections records were structured more clearly.

## Entry 11

Tool used: ChatGPT
Date: 16.05.2026
Purpose: Help translate Report from Ukrainian to English.
Outcome: Report was translated more correctly.

## Author

Semester Project 2 submission for Noroff.

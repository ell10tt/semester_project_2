import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../css/styles.css";

import { setupNavbar } from "./ui/updateNavbar.js";
import { setupLoginPage } from "./pages/login.js";
import { setupRegisterPage } from "./pages/register.js";
import { setupProfilePage } from "./pages/profile.js";
import { setupHomePage } from "./pages/home.js";
import { setupListingsPage } from "./pages/listings.js";
import { setupListingDetailPage } from "./pages/listingDetail.js";
import { setupCreateListingPage } from "./pages/createListing.js";

function startApp() {
  setupNavbar();

  const page = document.body.dataset.page;

  if (page === "login") {
    setupLoginPage();
  }

  if (page === "register") {
    setupRegisterPage();
  }

  if (page === "profile") {
    setupProfilePage();
  }

  if (page === "home") {
    setupHomePage();
  }

  if (page === "listings") {
    setupListingsPage();
  }

  if (page === "listing") {
    setupListingDetailPage();
  }

  if (page === "create-listing") {
    setupCreateListingPage();
  }
}

document.addEventListener("DOMContentLoaded", startApp);

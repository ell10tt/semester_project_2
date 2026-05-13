export default {
  base: "/semester_project_2/",
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
        listings: "listings.html",
        listing: "listing.html",
        login: "login.html",
        register: "register.html",
        profile: "profile.html",
        createListing: "create-listing.html",
        editListing: "edit-listing.html",
        editProfile: "edit-profile.html",
      },
    },
  },
};

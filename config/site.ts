export const siteConfig = {
  name: "Maksimov Townhouse",
  notionUrl: process.env.NOTION_PAGE_URL || "https://amoffice.notion.site/Andrey-Maksimov-3930e83e68884fbd9da04dcd8dbadab6",
  
  wifi: {
    ssid: "Maksimov's Guest Network",
    password: "guestswelcome",
    security: "WPA",
  },
  
  contacts: {
    andrey: {
      name: "Andrey Maksimov",
      phone: "+971552262337",
      email: "i@andrey-maximov.com",
      whatsapp: "https://wa.me/971552262337?text=Hi%20Andrey!%20I%20just%20scanned%20your%20QR%20code%20and%20decided%20to%20text%20you.",
      telegram: "https://t.me/am_dxb",
      linkedin: "https://www.linkedin.com/in/andreymaximov/",
    },
    wife: {
      name: "Evgeniya Maksimova",
      phone: "+971553230919",
      email: "mail@evgeniya-maximova.com",
      whatsapp: "https://wa.me/971553230919?text=Hi%20Evgeniya!%20I%20just%20scanned%20your%20QR%20code%20and%20decided%20to%20text%20you.",
      telegram: "https://t.me/+971553230919",
      linkedin: "https://www.linkedin.com/in/evgeniya-maksimova/",
    },
  },
  
  rental: {
    listingUrl: "https://example.com/listing", // Replace with actual
    bookingUrl: "https://example.com/booking", // Replace with actual
  },
};

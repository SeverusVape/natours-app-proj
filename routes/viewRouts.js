const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");
<<<<<<< HEAD
// const CSP = "Content-Security-Policy";
// const POLICY =
//     "default-src 'self' https://*.mapbox.com ;" +
//     "base-uri 'self';block-all-mixed-content;" +
//     "font-src 'self' https: data:;" +
//     "frame-ancestors 'self';" +
//     "img-src http://localhost:3000 'self' blob: data:;" +
//     "object-src 'none';" +
//     "script-src https: cdn.jsdelivr.net cdnjs.cloudflare.com api.mapbox.com 'self' blob: ;" +
//     "script-src-attr 'none';" +
//     "style-src 'self' https: 'unsafe-inline';" +
//     "upgrade-insecure-requests;";

// router.use((req, res, next) => {
//     res.setHeader(CSP, POLICY);
//     next();
// });
=======

const router = express.Router();

router.use(authController.isLoggedIn);
>>>>>>> f287947206f88a822085d969b1d18958bab0d825

const router = express.Router();

router.use(authController.isLoggedIn);

router.get("/", viewsController.getOverview);
router.get("/tour/:slug", viewsController.getTour);
router.get("/login", viewsController.getLoginForm);

module.exports = router;

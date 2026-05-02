# 🐝 CargoBee — Your City. Your Cargo. On Demand.

---

## 📌 The Problem Statement

Booking cargo vehicles for everyday consumers remains a frustratingly broken experience compared to passenger transport:

- **No on-demand platform exists** for consumers needing to transport single items like furniture, appliances, or bulk purchases across the city using small cargo tempos or pickup trucks.
- **Price opacity and haggling** — consumers are forced to negotiate rates directly with unorganized tempo drivers at roadsides, with zero fare transparency or standardized pricing.
- **No digital convenience** — there is no app-based booking, live tracking, or digital payment option; everything happens over phone calls or in person.
- **Trust and safety gap** — drivers are completely unverified, leaving consumers with no background checks, ratings, or accountability mechanisms.
- **Inefficiency for drivers** — tempo and pickup truck operators lack a centralized platform to receive bookings, manage trips, and track earnings, resulting in idle time and lost income.

---

## ✅ Solution

CargoBee is a full-stack, on-demand cargo booking platform that bridges the gap between consumers and verified cargo vehicle drivers:

1. **Instant Booking** — Consumers can book a Mini Tempo, Pickup Truck, or E-Cart in under 2 minutes through a clean, app-like web interface.
2. **Transparent Fare Estimation** — Upfront fare breakdown shown before booking, including base fare, distance charge, surcharges, and GST — no surprises.
3. **Verified Driver Network** — Only verified, insured drivers are onboarded; each driver profile displays ratings, vehicle details, and delivery count.
4. **Live GPS Tracking** — Real-time tracking of the driver's location from pickup to drop-off, with ETA updates and share-trip functionality.
5. **Multiple Vehicle Types** — Choose from Mini Tempo (₹249), Pickup Truck (₹599), or E-Cart (₹249) depending on cargo size and type.
6. **Digital Payments** — Secure UPI, PhonePe, and GPay payment integration via Razorpay with auto-generated PDF receipts.
7. **Driver Dashboard** — Drivers get a dedicated dashboard to accept/decline rides, track daily earnings, and manage their active trips.
8. **Ratings & Feedback** — Post-trip rating system with tags (On Time, Careful Goods, Polite, Quick Route) to maintain quality and trust.

---

## 👥 User Roles

### 🛍️ Consumer
- Register / Login via email + password or Google OAuth (Firebase)
- Enter pickup and drop-off addresses with Google Maps Places Autocomplete
- Select vehicle type (Mini Tempo, Pickup Truck, E-Cart) and cargo category (Boxes, Furniture, Electronics, Other)
- View upfront fare estimate with full breakdown (base fare, distance charge, peak surcharge, GST) before confirming
- Track assigned driver in real time on a live Google Map with ETA updates
- Share trip details via a share-trip link
- Rate the driver using a star rating + tag chip system (On Time, Careful Goods, Polite, Quick Route) post-delivery
- View full trip history with status filters (All / Completed / Cancelled) on a dedicated Activity page
- Manage profile — update name, email, home address, and office address

### 🚛 Driver
- Register with name, email, password, and role selection via consumer/driver toggle
- Toggle Online / Offline status from the dashboard header
- Receive incoming booking alerts with a live 60-second countdown ring timer to Accept or Decline
- View pickup and drop-off route details within the request card before accepting
- Navigate to pickup and drop-off locations using the integrated Google Map
- Upload a delivery photo to confirm cargo handover before completing the trip
- View today's earnings, total distance, duty hours, driver rating, and recent trip history on a dedicated dashboard
- Track weekly earnings breakdown via a visual bar chart on the Earnings page
- View payout history with status indicators (Processing / Deposited)
- Manage profile — update name, email, vehicle number, and driving license number

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React.js 19 (Vite 8) |
| **UI / Styling** | Tailwind CSS 3 (custom dark-mode design system with CSS variables) |
| **Icons** | Lucide React |
| **State Management** | Redux Toolkit |
| **Routing** | React Router v7 |
| **Forms & Validation** | Formik + Yup |
| **HTTP Client** | Axios (with request/response interceptors for JWT injection) |
| **Notifications** | React Hot Toast |
| **SEO** | React Helmet Async |
| **Maps & Autocomplete** | Google Maps API + `@react-google-maps/api` + `use-places-autocomplete` |
| **Authentication** | Firebase (Google OAuth) + JWT (email/password) |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB Atlas + Mongoose 9 |
| **Real-time** | Socket.IO (driver status, trip events, live GPS) |
| **Password Hashing** | bcrypt.js |
| **File Uploads** | Multer |
| **Rate Limiting** | express-rate-limit |
| **Design** | [Figma Prototype](https://www.figma.com/proto/wDNO99XbxdTpCqD2XUk1JJ/Untitled?node-id=323-2018&p=f&viewport=18123%2C66%2C0.6&t=ZFzdPOK6sLKTwtSm-1&scaling=contain&content-scaling=fixed&starting-point-node-id=323%3A2018&page-id=0%3A1) |
| **Deployment — Frontend** | Vercel |
| **Deployment — Backend** | Render |

---

## 📁 Project Structure

```
cargobee/
├── frontend/                            # React.js (Vite) Frontend
│   ├── index.html                       # Root HTML with meta tags
│   ├── vite.config.js                   # Vite build configuration
│   ├── tailwind.config.js               # Custom color palette + darkMode: 'class'
│   ├── postcss.config.js                # PostCSS with Tailwind + Autoprefixer
│   ├── eslint.config.js                 # ESLint configuration
│   ├── .env                             # Environment variables (VITE_* prefixed)
│   └── src/
│       ├── main.jsx                     # Entry point — Redux Provider, HelmetProvider, Toaster
│       ├── App.jsx                      # Root router — auth hydration + all lazy-loaded routes
│       ├── index.css                    # Global styles, CSS variables, dark mode tokens
│       ├── App.css                      # Additional app-level styles
│       │
│       ├── assets/                      # Static assets
│       │   ├── bee-logo.png             # Official CargoBee bee logo
│       │   ├── hero.png                 # Hero illustration
│       │   ├── onboarding_slide1.png    # Onboarding carousel slide 1
│       │   ├── onboarding_slide2.png    # Onboarding carousel slide 2
│       │   └── onboarding_slide3.png    # Onboarding carousel slide 3
│       │
│       ├── components/                  # Reusable UI components
│       │   ├── AddressInput.jsx         # Google Places Autocomplete input field
│       │   ├── Avatar.jsx               # User/driver avatar with image support
│       │   ├── AvatarInitials.jsx       # Fallback avatar with name initials + color
│       │   ├── Badge.jsx                # Status badges (Completed, Cancelled, Active)
│       │   ├── BottomNav.jsx            # Consumer mobile bottom navigation bar
│       │   ├── Button.jsx               # Primary / outline / ghost / loading variants
│       │   ├── Card.jsx                 # Base card with shadow + rounded corners
│       │   ├── CargoTypeSelector.jsx    # Multi-select cargo category chip row
│       │   ├── DriverCard.jsx           # Driver info (photo, name, rating, vehicle)
│       │   ├── ErrorBoundary.jsx        # Global error boundary class component
│       │   ├── FareBreakdown.jsx        # Itemised fare estimate display
│       │   ├── FileUpload.jsx           # Drag & drop file upload with preview
│       │   ├── Input.jsx                # Styled input with error message support
│       │   ├── MapView.jsx              # Google Maps embed component
│       │   ├── Modal.jsx                # Accessible overlay modal
│       │   ├── Navbar.jsx               # Consumer top navbar with tabs
│       │   ├── PageWrapper.jsx          # SEO helmet + consistent page padding
│       │   ├── ProtectedRoute.jsx       # Auth guard — redirects to /login if unauthenticated
│       │   ├── RoleRoute.jsx            # Role guard — restricts by consumer/driver role
│       │   ├── Sidebar.jsx              # Driver dashboard left sidebar
│       │   ├── Spinner.jsx              # Loading spinner (Suspense fallback)
│       │   ├── ThemeToggle.jsx          # Dark/light mode toggle button
│       │   ├── Toast.jsx                # React Hot Toast config wrapper
│       │   ├── TripRequestAlert.jsx     # Incoming booking modal with 60s countdown
│       │   └── VehicleCard.jsx          # Selectable vehicle type card with price
│       │
│       ├── pages/                       # Route-level page components
│       │   ├── SplashScreen.jsx         # Auto-transitions to Onboarding after 2.5s
│       │   ├── Onboarding.jsx           # 3-slide carousel with swipe gesture support
│       │   ├── Login.jsx                # Email/password + Google OAuth, consumer/driver toggle
│       │   ├── Register.jsx             # Registration form with password strength indicator
│       │   ├── Home.jsx                 # Booking screen — map + vehicle + fare + Book Now
│       │   ├── AddressSearch.jsx        # Places autocomplete overlay with recent searches
│       │   ├── DriverMatching.jsx       # Animated search screen with ripple animations
│       │   ├── DriverConfirmed.jsx      # Driver details + call/message + Track Live button
│       │   ├── LiveTracking.jsx         # Live map with driver ETA and route polyline
│       │   ├── TripCompletion.jsx       # Fare receipt + payment breakdown + Pay via UPI
│       │   ├── RateExperience.jsx       # Stars + tag chips + comment + Submit Rating
│       │   ├── Trips.jsx                # Trip history with status filters + search + sidebar
│       │   ├── Profile.jsx              # User/driver profile editor with role-aware fields
│       │   ├── DriverDashboard.jsx      # Earnings stats + trip request card + recent trips
│       │   ├── DriverActiveTrip.jsx     # Live map + delivery photo upload + Complete Trip
│       │   ├── Earnings.jsx             # Weekly earnings chart + payout history
│       │   └── NotFound.jsx             # 404 page with home link
│       │
│       ├── features/                    # Redux Toolkit slices
│       │   ├── authSlice.js             # { user, token, isAuthenticated, loading, error }
│       │   ├── bookingSlice.js          # { pickup, drop, vehicle, cargoTypes, fare, status }
│       │   ├── driverSlice.js           # { isOnline, currentTrip, earnings, pendingRequest }
│       │   ├── tripSlice.js             # { trips[], currentTrip, loading, error }
│       │   └── uiSlice.js              # { theme, globalLoading, toast }
│       │
│       ├── hooks/                       # Custom reusable React hooks
│       │   ├── useAuth.js               # user, isAuthenticated, isConsumer, isDriver
│       │   ├── useDebounce.js           # Debounce a value by delay (for Places API)
│       │   ├── useFetch.js              # { data, loading, error, execute } wrapper
│       │   ├── useLocalStorage.js       # [value, setValue] with JSON parse/stringify
│       │   └── useTheme.js              # theme, toggleTheme — synced with localStorage
│       │
│       ├── services/                    # Axios API abstraction layer
│       │   ├── api.js                   # Axios instance + JWT interceptor
│       │   ├── authService.js           # registerUser, loginUser, googleAuthApi, logoutUser
│       │   ├── bookingService.js        # createBooking, cancelBooking, getFareEstimate
│       │   ├── driverService.js         # toggleStatus, acceptRequest, getDashboard
│       │   ├── tripService.js           # getTrips, getTripById, rateTrip
│       │   └── paymentService.js        # createOrder, verifyPayment, getReceipt
│       │
│       ├── config/
│       │   └── firebase.js              # Firebase SDK init — auth + Google provider
│       │
│       ├── store/
│       │   └── store.js                 # Redux store — all slices registered here
│       │
│       └── utils/
│           ├── storage.js               # localStorage + sessionStorage helpers
│           ├── fareCalculator.js         # Base fare + distance + surcharge + GST
│           ├── formatters.js            # Currency (₹), date, distance formatters
│           └── validators.js            # Yup schemas for login + registration forms
│
├── backend/                             # Node.js + Express Backend
│   ├── package.json
│   ├── .env                             # PORT, MONGO_URI, JWT_SECRET, FRONTEND_URL
│   ├── .gitignore
│   └── src/
│       ├── server.js                    # App setup, CORS, rate limiting, Socket.IO, routes
│       │
│       ├── config/
│       │   ├── db.js                    # Mongoose MongoDB Atlas connection
│       │   └── firebase.js              # Firebase Admin SDK initialisation
│       │
│       ├── controllers/
│       │   ├── auth.controller.js       # register, login, googleAuth, logout
│       │   ├── user.controller.js       # getMe, updateMe, getWallet, topUpWallet, addSavedAddress
│       │   ├── trip.controller.js       # createTrip, getMyTrips, getTripById, cancelTrip, rateTrip
│       │   ├── driver.controller.js     # getDashboard, updateStatus, getEarnings, acceptTrip, completeTrip
│       │   ├── nearby.controller.js     # getNearbyDrivers (Haversine distance filter)
│       │   └── vehicle.controller.js    # getVehicles, addVehicle, getVehicleById, updateVehicleStatus
│       │
│       ├── middleware/
│       │   ├── auth.middleware.js        # JWT verification — protect route middleware
│       │   ├── role.middleware.js        # Role-based access control (consumer/driver)
│       │   └── errorHandler.js          # Global Express error handler
│       │
│       ├── models/
│       │   ├── User.js                  # name, email, password, role, wallet, addresses, driver fields
│       │   ├── Driver.js                # Extended driver-specific model (vehicleType, license, earnings)
│       │   ├── Booking.js               # pickup, drop, vehicle, fareBreakdown, status
│       │   ├── Trip.js                  # consumerId, driverId, status, fare, distance, timestamps
│       │   ├── Rating.js                # tripId, raterId, score, tags, comment
│       │   └── Vehicle.js               # ownerId, name, type, registrationNumber, capacity, status
│       │
│       ├── routes/
│       │   ├── auth.routes.js           # POST /register, /login, /google, /logout
│       │   ├── user.routes.js           # GET/PUT /me, GET /wallet, POST /wallet/topup, /saved-address
│       │   ├── trip.routes.js           # CRUD trip operations + rating
│       │   ├── driver.routes.js         # Dashboard, status toggle, earnings, accept/complete trip
│       │   ├── drivers.routes.js        # GET /nearby — nearby online drivers
│       │   ├── bookingRoutes.js         # Booking creation and management
│       │   ├── vehicle.routes.js        # Vehicle CRUD for driver fleet
│       │   └── paymentRoutes.js         # Razorpay order creation, verification, receipt (stubs)
│       │
│       ├── sockets/
│       │   └── trip.socket.js           # Socket.IO — driver join, trip events, live GPS, disconnect
│       │
│       └── utils/
│           ├── fareCalculator.js        # Base fare + ₹15/km after 3km + peak surcharge + GST
│           ├── jwt.js                   # signToken + verifyToken (JWT helpers)
│           └── otp.js                   # OTP generation utilities
│
├── .gitignore
└── README.md
```

---

## 🔌 API Routes

### Auth Routes — `/api/auth`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user with name, email, password, and role | ❌ |
| `POST` | `/api/auth/login` | Login with email + password, returns JWT | ❌ |
| `POST` | `/api/auth/google` | Google OAuth — upsert user in DB and return JWT | ❌ |
| `POST` | `/api/auth/logout` | Logout signal (stateless — client clears token) | ❌ |

### User Routes — `/api/user`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/user/me` | Get current logged-in user profile | ✅ |
| `PUT` | `/api/user/me` | Update profile (name, email, addresses, vehicle/license) | ✅ |
| `GET` | `/api/user/wallet` | Get wallet balance and transaction history | ✅ |
| `POST` | `/api/user/wallet/topup` | Add money to wallet | ✅ |
| `POST` | `/api/user/saved-address` | Save a new address (home/office/other) | ✅ |

### Trip Routes — `/api/trips`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/trips` | Create a new trip (booking) with pickup, drop, vehicle type | ✅ |
| `GET` | `/api/trips` | Get all trips for the logged-in user (consumer or driver) | ✅ |
| `GET` | `/api/trips/:id` | Get single trip detail by ID | ✅ |
| `PUT` | `/api/trips/:id/cancel` | Cancel an existing trip | ✅ |
| `POST` | `/api/trips/:id/rate` | Submit star rating, tags, and comment for a completed trip | ✅ |

### Driver Routes — `/api/driver` (driver role required)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/driver/dashboard` | Get driver dashboard stats (today's earnings, trips, distance) | ✅ |
| `PUT` | `/api/driver/status` | Toggle driver online / offline status | ✅ |
| `GET` | `/api/driver/earnings` | Get earnings with period filter (week/month/all) | ✅ |
| `PUT` | `/api/driver/trips/:id/accept` | Driver accepts an incoming trip request | ✅ |
| `PUT` | `/api/driver/trips/:id/complete` | Driver marks trip as completed | ✅ |

### Nearby Drivers — `/api/drivers`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/drivers/nearby` | Get online drivers within radius (Haversine distance filter) | ✅ |

### Vehicle Routes — `/api/vehicles`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/vehicles` | Get all vehicles owned by the logged-in driver | ✅ |
| `POST` | `/api/vehicles` | Register a new vehicle | ✅ |
| `GET` | `/api/vehicles/:id` | Get vehicle details by ID | ✅ |
| `PUT` | `/api/vehicles/:id/status` | Update vehicle status (available/on_trip/maintenance) | ✅ |

### Payment Routes — `/api/payments`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/payments/create-order` | Create a Razorpay payment order (stub) | ✅ |
| `POST` | `/api/payments/verify` | Verify Razorpay HMAC signature (stub) | ✅ |
| `GET` | `/api/payments/receipt/:tripId` | Get receipt for a completed trip (stub) | ✅ |

### Socket.IO Events (Real-time)

| Event | Direction | Description |
|---|---|---|
| `driver:join` | Client → Server | Driver goes online and joins their socket room |
| `trip:join` | Client → Server | Consumer/driver joins a trip room for live updates |
| `location:update` | Client → Server | Driver broadcasts GPS coordinates |
| `location:broadcast` | Server → Client | Forward driver location to consumer in trip room |
| `trip:accept` | Client → Server | Driver accepts a trip |
| `trip:accepted` | Server → Client | Notify consumer that driver accepted |
| `trip:complete` | Client → Server | Driver completes a trip |
| `trip:completed` | Server → Client | Notify consumer that trip is completed |
| `trip:new` | Server → All | Broadcast new trip request to nearby drivers |

---

## 🚀 Steps to Run the Project Locally

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB instance)
- [Git](https://git-scm.com/)
- A Firebase project with Google Sign-In enabled
- A Google Maps API key with Maps JavaScript API and Places API enabled

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/cargobee.git
cd cargobee
```

---

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `/backend`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

> Server runs at `http://localhost:5000`
> Socket.IO is automatically initialised on the same port.

---

### 3. Set Up the Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file inside `/frontend`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

Start the frontend development server:

```bash
npm run dev
```

> App runs at `http://localhost:5173`

---

### 4. Open in Browser

Visit `http://localhost:5173` — you will land on the CargoBee Splash Screen. 🎉

The app runs in **demo / simulation mode** by default:
- Driver matching simulates a search and then auto-assigns a mock driver
- Live tracking simulates driver movement with animated map updates
- The payment flow shows a success animation without a real Razorpay charge unless API keys are fully configured
- Trip history and earnings pages display mock data for demonstration purposes

---

### 5. Build for Production

```bash
cd frontend
npm run build
```

> The production-optimized bundle will be generated in `frontend/dist/`.

---

## 📄 License

This project is built as an academic class project. All UI designs are original and created in Figma.

import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AdminRoute from '../components/common/AdminRoute';
import Loader from '../components/common/Loader';

// ===================== PUBLIC & MOVIES =====================
const Home = lazy(() => import('../pages/public/Home'));
const Movies = lazy(() => import('../pages/movies/Movies'));
const MovieDetails = lazy(() => import('../pages/movies/MovieDetails'));
const GenresPage = lazy(() => import('../pages/movies/GenresPage'));
const GenreDetailsPage = lazy(() => import('../pages/movies/GenreDetailsPage'));
const CatalogPage = lazy(() => import('../pages/movies/CatalogPage'));
const ArchiveCatalogPage = lazy(() => import('../pages/movies/ArchiveCatalogPage'));
const ArchiveMovieDetailsPage = lazy(() => import('../pages/movies/ArchiveMovieDetailsPage'));
const Login = lazy(() => import('../pages/public/Login'));
const Register = lazy(() => import('../pages/public/Register'));
const Unauthorized = lazy(() => import('../pages/public/Unauthorized'));
const NotFound = lazy(() => import('../pages/system/NotFound'));

// ===================== CINEMA =====================
const CinemasPage = lazy(() => import('../pages/cinema/CinemasPage'));
const CinemaDetailsPage = lazy(() => import('../pages/cinema/CinemaDetailsPage'));
const SessionsPage = lazy(() => import('../pages/cinema/SessionsPage'));
const SessionDetailsPage = lazy(() => import('../pages/cinema/SessionDetailsPage'));

// ===================== COMMUNITY =====================
const CollectionsPage = lazy(() => import('../pages/community/CollectionsPage'));
const CollectionDetailsPage = lazy(() => import('../pages/community/CollectionDetailsPage'));
const ActorsPage = lazy(() => import('../pages/community/ActorsPage'));
const ActorDetailsPage = lazy(() => import('../pages/community/ActorDetailsPage'));
const ReviewsPage = lazy(() => import('../pages/community/ReviewsPage'));
const WriteReviewPage = lazy(() => import('../pages/community/WriteReviewPage'));
const CommunityPage = lazy(() => import('../pages/community/CommunityPage'));

// ===================== STREAMING =====================
const WatchPage = lazy(() => import('../pages/streaming/WatchPage'));
const WatchlistPage = lazy(() => import('../pages/streaming/WatchlistPage'));
const ContinueWatchingPage = lazy(() => import('../pages/streaming/ContinueWatchingPage'));

// ===================== BOOKING =====================
const SeatBooking = lazy(() => import('../pages/booking/SeatBooking'));
const BookingSuccess = lazy(() => import('../pages/booking/BookingSuccess'));
const MyBookings = lazy(() => import('../pages/booking/MyBookings'));
const BookingDetails = lazy(() => import('../pages/booking/BookingDetails'));

// ===================== ACCOUNT =====================
const Profile = lazy(() => import('../pages/account/Profile'));
const SettingsPage = lazy(() => import('../pages/account/SettingsPage'));
const NotificationsPage = lazy(() => import('../pages/account/NotificationsPage'));
const FavoritesPage = lazy(() => import('../pages/account/FavoritesPage'));
const RecentlyViewedPage = lazy(() => import('../pages/account/RecentlyViewedPage'));
const HelpPage = lazy(() => import('../pages/account/HelpPage'));
const AboutPage = lazy(() => import('../pages/account/AboutPage'));
const ContactPage = lazy(() => import('../pages/account/ContactPage'));
const PrivacyPage = lazy(() => import('../pages/account/PrivacyPage'));
const TermsPage = lazy(() => import('../pages/account/TermsPage'));

// ===================== ADMIN =====================
const AdminLayout = lazy(() => import('../pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminMovies = lazy(() => import('../pages/admin/AdminMovies'));
const AdminSessions = lazy(() => import('../pages/admin/AdminSessions'));
const AdminBookings = lazy(() => import('../pages/admin/AdminBookings'));
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers'));
const AdminReports = lazy(() => import('../pages/admin/AdminReports'));
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'));

export function AppRoutes() {
  return (
    <Suspense fallback={<Loader fullScreen text="Cineora yuklanmoqda..." />}>
      <Routes>
        <Route element={<MainLayout />}>
          {/* ===================== PUBLIC ===================== */}
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/movies/:id/review" element={<WriteReviewPage />} />
          <Route path="/genres" element={<GenresPage />} />
          <Route path="/genres/:slug" element={<GenreDetailsPage />} />
          <Route path="/trending" element={<CatalogPage variant="trending" />} />
          <Route path="/popular" element={<CatalogPage variant="popular" />} />
          <Route path="/top-rated" element={<CatalogPage variant="top-rated" />} />
          <Route path="/upcoming" element={<CatalogPage variant="upcoming" />} />
          <Route path="/catalog/archive" element={<ArchiveCatalogPage />} />
          <Route path="/catalog/archive/:identifier" element={<ArchiveMovieDetailsPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:id" element={<CollectionDetailsPage />} />
          <Route path="/cinemas" element={<CinemasPage />} />
          <Route path="/cinemas/:id" element={<CinemaDetailsPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/sessions/:id" element={<SessionDetailsPage />} />
          <Route path="/actors" element={<ActorsPage />} />
          <Route path="/actors/:id" element={<ActorDetailsPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/community" element={<CommunityPage />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path="/help" element={<HelpPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* ===================== STREAMING ===================== */}
          <Route path="/watch/:movieId" element={<WatchPage />} />
          <Route path="/continue-watching" element={<ContinueWatchingPage />} />
          <Route
            path="/watchlist"
            element={
              <ProtectedRoute>
                <WatchlistPage />
              </ProtectedRoute>
            }
          />

          {/* ===================== BOOKING (PROTECTED) ===================== */}
          <Route
            path="/booking/:sessionId"
            element={
              <ProtectedRoute>
                <SeatBooking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking/success"
            element={
              <ProtectedRoute>
                <BookingSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings/:id"
            element={
              <ProtectedRoute>
                <BookingDetails />
              </ProtectedRoute>
            }
          />

          {/* ===================== ACCOUNT (PROTECTED) ===================== */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/recently-viewed" element={<RecentlyViewedPage />} />

          {/* ===================== ADMIN (ROLE-PROTECTED) ===================== */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="movies" element={<AdminMovies />} />
            <Route path="sessions" element={<AdminSessions />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* ===================== SYSTEM ===================== */}
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;

import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import MoodCheckIn from './pages/MoodCheckIn';
import MoodHistory from './pages/MoodHistory';
import Analytics from './pages/Analytics';
import Wellness from './pages/Wellness';
import MindGym from './pages/MindGym';
import Journal from './pages/Journal';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Achievements from './pages/Achievements';
import Splash from './pages/Splash';
import Music from './pages/Music';
import MoodVision from './pages/MoodVision';
import Notifications from './pages/Notifications';
import Goals from './pages/Goals';
import Streaks from './pages/Streaks';
import Reports from './pages/Reports';
import Mentor from './pages/Mentor';
import Login from './pages/Login';
import Register from './pages/Register';
import SmileBreak from './pages/SmileBreak';


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mood-checkin" element={<MoodCheckIn />} />
        <Route path="/mood-history" element={<MoodHistory />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/wellness" element={<Wellness />} />
        <Route path="/mind-gym" element={<MindGym />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/music" element={<Music />} />
        <Route path="/mood-vision" element={<MoodVision />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/streaks" element={<Streaks />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/ai-mentor" element={<Mentor />} />
        <Route path="/smile-break" element={<SmileBreak />} />

      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

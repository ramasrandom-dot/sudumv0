import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Navigate, Outlet, RouterProvider, createBrowserRouter, createHashRouter, createMemoryRouter } from 'react-router-dom'
import './index.css'
import { AppStoreProvider, useStore } from '@/store/AppStore'
import { ToastProvider } from '@/components/ui'
import PublicLayout from '@/layouts/PublicLayout'
import AppLayout, { RequireRole } from '@/layouts/AppLayout'
import Home from '@/pages/public/Home'
import Program from '@/pages/public/Program'
import Apply from '@/pages/public/Apply'
import Network from '@/pages/public/Network'
import Login from '@/pages/public/Login'
import NotFound from '@/pages/public/NotFound'
import { ParticipantDates, ParticipantHome, ParticipantTeam } from '@/pages/app/participant'
import { MentorDates, MentorTeamDetail, MentorTeams } from '@/pages/app/mentor'
import { ExpertClinics, ExpertWorkshops } from '@/pages/app/expert'
import { JudgeEvent, JudgeEvents, JudgeScores } from '@/pages/app/judge'
import { AdminApplications, AdminDashboard, AdminPeople, AdminTeams, AdminWorkshops } from '@/pages/app/admin'
import { AdminEscalations, AdminJudging, AdminJudgingEvent } from '@/pages/app/admin/operations'
import type { Role } from '@/data/types'

function AppHome() {
  const { me } = useStore()
  return <Navigate to={me ? `/app/${me.role}` : '/login'} replace />
}

function OutletPassthrough() {
  return <Outlet />
}

const section = (role: Role, children: { path?: string; index?: boolean; element: React.ReactNode }[]) => ({
  path: role,
  element: <RequireRole role={role}><OutletPassthrough /></RequireRole>,
  children,
})


// The single-file preview opens from a file or inside an embedded viewer: it routes with the
// URL hash where the page has a real address, and in memory where it does not (about:srcdoc).
// VITE_ROUTER=memory forces in-memory routing, for hosts whose links carry no page path.
const hasAddress = /^(https?|file):$/.test(window.location.protocol)
const createRouter =
  import.meta.env.MODE !== 'single'
    ? createBrowserRouter
    : hasAddress && import.meta.env.VITE_ROUTER !== 'memory'
      ? createHashRouter
      : createMemoryRouter

const router = createRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/program', element: <Program /> },
      { path: '/apply', element: <Apply /> },
      { path: '/mentors', element: <Network /> },
      { path: '/join', element: <Navigate to="/apply" replace /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  { path: '/login', element: <Login /> },
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      { index: true, element: <AppHome /> },
      section('participant', [
        { index: true, element: <ParticipantHome /> },
        { path: 'dates', element: <ParticipantDates /> },
        { path: 'team', element: <ParticipantTeam /> },
      ]),
      section('mentor', [
        { index: true, element: <MentorTeams /> },
        { path: 'teams/:teamId', element: <MentorTeamDetail /> },
        { path: 'dates', element: <MentorDates /> },
      ]),
      section('expert', [
        { index: true, element: <ExpertWorkshops /> },
        { path: 'clinics', element: <ExpertClinics /> },
      ]),
      section('judge', [
        { index: true, element: <JudgeEvents /> },
        { path: 'events/:eventId', element: <JudgeEvent /> },
        { path: 'events/:eventId/:teamId', element: <JudgeEvent /> },
        { path: 'scores', element: <JudgeScores /> },
      ]),
      section('admin', [
        { index: true, element: <AdminDashboard /> },
        { path: 'applications', element: <AdminApplications /> },
        { path: 'teams', element: <AdminTeams /> },
        { path: 'workshops', element: <AdminWorkshops /> },
        { path: 'people', element: <AdminPeople /> },
        { path: 'judging', element: <AdminJudging /> },
        { path: 'judging/:eventId', element: <AdminJudgingEvent /> },
        { path: 'escalations', element: <AdminEscalations /> },
      ]),
      // Old or mistyped platform addresses land on the role's home.
      { path: '*', element: <AppHome /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppStoreProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </AppStoreProvider>
  </StrictMode>,
)

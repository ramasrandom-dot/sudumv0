import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import { AppStoreProvider, useStore } from '@/store/AppStore'
import { ToastProvider } from '@/components/ui'
import PublicLayout from '@/layouts/PublicLayout'
import AppLayout, { RequireRole } from '@/layouts/AppLayout'
import Home from '@/pages/public/Home'
import Program from '@/pages/public/Program'
import Apply from '@/pages/public/Apply'
import Join from '@/pages/public/Join'
import Login from '@/pages/public/Login'
import NotFound from '@/pages/public/NotFound'
import {
  ParticipantMentoring,
  ParticipantMilestones,
  ParticipantOverview,
  ParticipantResults,
  ParticipantTeam,
  ParticipantWorkshops,
} from '@/pages/app/participant'
import { MentorHours, MentorReviews, MentorSessions, MentorTeamDetail, MentorTeams } from '@/pages/app/mentor'
import { ExpertClinics, ExpertProfile, ExpertWorkshops } from '@/pages/app/expert'
import { JudgeEvent, JudgeEvents, JudgeScores } from '@/pages/app/judge'
import { AdminApplications, AdminDashboard, AdminPeople, AdminTeams, AdminWorkshops } from '@/pages/app/admin'
import { AdminEscalations, AdminJudging, AdminJudgingEvent, AdminTimeline } from '@/pages/app/admin/operations'
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


const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/program', element: <Program /> },
      { path: '/apply', element: <Apply /> },
      { path: '/join', element: <Join /> },
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
        { index: true, element: <ParticipantOverview /> },
        { path: 'milestones', element: <ParticipantMilestones /> },
        { path: 'workshops', element: <ParticipantWorkshops /> },
        { path: 'mentoring', element: <ParticipantMentoring /> },
        { path: 'results', element: <ParticipantResults /> },
        { path: 'team', element: <ParticipantTeam /> },
      ]),
      section('mentor', [
        { index: true, element: <MentorTeams /> },
        { path: 'teams/:teamId', element: <MentorTeamDetail /> },
        { path: 'reviews', element: <MentorReviews /> },
        { path: 'sessions', element: <MentorSessions /> },
        { path: 'hours', element: <MentorHours /> },
      ]),
      section('expert', [
        { index: true, element: <ExpertWorkshops /> },
        { path: 'clinics', element: <ExpertClinics /> },
        { path: 'profile', element: <ExpertProfile /> },
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
        { path: 'timeline', element: <AdminTimeline /> },
      ]),
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

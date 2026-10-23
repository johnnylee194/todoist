import { Routes, Route, Navigate } from "react-router-dom"
import { AppLayout } from "./components/layout/AppLayout"
import { Inbox } from "./pages/Inbox"

// Temporary Placeholder Components for testing routing
const Today = () => (
  <div>
    <h1 className="text-2xl font-bold mb-6">Today</h1>
    <div className="text-muted-foreground">Tasks due today.</div>
  </div>
)

const Upcoming = () => (
  <div>
    <h1 className="text-2xl font-bold mb-6">Upcoming</h1>
    <div className="text-muted-foreground">Tasks due in the future.</div>
  </div>
)

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app/inbox" replace />} />
      <Route path="/app" element={<AppLayout />}>
        <Route path="inbox" element={<Inbox />} />
        <Route path="today" element={<Today />} />
        <Route path="upcoming" element={<Upcoming />} />
        <Route path="projects/:projectId" element={<div className="text-2xl font-bold">Project View</div>} />
      </Route>
    </Routes>
  )
}

export default App

import { ProfileHeader } from '@/components/profile-header'
import { InterviewRecap } from '@/components/interview-recap'
import { IntrosFooter } from '@/components/intros-footer'

export default function ProfileResultsPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-muted to-background flex flex-col">
      <ProfileHeader />
      
      <main className="flex-1 pt-12">
        <div className="mx-auto max-w-6xl px-6 py-8 min-h-full">
          {/* Grid container with 12 columns */}
          <div className="grid grid-cols-12 gap-6">
            {/* Content area - 8 columns on desktop, full width on mobile */}
            <div className="col-span-12 lg:col-span-8 lg:col-start-3">
              {/* Header section */}
              <div className="mb-6">
                <div className="mb-4">
                  <h1 className="text-xl font-semibold text-gray-900">My Interview</h1>
                </div>
              </div>

              {/* Interview Recap */}
              <div className="space-y-4 pb-16">
                <InterviewRecap />
              </div>
            </div>
          </div>
        </div>
      </main>

      <IntrosFooter />
    </div>
  )
} 
import { Activity } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-center">
        <Activity className="mx-auto h-12 w-12 animate-pulse text-blue-400" />
        <p className="mt-4 text-white/60">Loading...</p>
      </div>
    </div>
  )
}

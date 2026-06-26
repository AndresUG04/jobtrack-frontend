import { ApplicationsList } from "@/components/applications/ApplicationsList";

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Applications
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Search, filter, and manage every role you&apos;re tracking.
        </p>
      </div>
      <ApplicationsList />
    </div>
  );
}

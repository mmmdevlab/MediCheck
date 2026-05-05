import { useMemo } from 'react';
import { useAssignedSupportRequests } from '../../hooks/useSupportRequests';

const HelpingStats = () => {
  const { data: requests = [], isLoading } = useAssignedSupportRequests();

  const stats = useMemo(() => {
    const handled = requests.filter(
      (r) => r.status === 'completed' || r.status === 'declined'
    ).length;
    const responded = requests.filter((r) => r.status !== 'pending').length;
    const rate =
      requests.length > 0 ? Math.round((responded / requests.length) * 100) : 0;

    const activePatientIds = new Set(
      requests
        .filter((req) => req.status === 'accepted')
        .map((req) => req.patientId)
    );

    return {
      requestsHandled: handled,
      responseRate: rate,
      activePatients: activePatientIds.size,
    };
  }, [requests]);

  if (isLoading) return <div className="animate-pulse">Loading stats...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">
        Your Helping Stats
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-6 rounded-3xl text-center border border-blue-100">
          <div className="text-3xl font-bold text-blue-600">
            {stats.requestsHandled}
          </div>
          <div className="text-xs font-bold text-black uppercase mt-1">
            Requests Handled
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-3xl text-center border border-green-100">
          <div className="text-3xl font-bold text-green-600">
            {stats.responseRate}%
          </div>
          <div className="text-xs font-bold text-black uppercase mt-1">
            Response Rate
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-3xl text-center border border-purple-100">
          <div className="text-3xl font-bold text-purple-600">
            {stats.activePatients}
          </div>
          <div className="text-xs font-bold text-black uppercase mt-1">
            Active Patients
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpingStats;

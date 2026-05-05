import { useQuery } from '@tanstack/react-query';
import { getMyLogs } from '../api/medicalLogs';

export const useMedicalLogs = (days = 7) => {
  return useQuery({
    queryKey: ['medicalLogs', days],
    queryFn: async () => {
      const response = await getMyLogs(days);

      if (response && Array.isArray(response.logs)) {
        return response;
      }
      return {
        logs: [],
        stats: {
          averageScore: null,
          trend: null,
          latestAlert: null,
          alertCount: 0,
        },
        days,
        count: 0,
      };
    },
    staleTime: 30 * 1000,
  });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createSupportRequest,
  getMySupportRequests,
  getAssignedSupportRequests,
  respondToSupportRequest,
  completeSupportRequest,
} from '../api/supportRequests';

export const supportRequestKeys = {
  myRequests: ['mySupportRequests'],
  assignedRequests: ['assignedSupportRequests'],
};

export const useMySupportRequests = () => {
  return useQuery({
    queryKey: supportRequestKeys.myRequests,
    queryFn: async () => {
      const data = await getMySupportRequests();
      return Array.isArray(data) ? data : [];
    },
    staleTime: 30 * 1000,
  });
};

export const useCreateSupportRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestData) => createSupportRequest(requestData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supportRequestKeys.myRequests });
      queryClient.invalidateQueries({ queryKey: supportRequestKeys.assignedRequests });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

export const useAssignedSupportRequests = (status) => {
  return useQuery({
    queryKey: status
      ? [...supportRequestKeys.assignedRequests, status]
      : supportRequestKeys.assignedRequests,
    queryFn: async () => {
      const data = await getAssignedSupportRequests(status);
      return Array.isArray(data) ? data : [];
    },
    staleTime: 30 * 1000,
  });
};

export const useRespondToSupportRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, status }) =>
      respondToSupportRequest(requestId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: supportRequestKeys.assignedRequests,
      });
      queryClient.invalidateQueries({
        queryKey: supportRequestKeys.myRequests,
      });
    },
  });
};

export const useCompleteSupportRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId) => completeSupportRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: supportRequestKeys.assignedRequests,
      });
      queryClient.invalidateQueries({
        queryKey: supportRequestKeys.myRequests,
      });
    },
  });
};

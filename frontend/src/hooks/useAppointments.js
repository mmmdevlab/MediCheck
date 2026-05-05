import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  getAllAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  completeAppointment,
  undoCompleteAppointment,
} from '../api/appointments';

export const appointmentKeys = {
  all: ['appointments'],
  detail: (id) => ['appointments', id],
};

export const useAppointments = () => {
  return useQuery({
    queryKey: appointmentKeys.all,
    queryFn: async () => {
      const data = await getAllAppointments();
      return data.appointments || data || [];
    },
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentData) => {
      const data = await createAppointment(appointmentData);
      return data.appointment || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const result = await updateAppointment(id, data);
      return result.appointment || result;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.detail(variables.id),
      });
    },
  });
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await deleteAppointment(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
};

export const useCompleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const data = await completeAppointment(id);
      return data.appointment || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
};

export const useUndoComplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const data = await undoCompleteAppointment(id);
      return data.appointment || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
};

export const useUpcomingAppointments = (limit = 3) => {
  const { data: appointments = [], ...queryState } = useAppointments();

  const upcoming = useMemo(() => {
    const now = new Date();
    return appointments
      .filter((apt) => {
        const isScheduled = apt.status === 'scheduled';
        const isFuture = new Date(apt.appointmentDate) > now;
        return isScheduled && isFuture;
      })
      .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
      .slice(0, limit);
  }, [appointments, limit]);

  return { data: upcoming, ...queryState };
};

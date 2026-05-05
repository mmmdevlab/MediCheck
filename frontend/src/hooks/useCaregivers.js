import {
  useQuery,
  useQueries,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  grantCaregiverAccess,
  getMyCaregivers,
  revokeCaregiverAccess,
  getMyPatients,
  getPatientAppointments,
} from '../api/caregivers';
import { getPatientLatestLog } from '../api/medicalLogs';

export const caregiverKeys = {
  patients: ['patients'],
  allPatientAppointments: ['allPatientAppointments'],
  myCaregivers: ['myCaregivers'],
};

export const useMyPatients = () => {
  return useQuery({
    queryKey: caregiverKeys.patients,
    queryFn: async () => {
      const data = await getMyPatients();
      return Array.isArray(data) ? data : [];
    },
    staleTime: 60 * 1000,
  });
};

export const useAllPatientAppointments = () => {
  const { data: patients = [] } = useMyPatients();

  return useQuery({
    queryKey: caregiverKeys.allPatientAppointments,
    queryFn: async () => {
      const appointmentPromises = patients.map(async (patient) => {
        try {
          const data = await getPatientAppointments(patient.patientId);

          return data.map((appointment) => ({
            ...appointment,
            patientId: patient.patientId,
            patientName: patient.name,
          }));
        } catch (error) {
          return [];
        }
      });

      const allAppointments = await Promise.all(appointmentPromises);
      const flatAppointments = allAppointments.flat();

      const now = new Date();
      const upcomingAppointments = flatAppointments.filter((apt) => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate > now && apt.status === 'scheduled';
      });

      return upcomingAppointments.sort(
        (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)
      );
    },
    enabled: patients.length > 0,
    staleTime: 5 * 60 * 1000,
  });
};

export const useMyCaregivers = () => {
  return useQuery({
    queryKey: caregiverKeys.myCaregivers,
    queryFn: async () => {
      const data = await getMyCaregivers();
      return Array.isArray(data) ? data : [];
    },
    staleTime: 60 * 1000,
  });
};

export const useGrantCaregiverAccess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (caregiverEmail) => grantCaregiverAccess(caregiverEmail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caregiverKeys.myCaregivers });
    },
  });
};

export const useRevokeCaregiverAccess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assignmentId) => revokeCaregiverAccess(assignmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caregiverKeys.myCaregivers });
    },
  });
};

export const useRevokePatientAccess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assignmentId) => revokeCaregiverAccess(assignmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caregiverKeys.patients });
    },
  });
};

export const usePatientHealthAlerts = () => {
  const { data: patients = [] } = useMyPatients();

  const logQueries = useQueries({
    queries: patients.map((patient) => ({
      queryKey: ['patientLatestLog', patient.patientId],
      queryFn: async () => {
        try {
          const log = await getPatientLatestLog(patient.patientId);
          return {
            log,
            patientId: patient.patientId,
            patientName: patient.name,
          };
        } catch {
          return null;
        }
      },
      staleTime: 5 * 60 * 1000,
    })),
  });

  const alerts = logQueries
    .map((q) => q.data)
    .filter((d) => d?.log?.feelingScore <= 2)
    .map((d) => ({
      patientId: d.patientId,
      patientName: d.patientName,
      feelingScore: d.log.feelingScore,
      loggedAt: d.log.createdAt,
    }));

  return {
    data: alerts,
    isLoading: patients.length > 0 && logQueries.some((q) => q.isLoading),
  };
};

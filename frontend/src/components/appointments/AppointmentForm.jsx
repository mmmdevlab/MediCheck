import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import { formatTime } from '../../utils/timeFormat';

const AppointmentForm = ({ appointment = null, onSubmit, onCancel }) => {
  const isEditing = !!appointment;

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState(() => {
    if (appointment) {
      const dateStr = appointment.appointmentDate?.slice(0, 10) || '';
      const timeStr = appointment.appointmentDate?.slice(11, 16) || '';
      return {
        title: appointment.title || '',
        doctorName: appointment.doctorName || '',
        clinicName: appointment.clinicName || '',
        appointmentDate: dateStr,
        appointmentTime: timeStr,
        location: appointment.location || '',
        notes: appointment.notes || '',
      };
    }
    return {
      title: '',
      doctorName: '',
      clinicName: '',
      appointmentDate: '',
      appointmentTime: '',
      location: '',
      notes: '',
    };
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Appointment title is required';
    }

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Date is required';
    }

    if (!formData.appointmentTime) {
      newErrors.appointmentTime = 'Time is required';
    } else if (
      formData.appointmentTime < '09:00' ||
      formData.appointmentTime > '18:00'
    ) {
      newErrors.appointmentTime =
        'Appointments must be between 9:00 AM and 6:00 PM';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const dateTimeString = `${formData.appointmentDate}T${formData.appointmentTime}:00`;
      const appointmentDateTime = new Date(dateTimeString);

      if (isNaN(appointmentDateTime.getTime())) {
        setErrors({ submit: 'Invalid date or time selected' });
        setIsSubmitting(false);
        return;
      }

      const payload = {
        title: formData.title.trim(),
        appointmentDate: appointmentDateTime.toISOString(),
      };

      if (formData.doctorName?.trim()) {
        payload.doctorName = formData.doctorName.trim();
      }
      if (formData.clinicName?.trim()) {
        payload.clinicName = formData.clinicName.trim();
      }
      if (formData.location?.trim()) {
        payload.location = formData.location.trim();
      }
      if (formData.notes?.trim()) {
        payload.notes = formData.notes.trim();
      }

      await onSubmit(payload);

      onCancel();
    } catch (error) {
      const errorMessage = error.response?.data?.details
        ? `Validation failed: ${JSON.stringify(error.response.data.details)}`
        : 'Failed to save appointment. Please try again.';

      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 flex items-center justify-between rounded-t-3xl">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">
              {isEditing ? 'EDIT APPOINTMENT' : 'NEW APPOINTMENT'}
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mt-1">
              {isEditing ? 'Update your calendar' : 'Add to your calendar'}
            </h2>
          </div>

          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-gray-900 mb-3">
              APPOINTMENT TITLE
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Annual Physical checkup"
              className={`
                w-full px-6 py-4 rounded-full
                bg-gray-100 border-2
                ${errors.title ? 'border-red-500' : 'border-transparent'}
                focus:border-blue-500 focus:bg-white
                transition-all outline-none
                text-gray-900 placeholder-gray-400
              `}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-2">{errors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-gray-900 mb-3">
                DOCTOR
              </label>
              <input
                type="text"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                placeholder="Dr. Smith"
                className="
                  w-full px-6 py-4 rounded-full
                  bg-gray-100 border-2 border-transparent
                  focus:border-blue-500 focus:bg-white
                  transition-all outline-none
                  text-gray-900 placeholder-gray-400
                "
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-gray-900 mb-3">
                CLINIC
              </label>
              <input
                type="text"
                name="clinicName"
                value={formData.clinicName}
                onChange={handleChange}
                placeholder="City Health Clinic"
                className="
                  w-full px-6 py-4 rounded-full
                  bg-gray-100 border-2 border-transparent
                  focus:border-blue-500 focus:bg-white
                  transition-all outline-none
                  text-gray-900 placeholder-gray-400
                "
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-gray-900 mb-3">
                DATE
              </label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                className={`
                  w-full px-6 py-4 rounded-full
                  bg-gray-100 border-2
                  ${errors.appointmentDate ? 'border-red-500' : 'border-transparent'}
                  focus:border-blue-500 focus:bg-white
                  transition-all outline-none
                  text-gray-900
                `}
              />
              {errors.appointmentDate && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.appointmentDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-gray-900 mb-3">
                TIME
              </label>
              <input
                type="time"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                min="09:00"
                max="18:00"
                className={`
                  w-full px-6 py-4 rounded-full
                  bg-gray-100 border-2
                  ${errors.appointmentTime ? 'border-red-500' : 'border-transparent'}
                  focus:border-blue-500 focus:bg-white
                  transition-all outline-none
                  text-gray-900
                `}
              />
              {errors.appointmentTime && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.appointmentTime}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-gray-900 mb-3">
              LOCATION
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="123 Main St, Room 204"
              className="
                w-full px-6 py-4 rounded-full
                bg-gray-100 border-2 border-transparent
                focus:border-blue-500 focus:bg-white
                transition-all outline-none
                text-gray-900 placeholder-gray-400
              "
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-gray-900 mb-3">
              NOTES
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Bring recent lab work"
              rows={4}
              className="
                w-full px-6 py-4 rounded-3xl
                bg-gray-100 border-2 border-transparent
                focus:border-blue-500 focus:bg-white
                transition-all outline-none resize-none
                text-gray-900 placeholder-gray-400
              "
            />
          </div>

          {errors.submit && (
            <div className="bg-red-50 border-2 border-red-500 rounded-full p-4">
              <p className="text-red-700 text-sm">{errors.submit}</p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="
                flex-1 px-6 py-4 rounded-full
                bg-gray-100 hover:bg-gray-200
                text-gray-900 font-bold uppercase tracking-wide
                transition-colors
              "
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                flex-1 px-6 py-4 rounded-full
                bg-blue-500 hover:bg-blue-600
                text-white font-bold uppercase tracking-wide
                transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {isSubmitting
                ? 'SAVING...'
                : isEditing
                  ? 'UPDATE APPOINTMENT'
                  : 'CREATE APPOINTMENT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AppointmentForm.propTypes = {
  appointment: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AppointmentForm;

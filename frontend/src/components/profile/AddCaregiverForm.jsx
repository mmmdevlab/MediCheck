import { useState } from 'react';
import PropTypes from 'prop-types';
import { X, Mail } from 'lucide-react';

const AddCaregiverForm = ({ onSubmit, onCancel, userName }) => {
  const [activeTab, setActiveTab] = useState('invite');
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    relationshipType: 'family',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateEmail = () => {
    const email = (formData.email ?? '').trim();
    if (!email) {
      setErrors({ email: 'Email is required' });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: 'Invalid email format' });
      return false;
    }
    if (email.length > 255) {
      setErrors({ email: 'Email is too long' });
      return false;
    }
    return true;
  };

  const validateManualAdd = () => {
    const email = (formData.email ?? '').trim();
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    } else if (email.length > 255) {
      newErrors.email = 'Email is too long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInviteByEmail = () => {
    if (!validateEmail()) return;

    const subject = encodeURIComponent('Join me on MediCheck');
    const body = encodeURIComponent(
      `Hi,\n\nI'd like to add you as my caregiver on MediCheck.\n\nPlease sign up at: ${window.location.origin}/auth/signup\n\nAfter signing up, I'll connect you to my account.\n\nBest regards,\n${userName || 'Your patient'}`
    );

    window.location.href = `mailto:${(formData.email ?? '').trim()}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateManualAdd()) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        email: formData.email.trim(),
        fullName: formData.fullName.trim(),
        relationshipType: formData.relationshipType,
      });
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        'Failed to add caregiver. Please try again.';
      setErrors({ submit: message });
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
              ADD CAREGIVER
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mt-1">
              Build your care circle
            </h2>
          </div>

          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-8">
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-full">
            <button
              onClick={() => setActiveTab('invite')}
              className={`
                flex-1 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wide transition-all
                ${activeTab === 'invite' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}
              `}
            >
              Invite by Email
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`
                flex-1 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wide transition-all
                ${activeTab === 'add' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}
              `}
            >
              Add Manually
            </button>
          </div>

          {activeTab === 'invite' ? (
            <div className="space-y-6">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">
                      Send Email Invitation
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Send an email invitation to your caregiver.
                      <br />
                      They'll receive a link to sign up and connect with you.
                    </p>

                    <div className="mb-4">
                      <label className="block text-xs uppercase tracking-widest font-bold text-gray-900 mb-2">
                        EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="caregiver@example.com"
                        className={`
                          w-full px-6 py-3 rounded-full
                          bg-white border-1
                          ${errors.email ? 'border-red-500' : 'border-blue-300'}
                          focus:border-blue-600
                          transition-all outline-none
                          text-gray-900 placeholder-gray-400
                        `}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleInviteByEmail}
                      className="
                        w-full px-6 py-3 rounded-full
                        bg-blue-500 hover:bg-blue-600
                        text-white font-bold uppercase tracking-wide text-sm
                        transition-colors
                      "
                    >
                      Send Invitation
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-center text-sm text-gray-500">
                <p>
                  Your caregiver will need to sign up for MediCheck first.
                  <br />
                  If they have a profile, you can add them manually using their
                  information.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-gray-900 mb-3">
                  FULL NAME
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`
                    w-full px-6 py-4 rounded-full
                    bg-gray-100 border-2
                    ${errors.fullName ? 'border-red-500' : 'border-transparent'}
                    focus:border-blue-500 focus:bg-white
                    transition-all outline-none
                    text-gray-900 placeholder-gray-400
                  `}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-2">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-gray-900 mb-3">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="caregiver@example.com"
                  className={`
                    w-full px-6 py-4 rounded-full
                    bg-gray-100 border-2
                    ${errors.email ? 'border-red-500' : 'border-transparent'}
                    focus:border-blue-500 focus:bg-white
                    transition-all outline-none
                    text-gray-900 placeholder-gray-400
                  `}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-gray-900 mb-3">
                  RELATIONSHIP
                </label>
                <select
                  name="relationshipType"
                  value={formData.relationshipType}
                  onChange={handleChange}
                  className="
                    w-full px-6 py-4 rounded-full
                    bg-gray-100 border-2 border-transparent
                    focus:border-blue-500 focus:bg-white
                    transition-all outline-none
                    text-gray-900
                  "
                >
                  <option value="family">Family Member</option>
                  <option value="friend">Friend</option>
                  <option value="professional">Professional Caregiver</option>
                </select>
              </div>

              {errors.submit && (
                <div className="bg-red-50 border-2 border-red-500 rounded-3xl p-4">
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
                  {isSubmitting ? 'ADDING...' : 'ADD CAREGIVER'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

AddCaregiverForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  userName: PropTypes.string,
};

export default AddCaregiverForm;

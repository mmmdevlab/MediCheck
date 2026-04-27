import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const signupSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'Password must be 8+ characters')
    .regex(/[A-Z]/, 'Need uppercase letter')
    .regex(/[0-9]/, 'Need number'),
  full_name: z.string().min(2, 'Name required'),
  role: z.enum(['patient', 'caregiver']),
  phone: z.string().optional(),
});

const SignupForm = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: 'patient' },
  });

  const onSubmit = async (data) => {
    try {
      await signup(data);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input {...register('email')} placeholder="Email" />
        {errors.email?.message && (
          <p className="text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <input
          {...register('password')}
          type="password"
          placeholder="Password"
        />
        {errors.password?.message && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div>
        <input {...register('full_name')} placeholder="Full Name" />
        {errors.full_name?.message && (
          <p className="text-red-500">{errors.full_name.message}</p>
        )}
      </div>

      <select {...register('role')}>
        <option value="patient">Patient</option>
        <option value="caregiver">Caregiver</option>
      </select>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default SignupForm;

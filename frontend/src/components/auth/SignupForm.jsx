import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import FormInput from '../UI/FormInput';
import FormSelect from '../UI/FormSelect';
import ActionButton from '../UI/ActionButton';

const signupSchema = z
  .object({
    full_name: z.string().min(2, 'Name required'),
    email: z.string().email('Invalid email'),
    password: z
      .string()
      .min(8, 'Password must be 8+ characters')
      .regex(/[A-Z]/, 'Need uppercase letter')
      .regex(/[0-9]/, 'Need number'),
    re_password: z.string(),
    role: z.enum(['patient', 'caregiver']),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.re_password, {
    message: "Passwords don't match",
    path: ['re_password'],
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
      const { re_password, ...signupData } = data;
      await signup(signupData);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        label="Full Name"
        placeholder="jenny lim"
        register={register('full_name')}
        error={errors.full_name?.message}
        required
      />

      <FormInput
        label="Email"
        type="email"
        placeholder="jenny.lim@email.com"
        register={register('email')}
        error={errors.email?.message}
        required
      />

      <FormInput
        label="Password"
        type="password"
        placeholder="***************"
        register={register('password')}
        error={errors.password?.message}
        required
      />

      <FormInput
        label="Re-type Password"
        type="password"
        placeholder="***************"
        register={register('re_password')}
        error={errors.re_password?.message}
        required
      />

      <FormSelect
        label="Role"
        options={[
          { value: 'patient', label: 'Patient' },
          { value: 'caregiver', label: 'Caregiver' },
        ]}
        register={register('role')}
        error={errors.role?.message}
      />

      <FormInput
        label="Phone (Optional)"
        type="tel"
        placeholder="+65 555 0101"
        register={register('phone')}
        error={errors.phone?.message}
      />

      <ActionButton
        type="submit"
        variant="primary"
        disabled={isSubmitting}
        className="w-full py-3"
      >
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </ActionButton>
    </form>
  );
};

export default SignupForm;

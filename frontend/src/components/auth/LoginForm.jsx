import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import FormInput from '../UI/FormInput';
import ActionButton from '../UI/ActionButton';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        label="Email"
        type="email"
        placeholder="JohnSmith@gmail.com"
        register={register('email')}
        error={errors.email?.message}
      />

      <FormInput
        label="Password"
        type="password"
        placeholder="***************"
        register={register('password')}
        error={errors.password?.message}
      />

      <ActionButton
        type="submit"
        variant="primary"
        disabled={isSubmitting}
        className="w-full py-3"
      >
        {isSubmitting ? 'Logging in...' : 'Login'}
      </ActionButton>
    </form>
  );
};

export default LoginForm;

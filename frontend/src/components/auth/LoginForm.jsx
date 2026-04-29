import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
      <div>
        <input {...register('email')} placeholder="Email" type="email" />
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

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  );
};

export default LoginForm;

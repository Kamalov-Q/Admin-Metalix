import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/stores/auth-store';
import { Loader2 } from 'lucide-react';
import type { LoginDto } from '@/types/auth';

export default function LoginPage() {
    const navigate = useNavigate();
    const { setUser, setTokens } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginDto>();

    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            setUser(data.user);
            setTokens(data.accessToken, data.refreshToken);
            toast.success('Successfully logged in!');
            console.log(data, 'Auth data');
            navigate('/', { replace: true });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Login failed. Please try again.');
        },
        onSettled: () => {
            setIsLoading(false);
        },
    });

    const onSubmit = (data: LoginDto) => {
        setIsLoading(true);
        loginMutation.mutate(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-2xl font-bold text-primary-foreground">M</span>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
                    <CardDescription className="text-center">
                        Sign in to your Metalix Admin account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@metalix.com"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address',
                                    },
                                })}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters',
                                    },
                                })}
                            />
                            {errors.password && (
                                <p className="text-sm text-destructive">{errors.password.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        <p>Demo Credentials:</p>
                        <p className="mt-1">kamalov@gmail.com / kamalov1029</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
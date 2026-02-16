import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { categoriesApi } from '@/api/categories';
import { productsApi } from '@/api/products';
import { requestsApi } from '@/api/requests';
import { reviewsApi } from '@/api/reviews';
import { careersApi } from '@/api/career';
import { newsApi } from '@/api/news';
import { Package, FolderTree, Newspaper, MessageSquare, Star, Briefcase } from 'lucide-react';

export default function DashboardPage() {
    const { data: categories } = useQuery({
        queryKey: ['categories', 'en', { page: 1, limit: 100 }],
        queryFn: () => categoriesApi.getAll({ page: 1, limit: 100 }),
    });

    const { data: products } = useQuery({
        queryKey: ['products', 'en', { page: 1, limit: 100 }],
        queryFn: () => productsApi.getAll({ page: 1, limit: 100 }),
    });

    const { data: requests } = useQuery({
        queryKey: ['requests'],
        queryFn: requestsApi.getAll,
    });

    const { data: reviews } = useQuery({
        queryKey: ['reviews'],
        queryFn: reviewsApi.getAll,
    });

    const { data: careers } = useQuery({
        queryKey: ['careers'],
        queryFn: careersApi.getAll,
    });

    const { data: news } = useQuery({
        queryKey: ['news', 'en'],
        queryFn: () => newsApi.getAll('en'),
    });

    const stats = [
        {
            name: 'Categories',
            value: categories?.meta.total || 0,
            icon: FolderTree,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            name: 'Products',
            value: products?.meta.total || 0,
            icon: Package,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            name: 'News Articles',
            value: news?.length || 0,
            icon: Newspaper,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            name: 'Pending Requests',
            value: requests?.filter((r) => r.status === 'PENDING').length || 0,
            icon: MessageSquare,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
        {
            name: 'Pending Reviews',
            value: reviews?.filter((r) => r.status === 'PENDING').length || 0,
            icon: Star,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
        },
        {
            name: 'Career Applications',
            value: careers?.length || 0,
            icon: Briefcase,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your admin panel</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => (
                    <Card key={stat.name}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                            <div className={`${stat.bgColor} p-2 rounded-lg`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {requests?.slice(0, 5).map((request) => (
                                <div
                                    key={request.id}
                                    className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                                >
                                    <div>
                                        <p className="text-sm font-medium">{request.fullName}</p>
                                        <p className="text-xs text-muted-foreground">{request.email}</p>
                                    </div>
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full ${request.status === 'PENDING'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : request.status === 'COMPLETED'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        {request.status}
                                    </span>
                                </div>
                            ))}
                            {!requests?.length && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    No requests yet
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {reviews?.slice(0, 5).map((review) => (
                                <div
                                    key={review.id}
                                    className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                                >
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{review.fullName}</p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {review.comment}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium">{review.rating}★</span>
                                    </div>
                                </div>
                            ))}
                            {!reviews?.length && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    No reviews yet
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
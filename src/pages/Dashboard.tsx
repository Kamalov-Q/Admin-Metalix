import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { categoriesApi } from '@/api/categories';
import { productsApi } from '@/api/products';
import { requestsApi } from '@/api/requests';
import { reviewsApi } from '@/api/reviews';
import { careersApi } from '@/api/career';
import { newsApi } from '@/api/news';
import { Package, FolderTree, Newspaper, MessageSquare, Star, Briefcase } from 'lucide-react';

const requestStatusVariants: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    PROCESSING: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
};

const reviewStatusVariants: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
};

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center space-x-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`h-3 w-3 ${star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-muted text-muted-foreground'
                        }`}
                />
            ))}
        </div>
    );
}

export default function DashboardPage() {
    const { data: categories } = useQuery({
        queryKey: ['categories', { page: 1, limit: 1 }],
        queryFn: () => categoriesApi.getAll({ page: 1, limit: 1 }),
    });

    const { data: products } = useQuery({
        queryKey: ['products', { page: 1, limit: 1 }],
        queryFn: () => productsApi.getAll({ page: 1, limit: 1 }),
    });

    const { data: requests } = useQuery({
        queryKey: ['requests', { page: 1, limit: 100 }],
        queryFn: () => requestsApi.getAll({ page: 1, limit: 100 }),
    });

    const { data: reviews } = useQuery({
        queryKey: ['reviews', { page: 1, limit: 100 }],
        queryFn: () => reviewsApi.getAll({ page: 1, limit: 100 }),
    });

    const { data: careers } = useQuery({
        queryKey: ['careers'],
        queryFn: careersApi.getAll,
    });

    const { data: news } = useQuery({
        queryKey: ['news', { page: 1, limit: 1 }],
        queryFn: () => newsApi.getAll({ page: 1, limit: 1 }),
    });

    const pendingRequests = requests?.data?.filter((r) => r.status === 'PENDING').length || 0;
    const pendingReviews = reviews?.data?.filter((r) => r.status === 'PENDING').length || 0;

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
            value: news?.meta.total || 0,
            icon: Newspaper,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            name: 'Pending Requests',
            value: pendingRequests,
            icon: MessageSquare,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
        {
            name: 'Pending Reviews',
            value: pendingReviews,
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

    const recentRequests = requests?.data?.slice(0, 5) || [];
    const recentReviews = reviews?.data?.slice(0, 5) || [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your admin panel</p>
            </div>

            {/* Stats Grid */}
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

            {/* Recent Activity */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Recent Requests */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentRequests.length > 0 ? (
                                recentRequests.map((request) => (
                                    <div
                                        key={request.id}
                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors"
                                    >
                                        <div className="flex items-center space-x-3 min-w-0">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <span className="text-xs font-medium text-primary">
                                                    {request.fullName.trim().charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {request.fullName}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {request.phoneNumber}
                                                </p>
                                            </div>
                                        </div>
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 font-medium ${requestStatusVariants[request.status] ||
                                                'bg-gray-100 text-gray-700'
                                                }`}
                                        >
                                            {request.status}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    No requests yet
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Reviews */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentReviews.length > 0 ? (
                                recentReviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors"
                                    >
                                        <div className="flex items-center space-x-3 min-w-0">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <span className="text-xs font-medium text-primary">
                                                    {review.fullName.trim().charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {review.fullName}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                                                    {review.description}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end space-y-1 flex-shrink-0 ml-2">
                                            <StarRating rating={review.rating} />
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${reviewStatusVariants[review.status] ||
                                                    'bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                {review.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi, type ReviewFilterDto } from '@/api/reviews';
import type { UpdateReviewStatusDto } from '@/types/reviews';
import { toast } from 'sonner';

export function useReviews(filters?: ReviewFilterDto) {
    return useQuery({
        queryKey: ['reviews', filters],
        queryFn: () => reviewsApi.getAll(filters),
    });
}

export function useReview(id: string, enabled: boolean = true) {
    return useQuery({
        queryKey: ['reviews', id],
        queryFn: () => reviewsApi.getOne(id),
        enabled,
    });
}

export function useUpdateReviewStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateReviewStatusDto }) =>
            reviewsApi.updateStatus(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
            toast.success('Review status updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update review status');
        },
    });
}
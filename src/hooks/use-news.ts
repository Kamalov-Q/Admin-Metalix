import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsApi, type NewsFilterDto } from '@/api/news';
import type { UpdateNewsDto } from '@/types/news';
import { toast } from 'sonner';

export function useNews(filters?: NewsFilterDto) {
    return useQuery({
        queryKey: ['news', filters],
        queryFn: () => newsApi.getAll(filters),
    });
}

export function useNewsItem(id: string, enabled: boolean = true) {
    return useQuery({
        queryKey: ['news', id],
        queryFn: () => newsApi.getOne(id),
        enabled,
    });
}

export function useCreateNews() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: newsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['news'] });
            toast.success('News article created successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create news article');
        },
    });
}

export function useUpdateNews() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateNewsDto }) =>
            newsApi.update(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['news'] });
            queryClient.refetchQueries({ queryKey: ['news'] });
            toast.success('News article updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update news article');
        },
    });
}

export function useDeleteNews() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: newsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['news'] });
            toast.success('News article deleted successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete news article');
        },
    });
}
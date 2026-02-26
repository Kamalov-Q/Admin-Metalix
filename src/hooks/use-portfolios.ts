import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdatePortfolioDto } from '@/types/portfolio';
import { toast } from 'sonner';
import { portfoliosApi, type PortfolioFilterDto } from '@/api/portfolio';

export function usePortfolios(
    filters?: PortfolioFilterDto,
    options?: { enabled?: boolean }
) {
    return useQuery({
        queryKey: ['portfolios', filters],
        queryFn: () => portfoliosApi.getAll(filters),
        enabled: options?.enabled,
    });
}


export function usePortfoliosByProject(
    projectId: string,
    filters?: PortfolioFilterDto,
    options?: { enabled?: boolean }
) {
    return useQuery({
        queryKey: ['portfolios', 'project', projectId, filters],
        queryFn: () => portfoliosApi.getByProject(projectId, filters),
        enabled: options?.enabled !== false && !!projectId,
    });
}

export function usePortfolio(id: string) {
    return useQuery({
        queryKey: ['portfolios', id],
        queryFn: () => portfoliosApi.getOne(id),
        enabled: !!id,
    });
}

export function useCreatePortfolio() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: portfoliosApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['portfolios'] });
            toast.success('Portfolio created successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create portfolio');
        },
    });
}

export function useUpdatePortfolio() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdatePortfolioDto }) =>
            portfoliosApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['portfolios'] });
            toast.success('Portfolio updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update portfolio');
        },
    });
}

export function useDeletePortfolio() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: portfoliosApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['portfolios'] });
            toast.success('Portfolio deleted successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete portfolio');
        },
    });
}
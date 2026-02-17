import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestsApi, type RequestFilterDto } from '@/api/requests';
import type { UpdateRequestStatusDto } from '@/types/requests';
import { toast } from 'sonner';

export function useRequests(filters?: RequestFilterDto) {
    return useQuery({
        queryKey: ['requests', filters],
        queryFn: () => requestsApi.getAll(filters),
    });
}

export function useRequest(id: string, enabled: boolean = true) {
    return useQuery({
        queryKey: ['requests', id],
        queryFn: () => requestsApi.getOne(id),
        enabled,
    });
}

export function useUpdateRequestStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateRequestStatusDto }) =>
            requestsApi.updateStatus(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['requests'] });
            toast.success('Request status updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update request status');
        },
    });
}
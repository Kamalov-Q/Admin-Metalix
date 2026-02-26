import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateProjectDto } from '@/types/project';
import { toast } from 'sonner';
import { projectsApi, type ProjectFilterDto } from '@/api/project';

export function useProjects(filters?: ProjectFilterDto) {
    return useQuery({
        queryKey: ['projects', filters],
        queryFn: () => projectsApi.getAll(filters),
    });
}

export function useProject(id: string) {
    return useQuery({
        queryKey: ['projects', id],
        queryFn: () => projectsApi.getOne(id),
        enabled: !!id,
    });
}

export function useCreateProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: projectsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success('Project created successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create project');
        },
    });
}

export function useUpdateProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateProjectDto }) =>
            projectsApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success('Project updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update project');
        },
    });
}

export function useDeleteProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: projectsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success('Project deleted successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete project');
        },
    });
}
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/api/products';
import { toast } from 'sonner';
import type { FilterProductDto, UpdateProductDto } from '@/types/products';

export function useProducts(filters?: FilterProductDto, options?: { enabled: boolean }) {
    return useQuery({
        queryKey: ['products', filters],
        queryFn: () => productsApi.getAll(filters),
        enabled: options?.enabled
    });
}

export function useProduct(id: string) {
    return useQuery({
        queryKey: ['products', id],
        queryFn: () => productsApi.getOne(id),
    });
}

export function useProductsByCategory(
    categoryId: string
) {
    return useQuery({
        queryKey: ['products', 'category', categoryId],
        queryFn: () => productsApi.getByCategory(categoryId),
    });
}

export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: productsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product created successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create product');
        },
    });
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
            productsApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.refetchQueries({ queryKey: ['products'] });
            toast.success('Product updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update product');
        },
    });
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: productsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product deleted successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete product');
        },
    });
}
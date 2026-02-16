import { careersApi } from "@/api/career";
import { useQuery } from "@tanstack/react-query";

export function useCareers() {
    return useQuery({
        queryKey: ['careers'],
        queryFn: careersApi.getAll,
    });
}

export function useCareer(id: string, enabled: boolean) {
    return useQuery({
        queryKey: ['careers', id],
        queryFn: () => careersApi.getOne(id),
        enabled,
    })
}
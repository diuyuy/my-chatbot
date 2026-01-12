import { deleteResourceById } from "@/client-services/rag.api";
import { QUERY_KEYS } from "@/constants/query-keys";
import { ROUTER_PATH } from "@/constants/router-path";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useDeleteResourceMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (resourceId: string) => deleteResourceById(resourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.getRagQueryKeys(),
      });
      router.replace(ROUTER_PATH.WORKSPACE);
      toast.success("리소스가 성공적으로 삭제되었습니다.");
    },
    onError: (error: Error) => {
      toast.error(`리소스 삭제에 실패했습니다: ${error.message}`);
    },
  });
}

import { deleteChunkById } from "@/client-services/rag.api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useDeleteChunkMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: (chunkId: string) => deleteChunkById(chunkId),
    onSuccess: () => {
      router.refresh();
      toast.success("임베딩이 성공적으로 삭제되었습니다.");
    },
    onError: (error: Error) => {
      toast.error(`임베딩 삭제에 실패했습니다: ${error.message}`);
    },
  });
}

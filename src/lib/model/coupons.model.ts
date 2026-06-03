export interface CouponsInfo {
        id: string;
        status: number;
        code: string;
        type: string;
        discount: number;
        max_uses: number;
        infinity_uses: number;
        once_per_session: number;
        once_per_client: number;
        uses: number;
        valid_from: string;
        valid_until: string;
    }

export interface CouponsResponse {
  success: boolean;
  data: CouponsInfo[];
  error: string | null;
}
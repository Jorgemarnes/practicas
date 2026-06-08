export interface Sessions {
        id: string;
        url_youtube: string;
        url: string;
        type: string;
    }

export interface SessionsResponse {
  success: boolean;
  data: Sessions[];
  error: string | null;
}
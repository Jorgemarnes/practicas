export interface RoomConfig {
        map_room: string;
        amount: number;
        label: string;
        map_info: string;
    }

export interface RoomConfigResponse {
  success: boolean;
  data: RoomConfig[];
  error: string | null;
}
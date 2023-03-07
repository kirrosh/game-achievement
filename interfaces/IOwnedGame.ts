import type { IGameSchema } from './IGameSchema';
import type { IPlayerStats } from './IPlayerStats';

export type IOwnedGame = {
	appid: number;
	playtime_forever: number;
	playtime_windows_forever: number;
	playtime_mac_forever: number;
	playtime_linux_forever: number;
	rtime_last_played: number;
	playesStats?: IPlayerStats;
	schema?: IGameSchema;
	card_image?: string;
	hero_image?: string;
	header_image?: string;
	achivements?: {
		apiname: string;
		achieved: 0 | 1;
		unlocktime: number;
	}[];
};

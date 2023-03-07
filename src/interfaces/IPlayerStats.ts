export type IPlayerStats = {
	steamID: string;
	gameName: string;
	achievements: {
		name: string;
		achieved: number;
	}[];
	stats: {
		name: string;
		value: number;
	}[];
};

export type IAchievementsPlayerStats = {
	steamID: string;
	gameName: string;
	achievements: {
		apiname: string;
		achieved: 0 | 1;
		unlocktime: number;
	}[];
	success: boolean;
};

export type IGameSchema = {
  gameName: string;
  gameVersion: string;
  availableGameStats: {
    achievements: {
      name: string;
      defaultvalue: number;
      displayName: string;
      hidden: 0 | 1;
      description: string;
      icon: string;
      icongray: string;
    }[];
  };
  stats: {
    name: string;
    defaultvalue: number;
    displayName: string;
  }[];
};

export type IAchevement = {
  name: string;
  defaultvalue: number;
  displayName: string;
  hidden: 0 | 1;
  description: string;
  icon: string;
  icongray: string;
};

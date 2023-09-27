import DepthKeys from './consts/DepthKeys';
import TilemapKeys from './consts/TilemapKeys';
import TilesetKeys from './consts/TilesetKeys';
import TilesetNames from './consts/TilesetNames';

export interface MapConfig {
  name: TilemapKeys;
  tilemapFile: string;
  isAnimated?: boolean;
  tilesets: TilesetConfig[];
  tilemapLayers: TilemapLayerConfig[];
}

export interface TilesetConfig {
  key: TilesetKeys;
  name: TilesetNames;
  file: string;
  tileWidth?: number;
  tileHeight?: number;
  tileMargin?: number;
  tileSpacing?: number;
}

export interface TilemapLayerConfig {
  id: string;
  tilesetNames?: TilesetNames[];
  group?: TilemapLayerConfig[];
  depth?: DepthKeys;
}

export const mapsConfig: MapConfig[] = [
  {
    name: TilemapKeys.IslandsTilemap,
    tilemapFile: 'tilemaps/islands-01.json',
    isAnimated: true,
    tilesets: [
      {
        key: TilesetKeys.BeachTiles,
        name: TilesetNames.BeachTiles,
        file: 'tiles/tf_beach_tileB.png',
        tileWidth: 32,
        tileHeight: 32,
        tileMargin: 0,
        tileSpacing: 0,
      },
      {
        key: TilesetKeys.BeachShoreTiles,
        name: TilesetNames.BeachShoreTiles,
        file: 'tiles/tf_beach_tileA1.png',
        tileWidth: 32,
        tileHeight: 32,
        tileMargin: 0,
        tileSpacing: 0,
      },
    ],
    tilemapLayers: [
      {
        id: 'Ocean',
        tilesetNames: [TilesetNames.BeachShoreTiles],
      },
      {
        id: 'Group 1',
        group: [
          {
            id: 'Island 1/Main Island',
            tilesetNames: [
              TilesetNames.BeachTiles,
              TilesetNames.BeachShoreTiles,
            ],
          },
          {
            id: 'Island 1/Voting Islands',
            tilesetNames: [
              TilesetNames.BeachTiles,
              TilesetNames.BeachShoreTiles,
            ],
          },
          {
            id: 'Island 2/Island',
            tilesetNames: [
              TilesetNames.BeachTiles,
              TilesetNames.BeachShoreTiles,
            ],
          },
          {
            id: 'Island 2/Paths',
            tilesetNames: [TilesetNames.BeachTiles],
          },
          {
            id: 'Island 1/Paths',
            tilesetNames: [TilesetNames.BeachTiles],
          },
          {
            id: 'Island 1/Vegetation bottom',
            tilesetNames: [TilesetNames.BeachTiles],
          },
          {
            id: 'Island 2/Vegetation bottom',
            tilesetNames: [TilesetNames.BeachTiles],
          },
        ],
      },
      {
        id: 'Island 1/Vegetation top',
        tilesetNames: [TilesetNames.BeachTiles],
        depth: DepthKeys.VEGETATION_TOP,
      },
      {
        id: 'Island 2/Vegetation top',
        tilesetNames: [TilesetNames.BeachTiles],
        depth: DepthKeys.VEGETATION_TOP,
      },
    ],
  },
];

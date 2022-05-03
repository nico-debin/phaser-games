import Phaser from 'phaser'

// Check if game is running in debug mode
export const debugMode = (scene): boolean => {
	return scene.game.config.physics.arcade?.debug || false
}

// Debug tiles with 'collides' property
export const debugDraw = (layer: Phaser.Tilemaps.TilemapLayer, scene: Phaser.Scene): void => {
	if (debugMode(scene) === false) return;
	const debugGraphics = scene.add.graphics().setAlpha(0.7)
	layer.renderDebug(debugGraphics, {
		tileColor: null,
		collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
		faceColor: new Phaser.Display.Color(40, 39, 37, 255)
	})
}

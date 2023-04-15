var phaserApp = (function() {
    var config = {
        parent: 'id_PhaserContainer',
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        backgroundColor: '#4488aa',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 }
            }
        }
    };

    return {
        newApp: function(preload, create, update) {
            config.scene = {
                preload: preload,
                create: create,
                update: update
            }
            return new Phaser.Game(config);
        }
    }
})();
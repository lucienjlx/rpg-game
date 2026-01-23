// Level System Configuration and Utilities

const LevelSystem = {
    // XP calculation
    calculateXPForLevel(level) {
        return Math.floor(100 * Math.pow(1.5, level - 1));
    },

    // Calculate total XP needed to reach a level
    calculateTotalXPForLevel(level) {
        let total = 0;
        for (let i = 1; i < level; i++) {
            total += this.calculateXPForLevel(i);
        }
        return total;
    },

    // Get level from total XP
    getLevelFromXP(totalXP) {
        let level = 1;
        let xpNeeded = 0;

        while (totalXP >= xpNeeded) {
            xpNeeded += this.calculateXPForLevel(level);
            if (totalXP >= xpNeeded) {
                level++;
            }
        }

        return level;
    },

    // Calculate stat increases for a level
    getStatsForLevel(level) {
        return {
            maxHealth: 100 + (level - 1) * 20,
            damage: 20 + (level - 1) * 5,
            attackRange: 3 + Math.floor((level - 1) / 5) * 0.5
        };
    },

    // Calculate monster stats based on player level
    getMonsterStatsForLevel(playerLevel) {
        const baseHealth = 50;
        const baseDamage = 10;
        const baseXP = 25;

        return {
            health: baseHealth + (playerLevel - 1) * 10,
            damage: baseDamage + (playerLevel - 1) * 2,
            xpReward: baseXP + (playerLevel - 1) * 5
        };
    },

    // Format XP display
    formatXP(xp) {
        if (xp >= 1000000) {
            return (xp / 1000000).toFixed(1) + 'M';
        } else if (xp >= 1000) {
            return (xp / 1000).toFixed(1) + 'K';
        }
        return Math.floor(xp).toString();
    },

    // Get level up message
    getLevelUpMessage(level) {
        const messages = [
            'You feel stronger!',
            'Your power grows!',
            'Level Up! You are becoming legendary!',
            'Your skills have improved!',
            'You have reached a new level of power!'
        ];

        return messages[Math.floor(Math.random() * messages.length)];
    },

    // Calculate spawn rate based on player level
    getSpawnRateForLevel(level) {
        const baseRate = 3; // seconds
        const minRate = 1; // minimum spawn rate

        // Spawn faster as player levels up
        const rate = baseRate - (level - 1) * 0.1;
        return Math.max(minRate, rate);
    }
};

// Achievement system (optional enhancement)
const Achievements = {
    achievements: [
        { id: 'first_kill', name: 'First Blood', description: 'Kill your first monster', unlocked: false },
        { id: 'level_5', name: 'Novice Warrior', description: 'Reach level 5', unlocked: false },
        { id: 'level_10', name: 'Veteran Fighter', description: 'Reach level 10', unlocked: false },
        { id: 'kill_10', name: 'Monster Slayer', description: 'Kill 10 monsters', unlocked: false },
        { id: 'kill_50', name: 'Monster Hunter', description: 'Kill 50 monsters', unlocked: false },
        { id: 'kill_100', name: 'Monster Destroyer', description: 'Kill 100 monsters', unlocked: false }
    ],

    checkAchievement(id) {
        const achievement = this.achievements.find(a => a.id === id);
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            this.showAchievement(achievement);
        }
    },

    showAchievement(achievement) {
        showMessage(`Achievement Unlocked: ${achievement.name}`, 3000);
    }
};

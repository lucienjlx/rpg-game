class LootSystem {
    constructor() {
        // Define all loot items
        this.lootItems = {
            // Zone 1 - Green Plains
            'leather_scraps': { name: 'Leather Scraps', rarity: 'common', color: 0xA0522D },
            'iron_ore': { name: 'Iron Ore', rarity: 'uncommon', color: 0x808080 },
            'health_potion_small': { name: 'Small Health Potion', rarity: 'rare', color: 0xFF0000, healing: 40 },

            // Zone 2 - Desert Wastes
            'chitin_plates': { name: 'Chitin Plates', rarity: 'common', color: 0xD2691E },
            'bronze_ore': { name: 'Bronze Ore', rarity: 'uncommon', color: 0xCD7F32 },
            'health_potion_medium': { name: 'Medium Health Potion', rarity: 'rare', color: 0xFF3333, healing: 80 },

            // Zone 3 - Shadow Realm
            'shadow_crystals': { name: 'Shadow Crystals', rarity: 'common', color: 0x4B0082 },
            'mithril_ore': { name: 'Mithril Ore', rarity: 'uncommon', color: 0xE0E0E0 },
            'dark_essence': { name: 'Dark Essence', rarity: 'rare', color: 0x8B008B },

            // Zone 4 - Volcanic Lands
            'obsidian_shards': { name: 'Obsidian Shards', rarity: 'common', color: 0x1C1C1C },
            'steel_ore': { name: 'Steel Ore', rarity: 'uncommon', color: 0xC0C0C0 },
            'fire_essence': { name: 'Fire Essence', rarity: 'rare', color: 0xFF4500 },

            // Zone 5 - Frozen Tundra
            'frost_crystals': { name: 'Frost Crystals', rarity: 'common', color: 0xE0FFFF },
            'platinum_ore': { name: 'Platinum Ore', rarity: 'uncommon', color: 0xE5E4E2 },
            'ice_essence': { name: 'Ice Essence', rarity: 'rare', color: 0x00CED1 },

            // Zone 6 - Corrupted Forest
            'corrupted_wood': { name: 'Corrupted Wood', rarity: 'common', color: 0x556B2F },
            'adamantite_ore': { name: 'Adamantite Ore', rarity: 'uncommon', color: 0xB87333 },
            'nature_essence': { name: 'Nature Essence', rarity: 'rare', color: 0x00FF00 },

            // Zone 7 - Crystal Caverns
            'crystal_shards': { name: 'Crystal Shards', rarity: 'common', color: 0x9370DB },
            'orichalcum_ore': { name: 'Orichalcum Ore', rarity: 'uncommon', color: 0xFFD700 },
            'arcane_essence': { name: 'Arcane Essence', rarity: 'rare', color: 0x8A2BE2 },

            // Zone 8 - Mystic Gardens (NEW)
            'mystic_petals': { name: 'Mystic Petals', rarity: 'common', color: 0xFF69B4 },
            'enchanted_ore': { name: 'Enchanted Ore', rarity: 'uncommon', color: 0xFF1493 },
            'mystic_essence': { name: 'Mystic Essence', rarity: 'rare', color: 0xDA70D6 },

            // Zone 9 - Void Nexus
            'void_fragments': { name: 'Void Fragments', rarity: 'common', color: 0x000033 },
            'celestial_ore': { name: 'Celestial Ore', rarity: 'uncommon', color: 0xFFFFFF },
            'cosmic_essence': { name: 'Cosmic Essence', rarity: 'rare', color: 0x4169E1 }
        };

        // Loot tables by zone
        this.lootTables = {
            1: [
                { id: 'leather_scraps', chance: 0.70 },
                { id: 'iron_ore', chance: 0.25 },
                { id: 'health_potion_small', chance: 0.05 }
            ],
            2: [
                { id: 'chitin_plates', chance: 0.60 },
                { id: 'bronze_ore', chance: 0.30 },
                { id: 'health_potion_medium', chance: 0.10 }
            ],
            3: [
                { id: 'shadow_crystals', chance: 0.40 },
                { id: 'mithril_ore', chance: 0.40 },
                { id: 'dark_essence', chance: 0.20 }
            ],
            4: [
                { id: 'obsidian_shards', chance: 0.50 },
                { id: 'steel_ore', chance: 0.35 },
                { id: 'fire_essence', chance: 0.15 }
            ],
            5: [
                { id: 'frost_crystals', chance: 0.35 },
                { id: 'platinum_ore', chance: 0.45 },
                { id: 'ice_essence', chance: 0.20 }
            ],
            6: [
                { id: 'corrupted_wood', chance: 0.30 },
                { id: 'adamantite_ore', chance: 0.50 },
                { id: 'nature_essence', chance: 0.20 }
            ],
            7: [
                { id: 'crystal_shards', chance: 0.25 },
                { id: 'orichalcum_ore', chance: 0.55 },
                { id: 'arcane_essence', chance: 0.20 }
            ],
            8: [
                { id: 'mystic_petals', chance: 0.30 },
                { id: 'enchanted_ore', chance: 0.50 },
                { id: 'mystic_essence', chance: 0.20 }
            ],
            9: [
                { id: 'void_fragments', chance: 0.20 },
                { id: 'celestial_ore', chance: 0.60 },
                { id: 'cosmic_essence', chance: 0.20 }
            ]
        };
    }

    generateLoot(zoneId, isBoss = false) {
        const lootTable = this.lootTables[zoneId];
        if (!lootTable) return [];

        const drops = [];

        if (isBoss) {
            // Bosses always drop 2-3 items
            const numDrops = 2 + Math.floor(Math.random() * 2);
            for (let i = 0; i < numDrops; i++) {
                const itemId = this.rollLoot(lootTable);
                if (itemId) {
                    drops.push(itemId);
                }
            }
        } else {
            // Regular monsters have 60% chance to drop 1 item
            if (Math.random() < 0.6) {
                const itemId = this.rollLoot(lootTable);
                if (itemId) {
                    drops.push(itemId);
                }
            }
        }

        return drops;
    }

    rollLoot(lootTable) {
        const roll = Math.random();
        let cumulative = 0;

        for (const entry of lootTable) {
            cumulative += entry.chance;
            if (roll <= cumulative) {
                return entry.id;
            }
        }

        return null;
    }

    getLootData(itemId) {
        return this.lootItems[itemId];
    }
}

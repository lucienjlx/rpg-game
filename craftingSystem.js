class CraftingSystem {
    constructor() {
        this.recipes = this.createRecipes();
    }

    createRecipes() {
        return [
            // Tier 1 - Zone 1-2
            {
                id: 'iron_sword',
                name: 'Iron Sword',
                tier: 1,
                category: 'weapon',
                requirements: {
                    'iron_ore': 10,
                    'leather_scraps': 5
                },
                result: {
                    type: 'equipment',
                    slot: 'weapon',
                    stats: { damage: 10 },
                    rarity: 'uncommon'
                }
            },
            {
                id: 'leather_armor',
                name: 'Leather Armor',
                tier: 1,
                category: 'armor',
                requirements: {
                    'leather_scraps': 15
                },
                result: {
                    type: 'equipment',
                    slot: 'armor',
                    stats: { health: 20 },
                    rarity: 'common'
                }
            },
            {
                id: 'bronze_sword',
                name: 'Bronze Sword',
                tier: 2,
                category: 'weapon',
                requirements: {
                    'bronze_ore': 15,
                    'chitin_plates': 8,
                    'iron_sword': 1
                },
                result: {
                    type: 'equipment',
                    slot: 'weapon',
                    stats: { damage: 25 },
                    rarity: 'uncommon'
                }
            },
            {
                id: 'chitin_armor',
                name: 'Chitin Armor',
                tier: 2,
                category: 'armor',
                requirements: {
                    'chitin_plates': 20,
                    'bronze_ore': 5
                },
                result: {
                    type: 'equipment',
                    slot: 'armor',
                    stats: { health: 50 },
                    rarity: 'uncommon'
                }
            },
            // Tier 3 - Zone 3-4
            {
                id: 'steel_sword',
                name: 'Steel Sword',
                tier: 3,
                category: 'weapon',
                requirements: {
                    'steel_ore': 20,
                    'obsidian_shards': 10,
                    'bronze_sword': 1
                },
                result: {
                    type: 'equipment',
                    slot: 'weapon',
                    stats: { damage: 50 },
                    rarity: 'rare'
                }
            },
            {
                id: 'obsidian_armor',
                name: 'Obsidian Armor',
                tier: 3,
                category: 'armor',
                requirements: {
                    'obsidian_shards': 25,
                    'steel_ore': 10,
                    'fire_essence': 3
                },
                result: {
                    type: 'equipment',
                    slot: 'armor',
                    stats: { health: 100 },
                    rarity: 'rare'
                }
            },
            {
                id: 'shadow_blade',
                name: 'Shadow Blade',
                tier: 4,
                category: 'weapon',
                requirements: {
                    'shadow_crystals': 30,
                    'mithril_ore': 15,
                    'dark_essence': 5,
                    'steel_sword': 1
                },
                result: {
                    type: 'equipment',
                    slot: 'weapon',
                    stats: { damage: 100 },
                    rarity: 'epic'
                }
            },
            {
                id: 'shadow_core',
                name: 'Shadow Core',
                tier: 4,
                category: 'material',
                requirements: {
                    'dark_essence': 5
                },
                result: {
                    type: 'material',
                    rarity: 'rare'
                }
            },
            {
                id: 'shadow_blade_e',
                name: 'Shadow Blade E',
                tier: 5,
                category: 'weapon',
                requirements: {
                    'shadow_blade': 1,
                    'shadow_core': 1
                },
                result: {
                    type: 'equipment',
                    slot: 'weapon',
                    stats: { damage: 130 },
                    rarity: 'epic'
                }
            },
            {
                id: 'frostforged_blade',
                name: 'Frostforged Blade',
                tier: 6,
                category: 'weapon',
                requirements: {
                    'frost_crystals': 25,
                    'platinum_ore': 15,
                    'ice_essence': 6,
                    'frost_relic': 1,
                    'shadow_blade_e': 1
                },
                result: {
                    type: 'equipment',
                    slot: 'weapon',
                    stats: { damage: 170 },
                    rarity: 'epic'
                }
            },
            {
                id: 'verdant_reaver',
                name: 'Verdant Reaver',
                tier: 7,
                category: 'weapon',
                requirements: {
                    'corrupted_wood': 30,
                    'adamantite_ore': 18,
                    'nature_essence': 7,
                    'blight_seed': 1,
                    'frostforged_blade': 1
                },
                result: {
                    type: 'equipment',
                    slot: 'weapon',
                    stats: { damage: 220 },
                    rarity: 'epic'
                }
            },
            {
                id: 'crystal_arcblade',
                name: 'Crystal Arcblade',
                tier: 8,
                category: 'weapon',
                requirements: {
                    'crystal_shards': 35,
                    'orichalcum_ore': 20,
                    'arcane_essence': 8,
                    'crystal_prism': 1,
                    'verdant_reaver': 1
                },
                result: {
                    type: 'equipment',
                    slot: 'weapon',
                    stats: { damage: 280 },
                    rarity: 'epic'
                }
            },
            {
                id: 'shadow_armor',
                name: 'Shadow Armor',
                tier: 4,
                category: 'armor',
                requirements: {
                    'shadow_crystals': 40,
                    'mithril_ore': 20,
                    'dark_essence': 8
                },
                result: {
                    type: 'equipment',
                    slot: 'armor',
                    stats: { health: 200 },
                    rarity: 'epic'
                }
            },
            // Consumables
            {
                id: 'health_potion_large',
                name: 'Large Health Potion',
                tier: 2,
                category: 'consumable',
                requirements: {
                    'health_potion_medium': 3,
                    'fire_essence': 1
                },
                result: {
                    type: 'consumable',
                    healing: 150,
                    rarity: 'rare'
                }
            }
        ];
    }

    canCraft(recipeId, inventory) {
        const recipe = this.recipes.find(r => r.id === recipeId);
        if (!recipe) return false;

        // Check if player has all required materials
        for (const [itemId, requiredAmount] of Object.entries(recipe.requirements)) {
            if (!inventory.hasItem(itemId, requiredAmount)) {
                return false;
            }
        }

        return true;
    }

    craft(recipeId, inventory) {
        const recipe = this.recipes.find(r => r.id === recipeId);
        if (!recipe || !this.canCraft(recipeId, inventory)) {
            return null;
        }

        // Remove required materials
        for (const [itemId, requiredAmount] of Object.entries(recipe.requirements)) {
            inventory.removeItem(itemId, requiredAmount);
        }

        // Create the result item
        const resultItem = {
            id: recipe.id,
            name: recipe.name,
            ...recipe.result
        };

        // Add to inventory
        if (recipe.result.type === 'equipment') {
            inventory.addEquipment(resultItem);
        } else if (recipe.result.type === 'material') {
            inventory.addItem(recipe.id, {
                name: recipe.name,
                rarity: recipe.result.rarity
            });
        } else if (recipe.result.type === 'consumable') {
            inventory.addItem(recipe.id, {
                name: recipe.name,
                rarity: recipe.result.rarity,
                healing: recipe.result.healing || 0
            });
        }

        return resultItem;
    }

    getRecipesByCategory(category) {
        return this.recipes.filter(r => r.category === category);
    }

    getAllRecipes() {
        return this.recipes;
    }
}

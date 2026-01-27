class CraftingUI {
    constructor(craftingSystem, inventory, player = null) {
        this.craftingSystem = craftingSystem;
        this.inventory = inventory;
        this.player = player;
        this.isOpen = false;
        this.currentCategory = 'weapon';
        this.currentRecipes = [];
        this.selectedIndex = 0;
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.createUI();
        document.addEventListener('keydown', this.handleKeyDown);
    }

    createUI() {
        // Create crafting panel
        const panel = document.createElement('div');
        panel.id = 'crafting-panel';
        panel.className = 'game-panel';
        panel.style.display = 'none';
        panel.style.left = '50%';
        panel.style.transform = 'translate(-50%, -50%)';
        panel.style.right = 'auto';

        panel.innerHTML = `
            <div class="panel-header">
                <h2>⚒️ Smith's Forge</h2>
                <button class="close-button" id="crafting-close">×</button>
            </div>
            <div class="panel-tabs">
                <button class="tab-button active" data-tab="weapon">Weapons</button>
                <button class="tab-button" data-tab="armor">Armor</button>
                <button class="tab-button" data-tab="consumable">Consumables</button>
            </div>
            <div class="panel-hint">Arrows: select · Enter: craft · Left/Right: tab</div>
            <div class="panel-content" id="crafting-content">
                <!-- Content will be dynamically generated -->
            </div>
        `;

        document.getElementById('ui-overlay').appendChild(panel);

        // Set up event listeners
        document.getElementById('crafting-close').addEventListener('click', () => {
            this.close();
        });

        const tabButtons = panel.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.setCategory(button.dataset.tab);
            });
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        document.getElementById('crafting-panel').style.display = 'block';
        this.selectedIndex = 0;
        this.render();
    }

    close() {
        this.isOpen = false;
        document.getElementById('crafting-panel').style.display = 'none';
    }

    render() {
        const content = document.getElementById('crafting-content');
        content.innerHTML = '';

        const recipes = this.craftingSystem.getRecipesByCategory(this.currentCategory);
        this.currentRecipes = recipes;
        if (this.selectedIndex >= recipes.length) {
            this.selectedIndex = Math.max(0, recipes.length - 1);
        }

        if (recipes.length === 0) {
            content.innerHTML = '<p class="empty-message">No recipes available in this category</p>';
            return;
        }

        recipes.forEach((recipe, index) => {
            const canCraft = this.craftingSystem.canCraft(recipe.id, this.inventory);

            const recipeDiv = document.createElement('div');
            const selectedClass = index === this.selectedIndex ? ' selected' : '';
            recipeDiv.className = `crafting-recipe ${canCraft ? 'can-craft' : 'cannot-craft'}${selectedClass}`;

            let requirementsHTML = '';
            for (const [itemId, amount] of Object.entries(recipe.requirements)) {
                const hasAmount = this.inventory.getItemCount(itemId);
                const hasEnough = hasAmount >= amount;
                const checkmark = hasEnough ? '✓' : '✗';
                const itemName = this.getItemName(itemId);

                requirementsHTML += `
                    <div class="requirement ${hasEnough ? 'has-enough' : 'not-enough'}">
                        <span>${checkmark} ${itemName}</span>
                        <span>${hasAmount}/${amount}</span>
                    </div>
                `;
            }

            const statsHTML = this.getStatsHTML(recipe.result);

            recipeDiv.innerHTML = `
                <div class="recipe-header">
                    <h3 class="rarity-${recipe.result.rarity}">${recipe.name}</h3>
                    <span class="tier-badge">Tier ${recipe.tier}</span>
                </div>
                <div class="recipe-stats">${statsHTML}</div>
                <div class="recipe-requirements">
                    <h4>Requirements:</h4>
                    ${requirementsHTML}
                </div>
                <button class="craft-button" data-recipe="${recipe.id}" ${canCraft ? '' : 'disabled'}>
                    ${canCraft ? 'Craft' : 'Missing Materials'}
                </button>
            `;

            // Add craft button listener
            const craftButton = recipeDiv.querySelector('.craft-button');
            craftButton.addEventListener('click', () => {
                if (canCraft) {
                    this.craftItem(recipe.id);
                }
            });

            content.appendChild(recipeDiv);
        });

        const selected = content.querySelector('.crafting-recipe.selected');
        if (selected) {
            selected.scrollIntoView({ block: 'nearest' });
        }
    }

    setCategory(category) {
        if (this.currentCategory === category) return;
        this.currentCategory = category;
        this.selectedIndex = 0;

        const panel = document.getElementById('crafting-panel');
        if (panel) {
            const tabButtons = panel.querySelectorAll('.tab-button');
            tabButtons.forEach(button => {
                button.classList.toggle('active', button.dataset.tab === category);
            });
        }

        this.render();
    }

    handleKeyDown(e) {
        if (!this.isOpen) return;

        const key = e.key.toLowerCase();
        if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'enter'].includes(key)) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (key === 'arrowup') {
            this.moveSelection(-1);
        } else if (key === 'arrowdown') {
            this.moveSelection(1);
        } else if (key === 'arrowleft') {
            this.cycleCategory(-1);
        } else if (key === 'arrowright') {
            this.cycleCategory(1);
        } else if (key === 'enter') {
            this.craftSelected();
        }
    }

    moveSelection(delta) {
        if (!this.currentRecipes.length) return;
        const next = this.selectedIndex + delta;
        this.selectedIndex = Math.max(0, Math.min(this.currentRecipes.length - 1, next));
        this.render();
    }

    cycleCategory(direction) {
        const categories = ['weapon', 'armor', 'consumable'];
        const currentIndex = categories.indexOf(this.currentCategory);
        const nextIndex = (currentIndex + direction + categories.length) % categories.length;
        this.setCategory(categories[nextIndex]);
    }

    craftSelected() {
        const recipe = this.currentRecipes[this.selectedIndex];
        if (!recipe) return;
        const canCraft = this.craftingSystem.canCraft(recipe.id, this.inventory);
        if (!canCraft) {
            if (game && game.showMessage) {
                game.showMessage('Missing materials.', 1500);
            }
            return;
        }
        this.craftItem(recipe.id);
    }

    getItemName(itemId) {
        // Convert item IDs to readable names
        const names = {
            'leather_scraps': 'Leather Scraps',
            'iron_ore': 'Iron Ore',
            'chitin_plates': 'Chitin Plates',
            'bronze_ore': 'Bronze Ore',
            'obsidian_shards': 'Obsidian Shards',
            'steel_ore': 'Steel Ore',
            'shadow_crystals': 'Shadow Crystals',
            'mithril_ore': 'Mithril Ore',
            'fire_essence': 'Fire Essence',
            'dark_essence': 'Dark Essence',
            'health_potion_small': 'Small Health Potion',
            'health_potion_medium': 'Medium Health Potion',
            'iron_sword': 'Iron Sword',
            'bronze_sword': 'Bronze Sword',
            'steel_sword': 'Steel Sword'
        };
        return names[itemId] || itemId;
    }

    getStatsHTML(result) {
        if (result.stats) {
            let statsText = '';
            if (result.stats.damage) statsText += `+${result.stats.damage} Damage`;
            if (result.stats.health) statsText += `+${result.stats.health} Health`;
            return `<span class="stat-bonus">${statsText}</span>`;
        } else if (result.healing) {
            return `<span class="stat-bonus">Restores ${result.healing} HP</span>`;
        }
        return '';
    }

    craftItem(recipeId) {
        const result = this.craftingSystem.craft(recipeId, this.inventory);

        if (result) {
            if (this.player && result.type === 'equipment') {
                const slot = result.slot;
                const current = this.player.equipmentSlots[slot];
                const currentDamage = current && current.stats ? current.stats.damage || 0 : 0;
                const currentHealth = current && current.stats ? current.stats.health || 0 : 0;
                const newDamage = result.stats ? result.stats.damage || 0 : 0;
                const newHealth = result.stats ? result.stats.health || 0 : 0;

                if (!current || newDamage > currentDamage || newHealth > currentHealth) {
                    this.player.equipItem(result);
                }
            }

            // Show success message
            if (game && game.showMessage) {
                game.showMessage(`Crafted ${result.name}!`, 2000);
            }

            // Re-render to update available recipes
            this.render();
        }
    }
}

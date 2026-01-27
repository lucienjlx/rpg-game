class InventoryUI {
    constructor(inventory, player = null) {
        this.inventory = inventory;
        this.player = player;
        this.isOpen = false;
        this.currentTab = 'materials';
        this.createUI();
    }

    createUI() {
        // Create inventory panel
        const panel = document.createElement('div');
        panel.id = 'inventory-panel';
        panel.className = 'game-panel';
        panel.style.display = 'none';

        panel.innerHTML = `
            <div class="panel-header">
                <h2>Inventory</h2>
                <button class="close-button" id="inventory-close">×</button>
            </div>
            <div class="panel-tabs">
                <button class="tab-button active" data-tab="materials">Materials</button>
                <button class="tab-button" data-tab="consumables">Consumables</button>
                <button class="tab-button" data-tab="equipment">Equipment</button>
            </div>
            <div class="panel-content" id="inventory-content">
                <!-- Content will be dynamically generated -->
            </div>
        `;

        document.getElementById('ui-overlay').appendChild(panel);

        // Set up event listeners
        document.getElementById('inventory-close').addEventListener('click', () => {
            this.close();
        });

        const tabButtons = panel.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.currentTab = button.dataset.tab;
                this.render();
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
        document.getElementById('inventory-panel').style.display = 'block';
        this.render();
    }

    close() {
        this.isOpen = false;
        document.getElementById('inventory-panel').style.display = 'none';
    }

    render() {
        const content = document.getElementById('inventory-content');
        content.innerHTML = '';

        if (this.currentTab === 'materials') {
            this.renderMaterials(content);
        } else if (this.currentTab === 'consumables') {
            this.renderConsumables(content);
        } else if (this.currentTab === 'equipment') {
            this.renderEquipment(content);
        }
    }

    renderMaterials(container) {
        const materials = this.inventory.getMaterials();

        if (materials.length === 0) {
            container.innerHTML = '<p class="empty-message">No materials collected yet</p>';
            return;
        }

        materials.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = `inventory-item rarity-${item.rarity}`;
            itemDiv.innerHTML = `
                <span class="item-name">${item.name}</span>
                <span class="item-count">x${item.count}</span>
            `;
            container.appendChild(itemDiv);
        });
    }

    renderConsumables(container) {
        const consumables = this.inventory.getConsumables();

        if (consumables.length === 0) {
            container.innerHTML = '<p class="empty-message">No consumables collected yet</p>';
            return;
        }

        consumables.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = `inventory-item rarity-${item.rarity}`;
            const healingText = item.healing ? ` (+${item.healing} HP)` : '';
            itemDiv.innerHTML = `
                <span class="item-name">${item.name}${healingText}</span>
                <span class="item-count">x${item.count}</span>
            `;
            container.appendChild(itemDiv);
        });
    }

    renderEquipment(container) {
        const equipment = this.inventory.getEquipment();

        if (equipment.length === 0) {
            container.innerHTML = '<p class="empty-message">No equipment crafted yet</p>';
            return;
        }

        equipment.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = `inventory-item rarity-${item.rarity}`;
            const statParts = [];
            if (item.stats && item.stats.damage) statParts.push(`+${item.stats.damage} DMG`);
            if (item.stats && item.stats.health) statParts.push(`+${item.stats.health} HP`);
            const statText = statParts.join(' ');

            itemDiv.innerHTML = `
                <span class="item-name">${item.name}</span>
                <span class="item-stats">${statText}</span>
            `;

            if (this.player && item.slot) {
                const equipButton = document.createElement('button');
                equipButton.className = 'equip-button';
                equipButton.textContent = item.equipped ? 'Equipped' : 'Equip';
                equipButton.disabled = item.equipped;
                equipButton.addEventListener('click', () => {
                    this.player.equipItem(item);
                    this.render();
                });
                itemDiv.appendChild(equipButton);
            }
            container.appendChild(itemDiv);
        });
    }
}

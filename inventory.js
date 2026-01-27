class Inventory {
    constructor() {
        this.materials = {};
        this.consumables = {};
        this.equipment = [];
        this.onEquipmentRemoved = null;
    }

    addItem(itemId, itemData, quantity = 1) {
        // Determine item type based on name
        if (itemData.name.includes('Potion') || itemData.name.includes('Essence')) {
            // Consumable
            if (this.consumables[itemId]) {
                this.consumables[itemId].count += quantity;
            } else {
                this.consumables[itemId] = {
                    id: itemId,
                    name: itemData.name,
                    rarity: itemData.rarity,
                    count: quantity,
                    healing: itemData.healing || 0
                };
            }
        } else {
            // Material
            if (this.materials[itemId]) {
                this.materials[itemId].count += quantity;
            } else {
                this.materials[itemId] = {
                    id: itemId,
                    name: itemData.name,
                    rarity: itemData.rarity,
                    count: quantity
                };
            }
        }
    }

    addEquipment(equipmentItem) {
        this.equipment.push(equipmentItem);
    }

    removeItem(itemId, quantity = 1) {
        if (this.materials[itemId]) {
            this.materials[itemId].count -= quantity;
            if (this.materials[itemId].count <= 0) {
                delete this.materials[itemId];
            }
            return true;
        }

        if (this.consumables[itemId]) {
            this.consumables[itemId].count -= quantity;
            if (this.consumables[itemId].count <= 0) {
                delete this.consumables[itemId];
            }
            return true;
        }

        if (this.equipment.length) {
            let removed = 0;
            for (let i = this.equipment.length - 1; i >= 0 && removed < quantity; i--) {
                if (this.equipment[i].id === itemId) {
                    const removedItem = this.equipment.splice(i, 1)[0];
                    removed += 1;
                    if (this.onEquipmentRemoved) {
                        this.onEquipmentRemoved(removedItem);
                    }
                }
            }
            return removed === quantity;
        }

        return false;
    }

    hasItem(itemId, quantity = 1) {
        if (this.materials[itemId]) {
            return this.materials[itemId].count >= quantity;
        }

        if (this.consumables[itemId]) {
            return this.consumables[itemId].count >= quantity;
        }

        if (this.equipment.length) {
            const count = this.equipment.reduce((total, item) => {
                if (item.id === itemId) {
                    return total + 1;
                }
                return total;
            }, 0);
            return count >= quantity;
        }

        return false;
    }

    getItemCount(itemId) {
        if (this.materials[itemId]) {
            return this.materials[itemId].count;
        }

        if (this.consumables[itemId]) {
            return this.consumables[itemId].count;
        }

        if (this.equipment.length) {
            return this.equipment.reduce((total, item) => {
                if (item.id === itemId) {
                    return total + 1;
                }
                return total;
            }, 0);
        }

        return 0;
    }

    getMaterials() {
        return Object.values(this.materials);
    }

    getConsumables() {
        return Object.values(this.consumables);
    }

    getEquipment() {
        return this.equipment;
    }

    getBestHealingConsumable() {
        const consumables = this.getConsumables().filter(item => item.healing > 0);
        if (!consumables.length) {
            return null;
        }
        consumables.sort((a, b) => b.healing - a.healing);
        return consumables[0];
    }
}

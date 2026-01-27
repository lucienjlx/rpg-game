class MonsterVariants {
    static getVariantsForZone(zoneId) {
        const variants = {
            1: [ // Green Plains
                { name: 'Goblin', bodyColor: 0x8b0000, headColor: 0x6b0000, hornSize: 0.5 },
                { name: 'Orc', bodyColor: 0x556b2f, headColor: 0x3d5229, hornSize: 0.6 },
                { name: 'Troll', bodyColor: 0x8b7355, headColor: 0x6b5a45, hornSize: 0.7 }
            ],
            2: [ // Desert Wastes
                { name: 'Scorpion Warrior', bodyColor: 0xd2691e, headColor: 0xb8571a, hornSize: 0.5 },
                { name: 'Sand Demon', bodyColor: 0xdaa520, headColor: 0xb8860b, hornSize: 0.6 },
                { name: 'Desert Raider', bodyColor: 0xcd853f, headColor: 0xa0522d, hornSize: 0.7 }
            ],
            3: [ // Shadow Realm
                { name: 'Shadow Stalker', bodyColor: 0x4b0082, headColor: 0x3a0066, hornSize: 0.5 },
                { name: 'Void Walker', bodyColor: 0x2f004f, headColor: 0x1f0033, hornSize: 0.6 },
                { name: 'Dark Knight', bodyColor: 0x191970, headColor: 0x0f0f50, hornSize: 0.7 }
            ],
            4: [ // Volcanic Lands
                { name: 'Fire Imp', bodyColor: 0xff4500, headColor: 0xff6347, hornSize: 0.5 },
                { name: 'Lava Beast', bodyColor: 0xff0000, headColor: 0xdc143c, hornSize: 0.6 },
                { name: 'Magma Golem', bodyColor: 0x8b0000, headColor: 0x660000, hornSize: 0.7 }
            ],
            5: [ // Frozen Tundra
                { name: 'Ice Wraith', bodyColor: 0x00CED1, headColor: 0x00b8bb, hornSize: 0.5 },
                { name: 'Frost Giant', bodyColor: 0x87CEEB, headColor: 0x6fa8dc, hornSize: 0.6 },
                { name: 'Blizzard Fiend', bodyColor: 0xADD8E6, headColor: 0x87CEEB, hornSize: 0.7 }
            ],
            6: [ // Corrupted Forest
                { name: 'Treant', bodyColor: 0x556B2F, headColor: 0x3d5229, hornSize: 0.5 },
                { name: 'Corrupted Ent', bodyColor: 0x2F4F2F, headColor: 0x1f3f1f, hornSize: 0.6 },
                { name: 'Poison Spitter', bodyColor: 0x6B8E23, headColor: 0x556b2f, hornSize: 0.7 }
            ],
            7: [ // Crystal Caverns
                { name: 'Crystal Golem', bodyColor: 0x8A2BE2, headColor: 0x7a1bd2, hornSize: 0.5 },
                { name: 'Gem Guardian', bodyColor: 0x9370DB, headColor: 0x8360cb, hornSize: 0.6 },
                { name: 'Arcane Sentinel', bodyColor: 0xBA55D3, headColor: 0xaa45c3, hornSize: 0.7 }
            ],
            8: [ // Mystic Gardens (NEW)
                { name: 'Enchanted Sprite', bodyColor: 0xFF69B4, headColor: 0xFF1493, hornSize: 0.4 },
                { name: 'Mystic Guardian', bodyColor: 0xDA70D6, headColor: 0xC71585, hornSize: 0.5 },
                { name: 'Arcane Warden', bodyColor: 0xFF1493, headColor: 0xC71585, hornSize: 0.6 }
            ],
            9: [ // Void Nexus
                { name: 'Void Spawn', bodyColor: 0x1C1C1C, headColor: 0x0a0a0a, hornSize: 0.5 },
                { name: 'Cosmic Horror', bodyColor: 0x000033, headColor: 0x000022, hornSize: 0.6 },
                { name: 'Reality Breaker', bodyColor: 0x191970, headColor: 0x0f0f50, hornSize: 0.7 }
            ]
        };

        return variants[zoneId] || variants[1];
    }

    static getRandomVariant(zoneId) {
        const variants = this.getVariantsForZone(zoneId);
        return variants[Math.floor(Math.random() * variants.length)];
    }

    static applyVariantToMonster(monster, variant) {
        if (!monster.mesh || !variant) return;

        // Find body and head meshes and update their colors
        monster.mesh.children.forEach(child => {
            if (child.geometry && child.geometry.type === 'BoxGeometry') {
                // Body
                child.material.color.set(variant.bodyColor);
            } else if (child.geometry && child.geometry.type === 'SphereGeometry') {
                // Head (not eyes)
                if (child.position.y > 1.5 && child.position.y < 2.0) {
                    child.material.color.set(variant.headColor);
                }
            } else if (child.geometry && child.geometry.type === 'ConeGeometry') {
                // Horns - scale based on variant
                child.scale.set(variant.hornSize, variant.hornSize, variant.hornSize);
            }
        });

        monster.variantName = variant.name;
    }
}

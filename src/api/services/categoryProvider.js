const CONTEGORIES = {
    1: 'Alimentos',
    2: 'Roupas/Vestimentas',
    3: 'Higiene pessoal',
    4: 'Brinquedos',
    5: 'Eletrônicos',
    6: 'Eletrodomésticos',
    7: 'Móveis',
    8: 'Material Reciclável',
    9: 'Calçados',
    10: 'Obras de Arte',
    11: 'Utensílios',
    12: 'Material Escolar',
};

class CategoryProvider {
    static getCategory(name) {
        if (!CONTEGORIES[name]) {
            throw new Error(`Category not found`);
        }

        return CONTEGORIES[name];
    }

    static getAllCategories() {
        return CONTEGORIES;
    }
}

module.exports = CategoryProvider;

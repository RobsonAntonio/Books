export default class BooksSchemas {
    static schema = {
        name: 'Book',
        primaryKey: 'id',
        properties: {
            id: { type: 'int', indexed: true },
            nome: 'string',
            preco: 'string'
        }
    }
}
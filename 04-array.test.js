const adicionaItem = require('./04-array')

test(
    'teste de lista', () =>{
        expect(adicionaItem([], 1)).toEqual([1])
    }
)
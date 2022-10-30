var expect = require("chai").expect;
var List   = require("../src/list");

describe("Manipular lista clave-valor", function() {
    var list;

    beforeEach("Crear lista nueva", () => {
        list = new List();
    })

    it("Una nueva lista posee 0 elementos", () => {
        expect(list.count()).to.equal(0);
    })

    it("Si agrego un elemento a una lista nueva, su nuevo tamaño es 1 y su retorno es true", ()  => {
        var rc = list.add("key_1", "value_1");
        expect(rc).to.equal(true);
        
        var nelems = 1;
        expect(list.count()).to.equal(nelems);
    })    

    it("Si agrego dos elemento a una lista nueva, su nuevo tamaño es 2", () => {
        var rc
        
        rc = list.add("key_1", "value_1");
        expect(rc).to.equal(true);
        
        list.add("key_2", "value_2");
        expect(rc).to.equal(true);

        var nelems = 2;
        expect(list.count()).to.equal(nelems);
    })     

    describe("Intentar agregar dos elementos con la misma clave", () => {
        
        it("Caso 1 : Se intenta agregar el ultimo una segunda vez", () => {
            var key = "key_1";
            list.add(key, "value_1");
            var rc = list.add(key, "value_2");
            expect(rc).to.equal(false);
        })
        
        it("Caso 2 : Se intenta agregar el penultimo una segunda vez", () => {
            var key = "key_1";
            list.add(key, "value_1");
            list.add("key_2", "value_2");
            var rc = list.add(key, "value_2");
            expect(rc).to.equal(false);
        })    

        it("Caso 3 : Se intenta agregar el antepenultimo una segunda vez", () => {
            var key = "key_0";
            list.add(key, "value_0");
            list.add("key_1", "value_1");
            list.add("key_2", "value_2");
            var rc = list.add(key, "value_2");
            expect(rc).to.equal(false);
        })        
    })   

    describe("Intentar agregar elemento con clave invalida", () => {
        
        it("Caso 1 : Clave null", () => {
            var rc = list.add(null, "value_2");
            expect(rc).to.equal(false);
        })  

        it("Caso 2 : Clave string vacio", () => {
            var rc = list.add("", "value_2");
            expect(rc).to.equal(false);
        })   

        it("Caso 3 : Clave no es string", () => {
            var rc = list.add(45, "value_2");
            expect(rc).to.equal(false);
        })         
    })

    describe("Intentar agregar elemento con value invalido", () => {
        
        it("Caso 1 : Valor null", () => {
            var rc = list.add("key", null);
            expect(rc).to.equal(false);
        })  
    })    

    describe("Recuperar valores", () => {
        
        it("Caso 1 : Recuperar un elemento de una lista vacia", () => {
            var rc = list.get("key");
            expect(rc).to.equal(null);
        })  

        it("Caso 2 : Agregar elemento a lista vacia y recuperarlo", () => {
            list.add("key", "value");
            var rc = list.get("key");
            expect(rc).to.equal("value");
        })    

        it("Caso 3 : Agregar 3 elementos y recuperar el primero que se agrego", () => {
            var key = "key1";
            var value = "value1";
            list.add(key, value);
            list.add("key2", "value2");
            list.add("key3", "value3");
            var rc = list.get(key);
            expect(rc).to.equal(value);
        })   
        it("Caso 4 : Agregar 3 elementos y recuperar el ultimo que se agrego", () => {
            var key = "key3";
            var value = "value3";
            list.add("key1", "value1");
            list.add("key2", "value2");
            list.add(key, value);
            var rc = list.get(key);
            expect(rc).to.equal(value);
        })    
        it("Caso 5 : Agregar 3 elementos y recuperar el penultimo que se agrego", () => {
            var key = "key2";
            var value = "value2";
            list.add("key1", "value1");
            list.add(key, value);
            list.add("key3", "value3");
            var rc = list.get(key);
            expect(rc).to.equal(value);
        })     
        it("Caso 6 : Agregar 3 elementos y recuperar una clave inexistente", () => {
            list.add("key1", "value1");
            list.add("key2", "value2");
            list.add("key3", "value3");
            var rc = list.get("key4");
            expect(rc).to.equal(null);
        })                               
    })      

    describe("Actualizacion de valores", () => {
        
        beforeEach("Inicializar la lista", () => {
            list.add("key1", "value1");
            list.add("key2", "value2");
            list.add("key3", "value3");
        })

        it("Caso 1 : Actualizar clave inexistente", () => {
            var rc = list.update("key", "new_value");
            expect(rc).to.equal(false);
        })  

        it("Caso 2 : Actualizar primera clave insertada", () => {
            var new_value = "new_value"
            var key = "key1"
            var rc = list.update(key, new_value);
            expect(rc).to.equal(true);
            var recovered_value = list.get(key)
            expect(recovered_value).to.equal(new_value)
        })     
        
        it("Caso 3 : Actualizar ultima clave insertada", () => {
            var new_value = "new_value"
            var key = "key3"
            var rc = list.update(key, new_value);
            expect(rc).to.equal(true);
            var recovered_value = list.get(key)
            expect(recovered_value).to.equal(new_value)
        })      
        
        it("Caso 4 : Actualizar una clave intermedia", () => {
            var new_value = "new_value"
            var key = "key2"
            var rc = list.update(key, new_value);
            expect(rc).to.equal(true);
            var recovered_value = list.get(key)
            expect(recovered_value).to.equal(new_value)
        })          
                                   
    })        

    describe("Recuperacion de claves", () => {
        let expected_sorted_keys;
        beforeEach("Inicializar lista y arreglo", () => {
            list.add("key2", "value2");
            list.add("key7", "value7");
            list.add("key3", "value3");
            list.add("key8", "value8");
            list.add("key1", "value1");
            expected_sorted_keys = ["key1", "key2", "key3", "key7", "key8"];
        })

        it("Caso 1 : Agregar clave menor a todas y recuperar ordenadas", () => {
            let key = "key0";
            let value = "value0";
            list.add(key, value);
                  
            // Agregar el nuevo valor y ordenar el arreglo 
            expected_sorted_keys.push(key);
            expected_sorted_keys.sort();

            let real_sorted_keys = list.getKeys();
            expect(expected_sorted_keys).to.eql(real_sorted_keys);
        })  

        it("Caso 2 : Agregar clave mayor a todas y recuperar ordenadas", () => {
            let key = "key9";
            let value = "value9";
            list.add(key, value);

            // Agregar el nuevo valor y ordenar el arreglo 
            expected_sorted_keys.push(key);
            expected_sorted_keys.sort();

            let real_sorted_keys = list.getKeys();
            expect(expected_sorted_keys).to.eql(real_sorted_keys);
        })    
        
        it("Caso 3 : Agregar clave intermedia y recuperar ordenadas", () => {
            let key = "key6";
            let value = "value6";
            list.add(key, value);

            // Agregar el nuevo valor y ordenar el arreglo 
            expected_sorted_keys.push(key);
            expected_sorted_keys.sort();

            let real_sorted_keys = list.getKeys();
            expect(expected_sorted_keys).to.eql(real_sorted_keys);
        })          
                                   
    })  

    describe("Borrar clave", () => {
        
        beforeEach("Inicializar lista", () => {
            list.add("key2", "value2");
            list.add("key7", "value7");
            list.add("key3", "value3");
            list.add("key8", "value8");
            list.add("key1", "value1");
        })

        it("Caso 1 : Borrar clave inexistente", () => {
            var key = "key45";
            var rc = list.delete(key);
            expect(rc).to.equal(false);
            var value = list.get(key);
            expect(value).to.equal(null);
        })    

        it("Caso 2 : Borrar clave que existia", () => {
            var key = "key7";
            var rc = list.delete(key);
            expect(rc).to.equal(true);
            var value = list.get(key);
            expect(value).to.equal(null);
        })      
        
        it("Caso 3 : Borrar clave en lista vacia", () => {
            var empty_list = new List();
            var key = "key7";
            var rc = empty_list.delete(key);
            expect(rc).to.equal(false);
            var value = empty_list.get(key);
            expect(value).to.equal(null);
        })         
                                   
    }) 
})
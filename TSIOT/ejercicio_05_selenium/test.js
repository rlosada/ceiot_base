const { By, Builder } = require("selenium-webdriver");
const { expect } = require("chai");


let url = "http://localhost:4200";  // Url donde escucha la aplicacion
let driver;                         // Instancia driver que interactua con el navegador

// init()
// Inicializa el driver
async function init() {
    driver = new Builder().forBrowser("firefox").build();
}

// term()
// Deinicializa el driver
async function term() {
    driver && driver.quit();
}

// logAsAdmin()
// Se logea como administrador
async function logAsAdmin() {
    let user   = "admin";
    let pass   = "admin";

    await driver.get(url);

    // Logearse con las credenciales de administrador
    await driver.findElement(By.id("username")).sendKeys(user);
    await driver.findElement(By.id("pwd")).sendKeys(pass);
    await driver.findElement(By.id("loginBtn")).click(); 
}

describe("Web application testing with selenium" , () => {
    
    beforeEach(async () => { await init(); });

    afterEach( () => { term(); })

    it("User invalido", async () => {
        let invalid_user = "invalido";
        let invalid_pass = "invalido";

        await driver.get(url);

        await driver.findElement(By.id("username")).sendKeys(invalid_user);
        await driver.findElement(By.id("pwd")).sendKeys(invalid_pass);
        await driver.findElement(By.id("loginBtn")).click();
        
        let e    = await driver.findElement(By.css(".error"));
	    let text = await e.getText();
        
	    expect(text  === 'Invalid credentials.').to.be.true;
    })    

    it("Password invalido", async () => {
        let user         = "admin";
        let invalid_pass = "invalido";

        await driver.get(url);

        await driver.findElement(By.id("username")).sendKeys(user);
        await driver.findElement(By.id("pwd")).sendKeys(invalid_pass);
        await driver.findElement(By.id("loginBtn")).click();
        
        let e    = await driver.findElement(By.css(".error"));
	    let text = await e.getText();
        
	    expect(text  === 'Invalid credentials.').to.be.true;
    })

    it("Login valido", async () => {
        let user = "admin";
        let pass = "admin";

        await driver.get(url);

        await driver.findElement(By.id("username")).sendKeys(user);
        await driver.findElement(By.id("pwd")).sendKeys(pass);
        await driver.findElement(By.id("loginBtn")).click();
        
        let e    = await driver.findElement(By.css("h2"));
	    let text = await e.getText();
        
	    expect(text  === 'User Details').to.be.true;
    })    
});

describe("Testing with user logged in" , () => { 

    beforeEach(async () => { 
        await init(); 
        await logAsAdmin();
    });

    afterEach( () => { term(); })

    it("Verificar titulos tabla de usuarios", async () => {
        let titles = ["Id", "Name", "Email", "IsAdmin"]
        let rc     = true;
       
        let thead = await driver.findElement(By.css("thead"));
        let ths   = await thead.findElements(By.css("th"));

        let i = 0;
        for(let e of ths) {
            if(i >= titles.length) {
                rc = false;
                break;                 
            }
            if (titles[i] !== await e.getText()) {
                rc = false;
                break;
            }
            i++;
        }
        if (i != titles.length) {
            rc = false;
        }

        expect(rc).to.be.true;
    })      

    it("Verificar entradas tabla de usuarios", async () => {
        let ncolums  = 5;
        let nbuttons = 2;
        let rc       = true;

        let data  = await driver.findElement(By.css("tbody"));
        let users = await data.findElements(By.css("tr"));

        for(let user of users) {
            let user_data = await user.findElements(By.css("td")); 

            if (ncolums != user_data.length) {
                rc = false;
                break;
            }

            // La primer columna debe contener un numero de id
            if (Number.isNaN(parseInt(await user_data[0].getText()))) {
                rc = false;
                break;
            }

            // La ultima columna debe a su vez contener dos botones
            let buttons  = await user_data[4].findElements(By.css("button"));
            if (nbuttons !== buttons.length) {
                rc = false;
                break;
            }
            // El primer boton debe ser para eliminar y el segundo para editar
            if((await buttons[0].getText() !== "Delete") || (await buttons[1].getText() !== "Edit")) {
                rc = false;
                break;
            }

        }
        expect(rc).to.be.true;
    })  

    it("Verificar link boton edit", async () => {
        let rc        = true;
        let data      = await driver.findElement(By.css("tbody"));
        let users     = await data.findElements(By.css("tr"));
        let user_data = await users[0].findElements(By.css("td")); 
        let buttons   = await user_data[4].findElements(By.css("button"));
        
        await buttons[1].click();

        let h2 = await driver.findElement(By.css("h2"));

        if(await h2.getText() !== "Edit User") {
            rc = false;
        }

        expect(rc).to.be.true;
    })     
    
    it("Verificar que existe el boton para agregar usuarios", async () => {
        let rc = false;
        
        // Recuperar el boton para agregar usuarios           
        let buttons   = await driver.findElements(By.css("button"));
        for(let i = 0; i < buttons.length; i++) {
            let text = await buttons[i].getText();
            if (text === "Add User") {
                rc = true;
                break;
            }
        }
        
        expect(rc).to.be.true;
    })           

    it("Cargar nuevo usuario", async () => {
        let user_id   = "usuario_" + Math.floor(Math.random() * 600000);
        let new_user  = {
                        name : user_id,
                        email : user_id + "@gmail.com",
                        password: "123456",
                        role: 1,
        };
        
        // Recuperar el boton para agregar usuarios           
        let buttons   = await driver.findElements(By.css("button"));

        // Click en Add User
        await buttons[1].click();

        // Cargar formulario. Debe tener 4 inputs { username, email, password, role }
        let inputs = await driver.findElements(By.css("input")); 

        inputs[0].sendKeys(new_user.name);
        inputs[1].sendKeys(new_user.email);
        inputs[2].sendKeys(new_user.password);
        inputs[3].sendKeys(new_user.role);

        // Recuperar el boton para agregar usuario           
        buttons   = await driver.findElements(By.css("button"));

        // Click en Add
        await buttons[1].click();

        // Verificar que el usuario ahora aparece en la lista de usuarios del sistema
        let rc    = false;
        let data  = await driver.findElement(By.css("tbody"));
        let users = await data.findElements(By.css("tr"));

        console.log(JSON.stringify(new_user));

        for(let user of users) {
            let user_data = await user.findElements(By.css("td")); 

            if ((await user_data[1].getText() === new_user.name) &&  (await user_data[2].getText() === new_user.email)) {
                rc = true;
            }
        }

        expect(rc).to.be.true;
    })         
});

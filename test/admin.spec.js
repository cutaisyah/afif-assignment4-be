let chai = require ("chai");
let chaiHttp = require ("chai-http");
let adminTest = require ("../routes/index");

//Assertion style
chai.should();
chai.use(chaiHttp);
describe("Admin Routes", ()=>{
    describe("Signup Admin", () => {
        it("It should POST to register new admin", (done) => {
            const admin = {
                username: "adi",
                email: "adi@mail.com",
                password: "123456",
                birthdate: 12-12-2012,
                phone: "08131312029",
                role_name: "admin",
            };
            chai.request(adminTest)                
                .post("/admin/signup")
                .send(admin)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('id').eq(1);
                    response.body.should.have.property('username').eq("adi");
                    response.body.should.have.property('email').eq("adi@mail.com");
                    response.body.should.have.property('password').eq("123456");
                    response.body.should.have.property('birthdate').eq(12-12-2012);
                    response.body.should.have.property('phone').eq("08131312029");
                    response.body.should.have.property('role_name').eq("admin");
                done();
                });
        });
        it("It should not POST to register new admin", (done) => {
            const admin = {
                role_name: "admin",
            };
            chai.request(adminTest)                
                .post("/admin/signup")
                .send(admin)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eq("tidak boleh ada data yang kosong");
                done();
                });
        });
    });

    describe("Update Admin", () => {
        it("It should Update an admin data", (done) => {
            const taskId = 1;
            const task = {
                username: "ali",
                email: "ali@mail.com",
                birthdate: 12-12-2012,
                phone: "08131312029",

            };
            chai.request(server)                
                .put("/api/tasks/" + taskId)
                .send(task)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('id').eq(1);
                    response.body.should.have.property('username').eq("ali");
                    response.body.should.have.property('email').eq("ali@mail.com");
                    response.body.should.have.property('birthdate').eq(12-12-2012);
                    response.body.should.have.property('phone').eq("08131312029");
                done();
                });
        });

        it("It should NOT UPDATE an admin data", (done) => {
            const taskId = 1;
            const task = {
                name: "Ta",
                completed: true
            };
            chai.request(server)                
                .put("/api/tasks/" + taskId)
                .send(task)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eq("The name should be at least 3 chars long!");
                done();
                });
        });        
    });

    
});
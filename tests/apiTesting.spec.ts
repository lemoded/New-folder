import { test, request, expect } from "@playwright/test";


let newreq2: any;

test.beforeAll('Before All api' , async() =>{
     newreq2 = await request.newContext({baseURL : "https://restful-booker.herokuapp.com",extraHTTPHeaders : {Accpt : "application/json"}});
})

test("api testing 1" , async({request}) =>
    {
        let responce = await request.get("https://restful-booker.herokuapp.com/booking",{headers : {Accept : "application/json"}});
        console.log((await responce.json()))

});
test("api testing 2" , async() =>
    {let newreq= await request.newContext({baseURL : "https://restful-booker.herokuapp.com",extraHTTPHeaders : {Accept : "application/json"}})
        let responce = await newreq.get("/booking");
        console.log((await responce.json()))

});
test("api testing 3" , async() =>
    {
        let responce = await newreq2.get("/booking");
        console.log((await responce.json()))

});

test("api testing 4" , async({request}) =>
    {
        let responce = await request.get("/booking");
        console.log((await responce.json()));

});

test("api testing 5" , async({request}) =>
    {
        let responce = await request.get("/booking",{params : {firstname : "John",lastname : "Smith"}});
        console.log((await responce.json()));
        expect(responce.status()).toBe(200);
        expect(responce.ok()).toBeTruthy();
});
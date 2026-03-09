let currentUser=null
let cart=[]

function addToCart(name,price){

cart.push({name,price})

updateCartUI()

alert(name+' added to cart')

}

function updateCartUI(){

cartCount.innerText=cart.length

let html=""
let total=0

cart.forEach(item=>{
html+=`<p>${item.name} - Ksh${item.price}</p>`
total+=item.price
})

cartItems.innerHTML=html
cartTotal.innerText="Total: KSH"+total

}

function openCart(){

cartPage.classList.toggle('hidden')

window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'})

}

function proceedCheckout(){

if(!currentUser){
alert("Please login before checkout")
showLogin()
return
}

alert("Proceeding to payment (STK Push or checkout page)")

}

function hideAll(){
loginBox.classList.add('hidden')
registerBox.classList.add('hidden')
}

function showLogin(){
loginBox.classList.remove('hidden')
loginEmail.focus()
}

function showRegister(){
registerBox.classList.remove('hidden')
regName.focus()
}

async function registerUser(){
  hideAll()
let name=regName.value
let email=regEmail.value
let password=regPass.value

if(name===''||email===''||password===''){
alert("Please fill all fields")
return
}

let res=await fetch('register.php',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({name,email,password})
})

let data=await res.json()

if(data.status==='success'){
alert('Registration successful')
showLogin()
}else{
alert('Registration failed')
}
}

async function loginUser(){
  hideAll()
let email=loginEmail.value
let password=loginPass.value

if(email===''||password===''){
alert("Enter email and password")
loginEmail.focus()
return
}

let res=await fetch('login.php',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({email,password})
})

let data=await res.json()

if(data.status==='success'){
currentUser=data.user

loginBtn.classList.add('hidden')
registerBtn.classList.add('hidden')
logoutBtn.classList.remove('hidden')

if(currentUser.email==='admin@telux.com'){
adminLink.classList.remove('hidden')
}

hideAll()

alert('Login successful')

}else{
alert('Invalid login')
}
}

function logout(){

currentUser=null

loginBtn.classList.remove('hidden')
registerBtn.classList.remove('hidden')
logoutBtn.classList.add('hidden')
adminLink.classList.add('hidden')

alert('Logged out')

}

function filterCategory(cat){

let products=document.querySelectorAll('.product-card')

products.forEach(p=>{

if(cat==='all'||p.dataset.category===cat){
p.style.display='block'
}else{
p.style.display='none'
}

})
}

function searchProducts(){

let input=searchInput.value.toLowerCase()

let products=document.querySelectorAll('.product-card')

products.forEach(p=>{

let name=p.querySelector('h4').innerText.toLowerCase()

if(name.includes(input)){
p.style.display='block'
}else{
p.style.display='none'
}

})
}

function showHome(){window.scrollTo(0,0)}

/* Image click zoom */
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');

document.querySelectorAll('.product-card img').forEach(img=>{
  img.addEventListener('click',function(e){
    e.stopPropagation();
    modal.style.display='flex';
    modalImg.src=this.src;
  });
});

modal.addEventListener('click',()=>{
  modal.style.display='none';
});

/* Go To Checkout */
function goToCheckout(){
 if(!currentUser){
  alert("Please login first to continue checkout");
  document.getElementById("loginForm").scrollIntoView({behavior:"smooth"});
  return;
 }

 hidePages();
 document.getElementById("checkoutPage").style.display="block";
}

/* Order Tracking Page */
function openTracking(){

const loggedIn = localStorage.getItem("userLoggedIn");

if(!loggedIn){
 alert("Login to track your orders");
 return;
}

hidePages();
document.getElementById("trackingPage").style.display="block";

}

/* Hide all pages */
function hidePages(){

const sections=["checkoutPage","trackingPage"];

sections.forEach(id=>{
 const el=document.getElementById(id);
 if(el) el.style.display="none";
});

}

/* Checkout Submit */
document.getElementById("checkoutForm").addEventListener("submit",function(e){
 e.preventDefault();

 const orderId = "ORD"+Math.floor(Math.random()*100000);

 localStorage.setItem("lastOrderId",orderId);

 alert("✅ Payment Successful! Your Order ID: "+orderId);

 hidePages();
 document.getElementById("trackingPage").style.display="block";

 document.getElementById("trackOrderId").value = orderId;
 trackOrder();

});

/* Track Order */
function trackOrder(){

const id=document.getElementById("trackOrderId").value;

if(!id){
 alert("Enter Order ID");
 return;
}

const statusSteps=[
"🧾 Order Confirmed",
"📦 Processing",
"🚚 Out for Delivery",
"✅ Delivered"
];

const step=Math.floor(Math.random()*statusSteps.length);


document.getElementById("orderStatus").innerHTML=
"Order <b>"+id+"</b><br>Status: <b>"+statusSteps[step]+"</b>";

}

/*Register API */
app.post("/register",(req,res)=>{

const {name, email,password} = req.body;

db.query(
"INSERT INTO users (name,email,password) VALUES (?,?,?)",
[name,email,password],
(err,result)=>{

if(err) return res.json({success:false});

res.json({success:true});

});

});

/* login API*/
app.post("/login",(req,res)=>{

const {email,password}=req.body;

db.query(
"SELECT * FROM users WHERE email=? AND password=?",
[email,password],
(err,result)=>{

if(result.length>0){
 res.json({success:true,user:result[0]});
}else{
 res.json({success:false});
}

});

});
/*ORDER APII */
app.post("/order",(req,res)=>{

const {user_id,total}=req.body;

db.query(
"INSERT INTO orders (user_id,total,status) VALUES (?,?,?)",
[user_id,total,"Processing"],
(err,result)=>{

res.json({
 order_id:result.insertId
});

});

});

/* TRACK API*/
app.get("/order/:id",(req,res)=>{

db.query(
"SELECT status FROM orders WHERE id=?",
[req.params.id],
(err,result)=>{

res.json(result[0]);

});

});

/*register button*/
document.getElementById("registerForm").addEventListener("submit", function(e){

e.preventDefault();

const name = document.getElementById("regName").value;
const email = document.getElementById("regEmail").value;
const password = document.getElementById("regPassword").value;

fetch("http://localhost:3306/register",{

method:"POST",
headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({
name:name,
email:email,
password:password
})

})

.then(res => res.json())
.then(data => {

if(data.success){

alert("Registration successful!");

localStorage.setItem("userLoggedIn", true);

}else{

alert("Registration failed");

}

});

});

/*login button*/
document.getElementById("loginForm").addEventListener("submit", function(e){

e.preventDefault();

const email = document.getElementById("loginEmail").value;
const password = document.getElementById("loginPassword").value;

fetch("http://localhost:3306/login",{

method:"POST",
headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({
email:email,
password:password
})

})

.then(res => res.json())
.then(data => {

if(data.success){

alert("Login successful!");

localStorage.setItem("userLoggedIn", true);

}else{

alert("Invalid login details");

}

});

});
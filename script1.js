import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

let wheel = document.querySelector('.wheel');
let spinBtn = document.querySelector('.spinBtn');
let Submit = document.querySelector('.Submit');
let num = document.querySelectorAll('.number');
let headerInfo = document.getElementById('info');
let infoBox = document.querySelector('.info-box');
let header = document.querySelector('.head');
let name = document.getElementById('name');
let place = document.getElementById('place');
let phone = document.getElementById('phone');
let form = document.getElementById('form');
let currentDegree = 0;
let count = 0;
let check = 1;
const firebaseConfig = {
    apiKey: "AIzaSyBv-bF1wwDY1EpzHq4L1E3B4KPEX0px8Ko",
    authDomain: "spinwheel-af038.firebaseapp.com",
    databaseURL: "https://spinwheel-af038-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "spinwheel-af038",
    storageBucket: "spinwheel-af038.firebasestorage.app",
    messagingSenderId: "341332533625",
    appId: "1:341332533625:web:3a1de937f25a831413cfa8",
    measurementId: "G-R69WNJN80B"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

if (window.innerWidth <= 980) {
    document.body.style.backgroundImage = "url('./phone.png')";
    num.textContent.style.transform = "scale(2)";
} else {
    document.body.style.backgroundImage = "url('./bg.png')";
}
    if (localStorage.getItem("turn-round") == null)
    {
        check = 1;
    }
    else
    {
        check = localStorage.getItem("turn-round");
    }
    if(check == 0)
    {
        headerInfo.textContent = "Chúc mừng bạn đã nhận được phong bao lì xì VOUCHER giảm " + localStorage.getItem("lastDis");
        infoBox.style.display ='block';
        spinBtn.style.display = 'none';
    }
header.textContent = "Bạn có " + check + " lượt quay may mắn !";
spinBtn.onclick = async function () {
    header.textContent = "Bạn có 0 lượt quay may mắn !";

    if (check == 1)
    {
        let spinValue = Math.ceil(Math.random() * 360) + 1800; 
        currentDegree += spinValue;
        wheel.style.transition = "transform 5s ease-out"; 
        wheel.style.transform = `rotate(${currentDegree}deg)`;
        count = 8-(spinValue %360 )/45;
        if (Math.round(count) == 8) count =0;
        if (Math.round(count) == 3)
        {
            headerInfo.textContent = "Chúc bạn may mắn lần sau !";
        }
        else headerInfo.textContent = "Chúc mừng bạn đã nhận được phong bao lì xì VOUCHER giảm " + num[Math.round(count)].textContent;
        setTimeout(function(){
            infoBox.style.display ='block';
            infoBox.style.animation = 'fadeInOut 1s ease-in-out forwards';
            spinBtn.style.display = 'none';
            localStorage.setItem("turn-round", 0);
            localStorage.setItem("lastDis", num[Math.round(count)].textContent);
            
        },6000);
    }
    else
    {
        alert("Bạn đã hết lượt quay");
    }


};

Submit.onclick = async function (event)
{
    if (!form.checkValidity() )
    {
        event.preventDefault(); 
        alert('Vui lòng điền đầy đủ thông tin!');
    }
    else 
    {
            if (phone.value.toString().length < 10 && phone.value.toString().length >11 && phone.value.toString()[0] != "0" &&phone.value.toString()[1] == "1" || phone.value.toString()[1] == "2" || phone.value.toString()[1] == "4" ||phone.value.toString()[1] == "6")
            {
             alert ("Vui lòng nhập lại số điện thoại ");
            }
            else
            {
                try {
                        await addDoc(collection(db, "users"), {
                            valueName: name.value,
                            valuePhone: phone.value,
                            valuePlace: place.value,
                            valueDiscount: num[Math.round(count)].textContent,
                            timestamp: new Date()
                        });
                    } catch (error) {
                        console.error("Error: ", error);
                    }
                        window.location.href = "https://www.facebook.com/Thinhnguyen19872022";
            }
    
    }
    
};

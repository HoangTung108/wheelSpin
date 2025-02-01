import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import {getDatabase,get, set, ref,onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
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
let checkData = null;
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
const dbrl = getDatabase(app);
if (window.innerWidth <= 980) {
    document.body.style.backgroundImage = "url('./phone.png')";
    let i = 0;
    num.forEach(item => {
        item.style.fontSize = "2.5em";
        item.style.textShadow = "3px 5px 2px rgba(0, 0, 0, 0.15)";
        if (i %2 == 0) item.style.color = "#fff";
        else item.style.color = "#ff0000";
        // item.style.transform = "rotate(45deg)";
        i ++;
    });
    
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
        headerInfo.textContent = "Chúc mừng bạn đã nhận được phong bao lì xì " + localStorage.getItem("lastDis");
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
        count = 8-(spinValue %360 )/45;
        if (Math.round(count) == 8 )
            {
                count =0;
            } 
        if (Math.round(count) == 7)
        {
            count = 0;
            currentDegree -= 45;
        }
        let snapshot = await get(ref(dbrl,"users/temp"));
        if (snapshot.exists())
        {
            checkData = snapshot.val();
        }
        if (checkData != 0 && Math.round(count) == 4){
            checkData -=1;
            await set(ref(dbrl,"users/temp"), checkData);
        }
        if (Math.round(count) == 4 && checkData ==0)
        {
            count = 5;
            currentDegree -= 45;
        }
        wheel.style.transition = "transform 5s ease-out"; 
        wheel.style.transform = `rotate(${currentDegree}deg)`;
        headerInfo.textContent = "Chúc mừng bạn đã nhận được phong bao lì xì " + num[Math.round(count)].textContent;
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
        if (phone.value.toString().length != 10 && phone.value.toString().length != 11 && phone.value.toString()[0] != "0" && !["3", "5", "7", "8", "9"].includes(phone.value.toString()[1])) {
            alert("Vui lòng nhập lại số điện thoại");
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
                        window.location.href = "https://www.facebook.com/thinh.nguyen.857817";
                        
            }
    
    }
    
};

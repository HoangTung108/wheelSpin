import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import {getDatabase,get, set, ref,onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
let wheel = document.querySelector('.wheel');
let spinBtn = document.querySelector('.spinBtn');
let Submit = document.querySelector('.Submit');
let span = document.querySelectorAll('.number');
let audio = document.getElementById('nhac');
let winner = document.getElementById('winner');
const num = ["10k", "50k" , "20k", "Dưỡng", "100k", "Bông 120 miếng", "Tê", "500k"];
let headerInfo = document.getElementById('info');
let infoBox = document.querySelector('.info-box');
let header = document.querySelector('.head');
let name = document.getElementById('name');
let place = document.getElementById('place');
let phone = document.getElementById('phone');
let form = document.getElementById('form');
let currentDegree = 0;
let count = 0;
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
    span.forEach(item => {
        item.style.fontSize = "2.5em";
        item.style.textShadow = "3px 5px 2px rgba(0, 0, 0, 0.15)";
        if (i %2 == 0) item.style.color = "#fff";
        else item.style.color = "#ff0000";
        i ++;
    });
    
} else {
    document.body.style.backgroundImage = "url('./bg.png')";
}
    if (localStorage.getItem("turn-round") == null)
    {
        localStorage.setItem("turn-round",1);
    }
 
    if(localStorage.getItem("reopen")==null)
    {
        localStorage.setItem("reopen",true);
    }
    if(localStorage.getItem("turn-round") == 0 && localStorage.getItem("reopen") == false)
    {
        headerInfo.textContent = "Chúc mừng bạn đã nhận được phong bao lì xì " + localStorage.getItem("lastDis");
        infoBox.style.display ='block';
        spinBtn.style.display = 'none';
        
    }
header.textContent = "Bạn có " + localStorage.getItem("turn-round") + " lượt quay may mắn !";
spinBtn.onclick = async function () {
    
    if (localStorage.getItem("turn-round") == 1)
    {
        let spinValue = Math.ceil(Math.random() * 360) + 1800; 
        currentDegree += spinValue;
        count = 8-(spinValue %360 )/45;
        if (Math.round(count) == 8 )
            {
                count =0;
            } 
        if (num[Math.round(count)] == "500k")
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
        if (num[Math.round(count)] == "100k" && checkData ==0)
        {
            count = 5;
            currentDegree -= 45;
        }
        header.textContent = "Bạn có 0 lượt quay may mắn !";
        wheel.style.transition = "transform 3s ease-out"; 
        wheel.style.transform = `rotate(${currentDegree}deg)`;
        audio.play();
        headerInfo.textContent = "Chúc mừng bạn đã nhận được phong bao lì xì " + num[Math.round(count)];
        setTimeout(function(){
            infoBox.style.display ='block';
            infoBox.style.animation = 'fadeInOut 1s ease-in-out forwards';
            spinBtn.style.display = 'none';
            localStorage.setItem("turn-round", 0);
            localStorage.setItem("lastDis", num[Math.round(count)]);
            audio.pause();
            winner.play();
        },5000);
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
                            valueDiscount: num[Math.round(count)],
                            timestamp: new Date()
                        });
                    } catch (error) {
                        console.error("Error: ", error);
                    }
                    infoBox.style.display ='none';
                    spinBtn.style.display = 'flex';
                    window.location.href = "https://www.facebook.com/thinh.nguyen.857817";
                    localStorage.setItem("reopen",false);
            }
    
    }
    
};

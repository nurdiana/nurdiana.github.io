let reason;
let xmlHttpMethod = new XMLHttpRequest();
let selectedMethod = 5;

if (localStorage.getItem('selectedMethod')) {
    selectedMethod = localStorage.getItem('selectedMethod');
}

xmlHttpMethod.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        let resultMethod = JSON.parse(this.responseText);
        let arrayMethod = Object.entries(resultMethod.data);
        let selectBox = document.getElementById('select-method');

        for(let i = 0, l = arrayMethod.length; i < l; i++){
            let option = arrayMethod[i];
            if(option[0] != "CUSTOM") {
                selectBox.options.add( new Option(option[1].name, option[1].id));
            }
            if(selectedMethod == option[1].id) {
                document.getElementById('select-method').value = option[1].id;
            }
        }

        document.getElementById('select-method').onchange = function() {
            try{
                localStorage.setItem('selectedMethod', document.getElementById('select-method').value);
                window.location.reload();
            } catch(error) {
                console.log(error);
            }
        };
    }
};
xmlHttpMethod.open("GET", "https://api.aladhan.com/v1/methods");
xmlHttpMethod.send();

//Get Date
let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0');
let yyyy = today.getFullYear();

let month = new Object();
month["01"] = "Januari";
month["02"] = "Februari";
month["03"] = "Maret";
month["04"] = "April";
month["05"] = "Mei";
month["06"] = "Juni";
month["07"] = "Juli";
month["08"] = "Agustus";
month["09"] = "September";
month["10"] = "Oktober";
month["11"] = "November";
month["12"] = "Desember";

let fullMonth = month[mm];

today = dd + '-' + mm + '-' + yyyy;

document.getElementById("today").innerHTML = dd + " " + fullMonth + " " + yyyy;
document.getElementById("this-month").innerHTML = fullMonth + " " + yyyy;

//default param
let latitude = -6.175110;
let longitude= 106.865036;


if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, geolocationError);
  } else {
    console.log("Geolocation is not supported by this browser.");
    getData();
}

function showPosition(position) {
    latitude =  position.coords.latitude; 
    longitude =  position.coords.longitude;
    getData();
}

function geolocationError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        reason = "karena menolak permintaan untuk Geolocation."
        break;
      case error.POSITION_UNAVAILABLE:
        reason = "karena informasi lokasi tidak tersedia."
        break;
      case error.TIMEOUT:
        reason = "karena permintaan lokasi timed out."
        break;
      case error.UNKNOWN_ERROR:
        reason = "karena ada error yang tidak diketahui."
        break;
    }

    document.getElementById("error-location").innerHTML = "Anda menggunakan lokasi default (Jakarta), " + reason + " Silahkan refresh browser untuk mengulang permintaan lokasi.";
    getData();
}

function getData() {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let myObj = JSON.parse(this.responseText);

            // Draw HTML table
            let table = document.getElementById("table");
            let tbody = document.getElementById("tbody");

            for (let data of myObj.data) {
                if (data.date.gregorian.date == today) {
                    document.getElementById("timezone").innerHTML = data.meta.timezone;
                    document.getElementById("longitude").innerHTML = data.meta.longitude;
                    document.getElementById("latitude").innerHTML = data.meta.latitude;

                    document.getElementById("fajr").innerHTML = data.timings.Fajr;
                    document.getElementById("dhuhr").innerHTML = data.timings.Dhuhr;
                    document.getElementById("asr").innerHTML = data.timings.Asr;
                    document.getElementById("maghrib").innerHTML = data.timings.Maghrib;
                    document.getElementById("isha").innerHTML = data.timings.Isha;
                }
                row = tbody.insertRow();

                let hijri = row.insertCell();
                hijri.innerHTML = data.date.hijri.date;

                let gregorian = row.insertCell();
                gregorian.innerHTML = data.date.gregorian.date;

                let fajr = row.insertCell();
                fajr.innerHTML = data.timings.Fajr;

                let dhuhr = row.insertCell();
                dhuhr.innerHTML = data.timings.Dhuhr;

                let asr = row.insertCell();
                asr.innerHTML = data.timings.Asr;

                let maghrib = row.insertCell();
                maghrib.innerHTML = data.timings.Maghrib;

                let isha = row.insertCell();
                isha.innerHTML = data.timings.Isha;
            }
        }
    };
    xmlhttp.open("GET", "https://api.aladhan.com/v1/calendar?latitude="+ latitude +"&longitude="+ longitude +"&method="+ selectedMethod +"&month="+mm+"&year="+yyyy);
    xmlhttp.send();
}
let {PythonShell} = require('python-shell')
let path = require("path")
let wasScanned = false

const show_password = (button, password) => {
   if(document.querySelector(`#${button}`).classList.contains('fa-eye-slash')) {
        document.querySelector(`#${button}`).classList.add('fa-eye');
        document.querySelector(`#${password}`).style.color = 'black';
        document.querySelector(`#${button}`).classList.remove('fa-eye-slash');
    }else {
        document.querySelector(`#${password}`).style.color = 'rgba(252, 184, 89, 1)'
        document.querySelector(`#${button}`).classList.remove('fa-eye');
        document.querySelector(`#${button}`).classList.add('fa-eye-slash');
    }
}

const show_wifi_data = (data) => {
    document.querySelector('#network_table').style.display = "table"
    document.querySelector('#loading').style.display = "none"

    data = data[0]
    data = data.replace(/'/g,'"')
    data = JSON.parse(String(data))

    let profiles = data[0]
    let passwords = data[1]

    console.log(JSON.stringify(profiles))
    console.log(JSON.stringify(passwords))

    if(wasScanned) {
      document.querySelector('#network_table').innerHTML = "" 
    }

    for(let i = 0; i < profiles.length; i++) {
      document.querySelector('#network_table').innerHTML += `
      <tr>
          <td>${profiles[i]}</td>
          <td id="password-${i}">${passwords[i]}</td>
          <td><i class="fa-solid fa-eye eye" id="see-${i}" onclick="show_password('see-${i}', 'password-${i}')"></i></td>
      </tr>`
    }

    wasScanned = true
}

const scan_wifi = () => {
    if(wasScanned) {
      document.querySelector('#network_table').style.display = "none"
    }
    document.querySelector('#loading').style.display = "inline-block"
    document.querySelector('#broadcast').style.display = "none"
  
    var options = {
      scriptPath : path.join(__dirname, '/../')
    }
  
    console.log(options)
    
    PythonShell.run('wifi_password.py', options, function (err, result){
      if (err) throw err;
      // result is an array consisting of messages collected
      //during execution of script.
      show_wifi_data(result)
    });
}
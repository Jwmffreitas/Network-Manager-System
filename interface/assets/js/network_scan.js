let {PythonShell} = require('python-shell')
let path = require("path")

let wasSearched = false


function network_scan() {
  document.querySelector("#button").disabled = true;
  if(wasSearched) {
    document.querySelector('#network_table').style.display = "none"
  }
  document.querySelector('#loading').style.display = "inline-block"
  document.querySelector('#local_network').style.display = "none"

  var options = {
    scriptPath : path.join(__dirname, '/../')
  }

  console.log(options)
  
  PythonShell.run('network_scan.py', options, function (err, result){
    if (err) throw err;
    // result is an array consisting of messages collected
    //during execution of script.
    show_network_data(result)
  });
}

const show_network_data = (data) => {
    document.querySelector('#network_table').style.display = "table"
    document.querySelector('#loading').style.display = "none"

    data = data[0]
    data = data.replace(/'/g,'"')
    data = JSON.parse(String(data))
    console.log(JSON.stringify(data))

    if(wasSearched) {
      document.querySelector('#network_table').innerHTML = "" 
    }

    data.map(endpoint => {
        console.log(JSON.stringify(endpoint))
        document.querySelector('#network_table').innerHTML += `
        <tr>
            <td>${endpoint.ip}</td>
            <td>${endpoint.mac}</td>
            <td>${endpoint.device}</td>
        </tr>`
    });

    wasSearched = true
    document.querySelector("#button").disabled = false;
}

module.exports = {
    network_scan
}
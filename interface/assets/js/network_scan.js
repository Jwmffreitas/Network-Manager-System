let {PythonShell} = require('python-shell')
var path = require("path")


function network_scan() {

  //var city = document.getElementById("city").value

  console.log(__dirname.replace(/\\/g, '/'))

  var options = {
    scriptPath : path.join(__dirname, '/../')
  }

  console.log(options)
  
  PythonShell.run('network_scan.py', options, function (err, result){
    if (err) throw err;
    // result is an array consisting of messages collected
    //during execution of script.
    //console.log('result: ', result.toString());
    show_network_data(result)
  });
}

const show_network_data = (data) => {
    document.querySelector('#network_table').style.display = "table"
    document.querySelector('#local_network').style.display = "none"

    data = data[0]
    data = data.replace(/'/g,'"')
    data = JSON.parse(String(data))
    console.log(JSON.stringify(data))

    data.map(endpoint => {
        console.log(JSON.stringify(endpoint))
        document.querySelector('#network_table').innerHTML += `
        <tr>
            <td>${endpoint.ip}</td>
            <td>${endpoint.mac}</td>
            <td>${endpoint.device}</td>
        </tr>`
    });
}

module.exports = {
    network_scan
}
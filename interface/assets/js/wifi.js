let {PythonShell} = require('python-shell')
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
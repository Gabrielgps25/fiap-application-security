function masked(data){
    let obj = Object.assign({}, data)
    Object.keys(obj).forEach(function(key) {
    
        if(key === "cpf"){
            obj[key] = obj[key].replace(/\.[0-9]{3}\.[0-9]{3}/, ".***.***");
        }else if(key === "email"){
            obj[key] = obj[key].replace(/.*@/, "*******@");
        }else if(key === "orientacao_sexual"){
            obj[key] = obj[key].replace(/.*/, "****");
        }
    });
    return obj;
}

function logInfo(message, body){
    var payload = {
        message: message,
        body: masked(body),
        severity: "info"
  }
  console.log(JSON.stringify(payload))
}

module.exports = {logInfo}



function escapeHtml(body) {
  
    const {password , ...other} = body
    console.log(body)
    let escape = {};
    for (const key in other) {
        if(Array.isArray(other[key])){
          let arr = []
          other[key].forEach(element => {
            arr.push(element?.replaceAll(/</g, "&lt;")
            .replaceAll(/>/g, "&gt;")
            .replaceAll(/\$/g, "&#3;")
            .replaceAll(/{/g, "&#;")
            .replaceAll(/}/g, "&#;"))
          })
          escape[key] = arr
        }else if(typeof other[key] == "boolean"){
          escape[key] = other[key]
        }else{
          escape[key] = other[key].replaceAll(/</g, "&lt;")
          .replaceAll(/>/g, "&gt;")
          .replaceAll(/\$/g, "&#3;")
          .replaceAll(/{/g, "&#;")
          .replaceAll(/}/g, "&#;");

}
        }
        
    if(password){
      escape.password = password
    }
    return escape 
  }


  module.exports = escapeHtml
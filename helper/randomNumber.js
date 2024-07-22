const randomNumber = (length) => {
    const characters = "1234567890"
    let res = ""
    for(let i=0; i<length; i++){
        res += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return res
}

module.exports = randomNumber
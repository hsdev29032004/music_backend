const randomHelper = require("../helper/random");

const convert = (s) => {
    return s
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .toLowerCase();
};

const slug = (s) => {
    let res = convert(s)
    
    res = res.replace(/[^a-z0-9\s]/g, '-');
    res = res.replace(/\s+/g, '-');
    res = res.replace(/-+/g, '-');
    res = res.replace(/^-|-$/g, '');
    
    res = res + '-' + randomHelper.randomToken(10);
    return res;
};

module.exports = { slug };

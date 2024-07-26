const randomHelper = require("../helper/random");

const convert = (s) => {
    const input = 'àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ';
    const output = 'aaaaaaaaaaaaaaaaaeeeeeeeeiiiiooooooooooooooooouuuuuuuuuuuyyyyyd';
    return s
        .toLowerCase()
        .split('')
        .map(char => {
            const index = input.indexOf(char);
            return index !== -1 ? output[index] : char;
        })
        .join('');
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

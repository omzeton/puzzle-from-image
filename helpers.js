const gcd = (a, b) => {
    let temp, m;
    if (b > a) {
        temp = a;
        a = b;
        b = temp;
    }
    while (b != 0) {
        m = a % b;
        a = b;
        b = m;
    }
    return a;
};

const ratio = (x, y) => {
    const c = gcd(x, y);
    return [x / c, y / c];
};

const shuffle = array => {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

export { ratio, shuffle };

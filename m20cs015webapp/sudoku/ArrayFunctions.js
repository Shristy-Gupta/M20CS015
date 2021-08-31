// Pulled from https://www.juniordevelopercentral.com/how-to-shuffle-an-array-in-javascript/#:~:text=The%20first%20and%20simplest%20way%20to%20shuffle%20an,array%20we%20get%20a%20random%20distribution%20of%20items.

const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

const randomArray = array => {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}
/**
 * A module containing helper functions specifically used to implement
 * groupController.js controller functions
 *
 * */

const {promiseBasedQuery} = require("./commonHelpers");

function shuffle(array) {
    /**
     *     Fisher-Yates shuffle algorithm from
     *     https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
     */
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

const createGroupsRandom = () => {
    /**
     * Given a list of students and the labs they are allocated to,
     * forms gr;poups within each lab randomly
     *
     */

}

const createGroupsDISC = () => {
    /**
     * Given a list of students and the labs they are allocated to,
     * forms groups within each lab according to a set of heuristics
     * designed to optimise group formation based on DISC personalities
     *
     */

}

const createGroupsOCEAN = () => {
    /**
     * Given a list of students and the labs they are allocated to,
     * forms groups within each lab according to a set of heuristics
     * designed to optimise group formation based on OCEAN personalities
     *
     */

}

const groupFormationStrategies = {
    /**
     *
     */
    "random": createGroupsRandom,
    "DISC": createGroupsDISC,
    "OCEAN": createGroupsOCEAN
}

// ...


module.exports = {
    groupFormationStrategies,
    shuffle
}
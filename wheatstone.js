//Implementing Wheatstone-PlayFair Cipher

class WheatStoneCipher {
    constructor(key) {
        this.key = key;
        this.key_mat = this.generate_matrix(key, "");
    }
    unique(text) {
        //convert the text as set to remove repeating letters and convert it into an array of chracters and use join and make it as a string
        let unique_string = Array.from(new Set(text)).join('');
        return unique_string;
    }

    //function to generate key matrix
    generate_matrix(key, msg) {
        //remove repeating characters from key and message
        key = this.unique(key);
        msg = this.unique(msg);
        let row = 0, col = 0;
        //initiate matrix 
        let matrix = [];
        //add key to the matrix
        let one_row = [];
        for (let i = 0; i < key.length; i++) {
            //if key goes more than 25 letters break that out
            if (row == 5) break;
            one_row.push(key[i]);
            if (col < 4) {
                col++;
            } else {
                matrix.push(one_row);
                one_row = [];
                col = 0;
            }
        }
        row = matrix.length;
        //add other alphabets into matrix
        let last_row = 0, last_col = 0; //to track the last letter which is not in msg
        for (let i = 97; i <= 122; i++) {
            if (!key.includes(String.fromCharCode(i))) { //if j is in the key, since we cant hold more than 25 letters we will remove the last one
                if (row == 5) {
                    if (msg.includes(String.fromCharCode(i))) {
                        matrix[last_row][last_col] = String.fromCharCode(i);
                    }
                    break;
                }
                if (!(msg.includes(String.fromCharCode(i)))) {
                    last_row = row;
                    last_col = col;
                }
                one_row.push(String.fromCharCode(i));
                if (col < 4) {
                    col++;
                } else {
                    matrix.push(one_row);
                    one_row = [];
                    row++;
                    col = 0;
                }
            }
        }
        return matrix;
    }

    //function to generate digraphs from message
    get_digraphs(text) {
        text = text.toLowerCase();
        let digraphs = [];
        let i = 0;
        while (i < text.length) {
            let digraph = text[i];
            //if the last letter stands alone add a bogus letter 'z'
            if (i + 1 == text.length) {
                digraph += 'x';
            } //if both the letters in the digram are same then add a bogus letter 'z'
            else if (text[i] == text[i + 1]) {
                digraph += 'x';
                //you should not jump to the next two letter to take a step back and jump two letters
                i--;
            } //else just make a digram with the next letter
            else {
                digraph += text[i + 1];
            }
            digraphs.push(digraph);
            //move to the next pair
            i += 2;
        }
        return digraphs;
    }

    //function to search for a digraph in the key matrix
    search(matrix, digraph) {
        let ele1 = digraph[0];
        let ele2 = digraph[1];
        let p1 = [-1, -1], p2 = [-1, -1];
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (matrix[i][j] == ele1) {
                    p1 = [i, j];
                }
                if (matrix[i][j] == ele2) {
                    p2 = [i, j];
                }
            }
        }
        return [p1, p2];
    }

    //function to encrypt the message with key as a base
    encrypt(message) {
        let key_mat = this.key_mat
        let digraphs = this.get_digraphs(message);
        let encrypted_text = "";
        for (let i = 0; i < digraphs.length; i++) {
            let pos = this.search(key_mat, digraphs[i]);
            let p1 = pos[0], p2 = pos[1];
            //if both are in same column take the below element (% n makes sure you come back to top when there is no element below it)
            if (p1[0] === p2[0]) {
                encrypted_text += key_mat[p1[0]][(p1[1] + 1) % 5];
                encrypted_text += key_mat[p2[0]][(p2[1] + 1) % 5];
            }
            // if both are in same row take the right element
            else if (p1[1] === p2[1]) {
                encrypted_text += key_mat[(p1[0] + 1) % 5][p1[1]];
                encrypted_text += key_mat[(p2[0] + 1) % 5][p2[1]];
            }
            // else just make a rectangle and take the elements from the opposite diagonal
            else {
                encrypted_text += key_mat[p1[0]][p2[1]];
                encrypted_text += key_mat[p2[0]][p1[1]];
            }
        }
        return encrypted_text;
    }

    //function to decrypt the message using key
    decrypt_using_key(encrypted_text) {
        let digraphs = this.get_digraphs(encrypted_text);
        let decrypted_text = "";
        for (let i = 0; i < digraphs.length; i++) {
            let pos = this.search(this.key_mat, digraphs[i]);
            let p1 = pos[0], p2 = pos[1];
            //if both are in same column take the below element ((ele - 1 - n) % n makes sure you come back to bottom when there is no element above it)
            if (p1[0] == p2[0]) {
                decrypted_text += this.key_mat[p1[0]][(p1[1] - 1 + 5) % 5];
                decrypted_text += this.key_mat[p2[0]][(p2[1] - 1 + 5) % 5];
            }
            // if both are in same row take the left element
            else if (p1[1] == p2[1]) {
                decrypted_text += this.key_mat[(p1[0] - 1 + 5) % 5][p1[1]];
                decrypted_text += this.key_mat[(p2[0] - 1 + 5) % 5][p2[1]];
            }
            // else just make a rectangle and take the elements from the opposite diagonal
            else {
                decrypted_text += this.key_mat[p1[0]][p2[1]];
                decrypted_text += this.key_mat[p2[0]][p1[1]];
            }
        }
        return decrypted_text;
    }
}

class SimulatedAnnealing {
    //Constructing a Simulated Annealing Object with given temperature and cooling rate
    constructor(temp, cooling_rate){
        this.temp = temp;
        this.cr = cooling_rate;
        this.alphabets = "abcdefghijklmnopqrstuvwxyz"
    }
    //Generate the neighbors by swapping the letters in the key
    generate_neighbors(guess) {
        let new_guess = Array.from(guess);
        // More sophisticated neighbor generation: swap two characters
        let index1 = Math.floor(Math.random() * new_guess.length);
        let index2 = Math.floor(Math.random() * new_guess.length);
        // Ensure index1 and index2 are different
        while (index2 == index1) {
            index2 = Math.floor(Math.random() * new_guess.length);
        }
        // Swap the characters at the two random indices
        let temp = new_guess[index1];
        new_guess[index1] = new_guess[index2];
        new_guess[index2] = temp;

        return new_guess.join("");
    }
    //Calculate accuracy by producing encrypted texts using the guess and comparing it with original encryptions
    calculate_accuracy(guess, words, encrypted_texts) {
        let test = new WheatStoneCipher(guess)
        let score = 0
        for(let j = 0; j < encrypted_texts.length; j++) {
            let encrypted_text = encrypted_texts[j]
            let word = words[j]
            let value = test.encrypt(word)
            for(let i = 0; i < encrypted_text.length; i++) {
                if(value[i] == encrypted_text[i]) {
                    score++;
                }
            }
        }return score
    }
    //function to decrypt the key
    decrypting_key(initial_guess, word, encrypted_text, iterations) {
        let current_guess = initial_guess;
        let current_score = this.calculate_accuracy(current_guess, word, encrypted_text); //Calculate initial score
        let best_guess = current_guess;
        let best_score = current_score;

        for (let i = 0; i < iterations; i++) {
            let new_guess = this.generate_neighbors(current_guess); // Generate new neighbor in each iteration
            let new_score = this.calculate_accuracy(new_guess, word, encrypted_text);
            let delta = new_score - current_score;
            //if the new guess is better choose it or randomly choose whether or not to pick new guess 
            if (delta > 0 || Math.random() < Math.exp(delta / this.temp)) {     //(< exp(delta/temp) ensures that new guesses are picked at the initial stage, allowing it to explore the search space
                current_score = new_score;
                current_guess = new_guess;
                if (current_score > best_score) {   //if new score is better than the best score make it as a best guess
                    best_guess = current_guess;
                    best_score = current_score;
                }
            }
            this.temp *= this.cr;       //reduce temperature at the rate of cooling rate to limit explorations
        }
        return [best_guess, best_score];
    }
}
let crack = new SimulatedAnnealing(100, 0.99)
let cipher = new WheatStoneCipher("monarchiest")
console.log(crack.decrypting_key("tseichmonar", ["instruments", "kavinraj", "hellyeah", "mountains"], [cipher.encrypt("instruments"), cipher.encrypt("kavinraj"), cipher.encrypt("hellyeah"), cipher.encrypt("mountains")], 100000))
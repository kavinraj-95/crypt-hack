//Implementing Wheatstone-PlayFair Cipher

function generate_matrix(key) {
    key = key.toLowerCase();
    let row = 0, col = 0;
    //initiate matrix with dummy variables
    let matrix = [
        ["0","0","0","0","0"],
        ["0","0","0","0","0"],
        ["0","0","0","0","0"],
        ["0","0","0","0","0"],
        ["0","0","0","0","0"]
    ];
    //add key to the matrix
    for(let i = 0; i < key.length; i++) {
        //if key goes more than 25 letters break that out
        if(row == 5) break;
        matrix[row][col] = key[i];
        if(col < 4){
            col++;
        }else{
            row++;
            col = 0;
        }
    }
    //add other alphabets into matrix
    for(let i = 97; i <= 122; i++) {
        if(!key.includes(String.fromCharCode(i)) && i != 106){
            //if j is in the key, since we cant hold more than 25 letters we will remove the last one
            if(row == 5) break;
            matrix[row][col] = String.fromCharCode(i);
            if(col < 4){
                col++;
            }else{
                row++;
                col = 0;
            }
            if(row == 5) break;
        }
    }

    return matrix;
}

function get_diagrams(text){
    let digraphs = [];
    let i = 0;
    while(i < text.length) {
        let digraph = text[i];
        //if the last letter stands alone add a bogus letter 'z'
        if (i + 1 == text.length) {
            digraph += 'z';
        } //if both the letters in the digram are same then add a bogus letter 'z'
        else if (text[i] == text[i + 1]) {
            digraph += 'x';
            //you should not jump to the next two letter to take a step back and jump two letters
            i--;
        }//else just make a digram with the next letter
        else{
            digraph += text[i + 1];
        }
        digraphs.push(digraph);
        //move to the next pair
        i += 2;
    }
    return digraphs;
}
